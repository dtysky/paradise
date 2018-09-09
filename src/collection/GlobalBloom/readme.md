# GlobalBloom

使用后处理实现的全局辉光。  

Code: [github.com/dtysky/paradise/tree/master/src/collection/GlobalBloom](http://github.com/dtysky/paradise/tree/master/src/collection/GlobalBloom)  

Demo: [paradise.dtysky.moe/effect/global-bloom](http://paradise.dtysky.moe/effect/global-bloom)  

## 原理

本次的效果是全局辉光（Bloom），又称泛光。它其实是一种作用于特定区域的外发光效果。

### 外发光

在游戏中，我们经常可以见到外发光的效果。典型的比如在室内场景的吊灯、电子设备的屏幕、室外夜晚的路灯，还有车灯等。这些场景的共性是它们提供了亮度和气氛的强烈视觉信息。当我们观看屏幕等物体时，它们到达眼睛的光强是有限的，所以我们便通过其周围的辉光/泛光/光晕来辨别它们。在现实中，这些辉光是由于光线在大气或我们眼睛中产生散射而造成的。而利用数字图像处理的方法，我们可以比较简单得模拟这种效果。

![](//src.dtysky.moe/image/blog/skill-2018_09_09a/0.jpg)

### RTT和后处理

一个最通用并且效果最佳的实现辉光的方法是**后处理**，它要求我们并不直接把主场景渲染的结果显示到屏幕上，而是将这个结果保存到一张纹理上，这个过程称为**RTT(渲染到纹理)**。拿到这个纹理之后，我们再渲染另一个只有一个全屏的Plane的场景，将前面保存的纹理作为贴图传入这个Plane的材质中进行渲染，在这个渲染的过程中我们可以添加一些特殊的效果，本质上，这些效果其实是应用于第一次渲染的主场景的图像的，所以这其实是一种**对当前渲染结果的数字图像处理**，这也就是后处理的本质。  

对于这里要说的全局辉光，下面这张图比较清晰得描述了整个过程：  

![](//src.dtysky.moe/image/blog/skill-2018_09_09a/1.jpg)

首先我们将主场景渲染到一张纹理上，而后将其应用到后处理专用场景中Plane的材质中，我们不断地重复RTT和后处理过程，最终得到了一张模糊后的纹理，最终我们将这个纹理和最初主场景的原始渲染纹理进行alpha混合，便可以得到最终的结果。下面让我们细致地分析一下整个过程。

### 渲染主场景

首先我们将主场景渲染到纹理：  

```ts
this.rendererTarget0 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
this.renderer.render(this.scene, this.camera, this.rendererTarget0, true);
```

我们将this.rendererTarget0保存下来，作为最后混合的原始图像和阈值化的输入。

### 阈值化

当将主场景渲染到纹理后，我们要做的第一步就是阈值化。阈值化是图像处理中的一个概念，其本质是是将灰度高于某个值的像素颜色设为1，反之设为0，这是针对灰度图像的阈值化。而在本例中，我们对这个阈值化进行特例化——我们设定一个阈值，将纹理中灰度低于这个阈值的像素设为(0, 0, 0)，而灰度高于此阈值的像素，则保留，如此一来我们便可以得到一张只有“辉光”处色彩信息的纹理。将这张纹理保留下来，进行下一阶段：  

![](//src.dtysky.moe/image/blog/skill-2018_09_09a/2.jpg)

这里有两个注意点，其一是**阈值的选取**，其二是**降采样**。  

阈值的选取决定着辉光像素的筛选，一般有两种方法——全局阈值和局部阈值，全局阈值又有玄学调参、直方图选取等方式，局部阈值要和局部滤波器结合，这些内容在我大学时的论文中有详细分析，详见[FPGA/图像处理】点操作—阈值化](http://dtysky.moe/article/Skill-2015_05_16_a)、[FPGA/图像处理】局部滤波器-局部阈值化](http://dtysky.moe/article/Skill-2015_05_22_a)。

降采样，则是指降低纹理分辨率，降低后处理运算的开销。一般来讲是将要后处理的纹理降低到屏幕大小的四分之一，这样也可以使得模糊运算用更小的窗口模糊更大的范围。当然降采样也会带来**走样**的问题，这个的解决方法需要具体项目具体考量，这里不再赘述。  

下面来看看代码：  

```ts
this.rendererTarget1 = new THREE.WebGLRenderTarget(window.innerWidth / 2, window.innerHeight / 2);

this.quad.material = this.thresholdMaterial;
this.thresholdMaterial.uniforms.tDiffuse.value = this.rendererTarget0.texture;
this.renderer.render(this.finalScene, this.finalCamera, this.rendererTarget1, true);
```

```glsl
uniform float threshold;
uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {
  vec4 color = texture2D(tDiffuse, vUv);
  float gray = color.r * .299 + color.g * .587 + color.b * .114;
  float th_color = gray > threshold ? 1. : 0.;

  if (gray > threshold) {
    gl_FragColor = color;
  } else {
    gl_FragColor = vec4(0., 0., 0., 1.0);
  }
}
```

可见，这里我通过阈值`threshold`来控制哪些像素和辉光像素。

### 分步模糊

得到了阈值化并降采样后的纹理`rendererTarget1`后，便可以进行下一步的模糊了。模糊本质上是一种利用卷积计算的局部滤波器，这一点可以参考我之前对均值滤波器的分析：[【FPGA/图像处理】局部滤波器-均值滤波器](http://dtysky.moe/article/Skill-2015_05_20_b)。一般而言，此种模糊使用的都是[高斯模糊](https://zh.wikipedia.org/wiki/%E9%AB%98%E6%96%AF%E6%A8%A1%E7%B3%8A)，但我这里为了代码简单实例，用了一个XJB搞的均值滤波器。  

如果看完了上面的文章，读者应该了解到局部滤波器本质上都是在一个**窗口**中完成的，窗口的大小一般为3x3、5x5等，而处理，则是以当前像素为中心取得的窗口中所有像素做一个卷积运算，当然在此DEMO的做法中是全部相加然后除以一个玄学值`N`，这相当于乘了一个所有元素都是`1/N`的卷积。  

一般而言，这种操作对于每个像素都要做一个双重循环，毕竟要遍历每一行的每一列嘛，这样一来，如果是一个`n x n`的窗口，运算的总时间复杂度是`O(n^2)`（GPU运算先天并行，不考虑纹理大小）。这里我们就可以想到，能不能拆分行和列的两次模糊，来降低时间复杂度呢？当然是可以的，这也就是所谓的**分布模糊**。  

分布模糊的想法很简单，就是**以空间换时间**，我们先对每个像素进行横向的模糊，渲染到一个纹理，然后再输入这个纹理，对每个像素进行纵向的模糊。这样一来，我们仍然可以得到最后的模糊结果，而时间复杂度却降到了`O(n)`：  

![](//src.dtysky.moe/image/blog/skill-2018_09_09a/3.jpg)

![](//src.dtysky.moe/image/blog/skill-2018_09_09a/4.jpg)

让我们看看代码：  

```ts
this.rendererTarget2 = new THREE.WebGLRenderTarget(window.innerWidth / 2, window.innerHeight / 2);

this.quad.material = this.localFilterMaterial;
this.localFilterMaterial.uniforms.vDirection.value = false;
this.localFilterMaterial.uniforms.tThreshold.value = this.rendererTarget1.texture;
this.renderer.render(this.finalScene, this.finalCamera, this.rendererTarget2, true);

this.localFilterMaterial.uniforms.vDirection.value = true;
this.localFilterMaterial.uniforms.tThreshold.value = this.rendererTarget2.texture;
this.renderer.render(this.finalScene, this.finalCamera, this.rendererTarget1, true);
```

```glsl
#define WINDOW_SIZE 5.
#define DOUBLE_WINDOW_SIZE 10.

uniform float stepSize;
uniform bool vDirection;
uniform sampler2D tThreshold;

varying vec2 vUv;

void main() {
  vec4 blur = texture2D(tThreshold, vUv);
  
  if (vDirection) {
    for (float i = 1.; i <= WINDOW_SIZE; i += 1.) {
      blur += texture2D(tThreshold, vUv + vec2(0., i * stepSize));
      blur += texture2D(tThreshold, vUv - vec2(0., i * stepSize));
    }
  } else {
    for (float i = 1.; i <= WINDOW_SIZE; i += 1.) {
      blur += texture2D(tThreshold, vUv + vec2(i * stepSize, 0.));
      blur += texture2D(tThreshold, vUv - vec2(i * stepSize, 0.));
    }
  }
  
  blur.rgb = blur.rgb / DOUBLE_WINDOW_SIZE;

  gl_FragColor = blur;
}
```

这里我用`vDirection`控制是横向模糊还是纵向模糊，用`stepSize`控制窗口中每个像素的uv偏移，用`WINDOW_SIZE`定义窗口大小。通过这两次运算，便得到了模糊后的高光纹理图像。

### 辉光和色调映射

有了原始的渲染纹理和模糊后的辉光纹理，我们便可以进行最后的混合了：  

```ts
this.quad.material = this.bloomMaterial;
this.bloomMaterial.uniforms.tDiffuse.value = this.rendererTarget0.texture;
this.bloomMaterial.uniforms.tBlur.value = this.rendererTarget1.texture;
this.renderer.render(this.finalScene, this.finalCamera);
```

```glsl
uniform sampler2D tDiffuse;
uniform sampler2D tBlur;
uniform float toneExp;

varying vec2 vUv;

void main() {
  vec3 diffuseColor = texture2D(tDiffuse, vUv).rgb;
  vec3 blurColor = texture2D(tBlur, vUv).rgb;

  vec3 result = diffuseColor + blurColor;
  
  result = vec3(1.) - exp(-result * toneExp);

  gl_FragColor = vec4(result, 1.);
}
```

可见我分别对两个纹理进行了采样，而后将它们简单地混合到了一起，当然我这里没有用alpha混合而是简单的色彩混合，这和我前面模糊时的做法有关。由于是色彩混和，所以相加得到的结果`result`中的色彩值可能会超过`0 ~ 1`的色域，也就是说，我们得到的是一个高动态范围的结果。这就需要我们用**Tone Mapping（色调映射）**方法，来将高动态的渲染结果归一化到有限动态范围中，这也是**HDR**的原理之一。  

色调映射本身是一个大话题，其发展历史和种类都十分繁多，在这里我们使用的是一种简单高效效果又不错的方法，即公式`result = vec3(1.) - exp(-result * toneExp);`，这个公式利用定义域在`-∞ ~ 0`的指数函数来进行映射，配合一个参数`toneExp`来调整曲线。  

至此，我们便得到了最终的结果：  

![](//src.dtysky.moe/image/blog/skill-2018_09_09a/5.jpg)

### 非后处理实现

对于少量模型的局部辉光也是可行的，但技术和上面的描述完全不同。它本质上是创建一个Billboard，上面渲染着平滑的“辉光纹理”，而后让这个Billboard跟随着要进行辉光的模型。但这种方法通常还是比较适用于2D物体，对于要时长变换视角的3D物体比较困难，适用面比较窄吧。
