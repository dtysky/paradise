# ShaderWaterRipple

Water ripple by shader.  

Code: [github.com/dtysky/paradise/tree/master/src/collection/ShaderWaterRipple](http://github.com/dtysky/paradise/tree/master/src/collection/ShaderWaterRipple)  

Demo: [paradise.dtysky.moe/effect/shader-water-ripple](http://paradise.dtysky.moe/effect/shader-water-ripple)  

## 原理

涟漪，是指现实世界中水面上落入物体时、以物体为圆心向四周不断生成扩散圆形式的涟漪并逐渐衰减的现象。真实世界的涟漪十分复杂，在图形学中，我们只能模拟它来按达到一个近似效果。而为了模拟涟漪，图形学也提供了各种各样的方法，像是各种map（flow map）等，但在这里，为了最简化资源和达到最好的动态效果、并阐明原理，本例由纯Shader绘制。  

像是如何绘制一个平面并将贴图铺满这种前置工作我就不在赘述了。在这个效果中，我们首先要考虑的是如何模拟涟漪那**一圈一圈**的效果，这其实分为两个部分——其一是如何让贴图的像素进行偏移，另外则是如何绘制一个一个的圆，来使得贴图的像素按照这些圆进行偏移。  

第一部分的原理在之前的作品《2D Pixel Displacement》中已经说过了，其实就是利用某个值当做当前像素uv坐标的偏移量，再用偏移后的uv去采样纹理即可。而第二部分，则需要用到一些平面解析几何的知识了。  

### 基础

由于Shader中基本无法存储状态，所以只能由当前时刻的uv坐标和外部传入的变量（一般是当前时间time）来通过确定的公式算出，所以我们需要一个方程来描述距离某中心点不同距离的圆的信息：  

```glsl
vec2 tc = vUv.xy;
p = (tc - centre);
p.x = p.x * aspect;
len = length(p);
```

首先，我们拿到了当前像素的uv坐标`tc`，它是一个二位向量，对其和外部传入的uniform中心`centre`求差，得到其和中心的差值向量`p`，`p`携带了方向和距离两个信息，`len`即为其中的距离信息。（注意第三句，这里我用`p`的`x`分量乘了外部变量纵横比`aspect`，这是因为我们需要的是一个标准的圆，而要渲染的平面并非总是正方形，这就会导致uv坐标的比例不同）。  

有了每一点相对于中点的距离，那么计算哪些点属于同一个圆也就十分简单了——只要它们的`len`相同即可。从最简化的层面而言，为了模拟涟漪，我可以用下面的公式：  

```glsl
uv_offset = (p / len) * cos(len * 3.14) * amp;
```

余弦函数的基本形式是`y = cos(x)`，它的周期为2π，值域为-1 ~ 1，为了便于理解，这里将`len`作为自变量并乘以π，将周期标准化为1。如此一来，所有和中心点距离为len的采样点，其偏移向量的模均一致，但方向各不相同，为大小归一化过得方向向量`p / len`，这便构成了一个由平面法向量定义的圆环。  

之后将这个偏移向量加给原始的uv坐标，即可得到真实采样的坐标，计算颜色输出即可：  

```glsl
vec4 t_image = texture2D(image, fract(tc + uv));
gl_FragColor = t_image;
```

### 进阶

通过以上基础方法可以绘制得到一个从中心点向外扩散的、静态的涟漪，这个涟漪由若干个圆环构成，圆环的偏移从1 到 -1 再到 1，即包含一个波长。然而真实情况下，我们的一片涟漪显然不止一个波长，换言之，它是由许多个周期的圆环构成的；除此之外，我们还要给涟漪限定半径，让它能被控制在一定的范围内：  

```glsl
float waves_factor = waves * len / radius;
uv_offset = (p / len) * cos((waves * len / radius) * 3.14);
```

这里我引入了两个变量波数`waves`和半径`radius`，这个变换体现在函数曲线上，就是将上面公式中的函数曲线在定义域收缩了`waves / radius`，控制这二者可以让我们得到理想中的、一定半径下且具有一定数量的波的涟漪。  

然而有了这些还是不能让涟漪运动起来，我们还需要一个外部变量引入一个递增的概念，这个一般是时间`time`，然而二了精确控制涟漪出现和消失的整个过程，这里我引入了进度`current_progress`和速度`speed`，进度的范围是0 ~ 1，表明着一个涟漪整个生命周期，速度则表明波形波动的速度：  

```glsl
float waves_factor = waves * len / radius;
uv_offset = (p / len) * cos((waves_factor - current_progress * speed) * 3.14);
```

通过这两个变量，即可让涟漪从中线点向四周扩散，运动起来。但我们说这样还是不够的，它只能形成一个不断循环由瞬间消失的鬼畜效果，为了使得效果更佳真实，我这里引入一个通带`band`的变量，其范围是0~1，它定义了一个范围，只有在这个范围内的波才能被看到，否则将被裁剪：  

```glsl
float wave_width = band * radius;
float current_radius = radius * current_progress;
float cut_factor = clamp(wave_width - abs(current_radius - len), 0.0, 1.0);
uv_offset = (p / len) * cos((waves_factor - current_progress * speed) * 3.14) * cut_factor;
```

这里我将`band`首先归一到了最大半径的范围内，之后将其和当前采样点与当前波运动到的半径比较，算出一个裁剪系数`cut_factor`，如果采样点和当前半径的距离在归一化后的通带内，则为1，否则为0。  

然而这样会有个问题，若通带一直未一个静态量，那么最后涟漪还是会有在通带宽度的状态下突然消失的感觉。为了解决这个问题，这里再计算一个衰减系数`damp_factor`，其在一定进度前为1，之后逐渐变为0，将其和通带结合即可得出最后的裁剪系数，其含义是在某个时间段后逐渐压缩通带，直到进度为1时通带也被压缩为0：  

```glsl
float damp_factor = 1.0;
if (current_progress > .5) {
  damp_factor = (1.0 - current_progress) * 2.0;
}
float cut_factor = clamp(wave_width * damp_factor - abs(current_radius - len), 0.0, 1.0);
```

注意这里我计算了两个值，当前扩散半径`current_radius`和当前衰减系数`damp_factor`，这两个变量一个负责约束当前

在最后的最后，我们在配合一个可配置的振幅`amp`，其用于定义偏移量的峰值，即可得到最终的uv偏移：  

```glsl
uv_offset = (p / len) * cos((waves_factor - current_progress * speed) * 3.14) * amp * cut_factor;
```
