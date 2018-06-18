# PixelDisplacement2D

2d pixel displacement mapping.  

Code: [https://github.com/dtysky/paradise/tree/master/src/collection/PixelDisplacement2D](http://github.com/dtysky/paradise/tree/master/src/collection/PixelDisplacement2D)  

Demo: [paradise.dtysky.com/effect/pixel-displacement-2d](http://paradise.dtysky.com/effect/pixel-displacement-2d)

## 原理

2D pixel displacement mapping，即2D像素位移映射（其实pixel换成fragment更合适，毕竟像素只是片段的一个子集），可以算作是3D vertex displacement mapping的一个变种。  

3D顶点位移映射，比如[displacement map](https://threejs.org/examples/webgl_materials_displacementmap.html)中的效果，本质上是用一个球体，加上一张灰度图（下称dMap）作为参考，在每一帧渲染时，通过dMap上的采样结果来决定3D模型上顶点的位移，而这一变换是在顶点着色器中实现的，所以其真正得改变了模型的数据。这个映射后面会专门有个作品来展示，这里不多说。  

回到2D像素位移映射，其实就是讲这种位移应用到了光栅化后的片段着色器中。其原理也很简单，让我们回想一下，现实生活我们去到了一个泳池，当水面有波动时，我们透过水面去看里面的东西其实从感官上而言是有偏移的，这个偏移则是相对于我们在空气中看到物体的实际位置，这种现象就是“光的折射”，而我们这个映射就是要模拟这种折射的效果。  

那么折射现象应该怎么用片段着色器描述呢？在片段着色器中，我们可以获得从顶点着色器传来的uv坐标，对于纯2D图像，这个就是归一化过的采样坐标，比如(0.5, 0.5)这个坐标就意味着着色器正在处理的点就是图像的中心。一般而言，我们可以通过这个坐标到对应的贴图上去采样：  

```glsl
vec4 t_image = texture2D(image, uv);
```

这里t_image得到的就是通过uv坐标在image贴图上采样到的rgba像素值。这时候位移映射要做的事情就非常明确了——只要在计算的时候给uv坐标一个偏移，那么我采样到的就是贴图上另一个坐标的像素：  

```glsl
vec4 t_image = texture2D(image, uv + vec2(0.1, 0.2));
```  

通过这句代码，我们将图像所有的像素值都向左偏移了(10%, 20%)。接下来，我们只需要对每一个不同uv坐标的片段做不同的位移就好了，这个位移的来源，其实就是dMap。在处理每个片段的时候，先采样dMap，用它的灰度加上处理作为位移值，之后将这个值应用到image贴图的采样中，就搞定啦：  

```glsl
  vec4 t_map = texture2D(map, vec2(vUv[0], vUv[1]));
  float offset = t_map.g;
  vec2 uv = vec2(vUv.x + offset, vUv.y + offset);

	vec4 t_image = texture2D(image, uv);
```

当然有这些还是不够的，目前我们只能得到一张静态的位移后的图，下一步我们需要让它动起来并且能控制其位移的程度。为了实现这些，我们需要三个uniform变量`u_time`, `scaleX`和`scaleY`，通过在js中更新这些变量，便可以间接地控制着色器中具体的坐标偏移量，比如下面这段代码就是通过一个不断递增的`u_time`去达到循环位移dMap的目的：  

```glsl
uniform sampler2D image;
uniform sampler2D map;
uniform float scaleX;
uniform float scaleY;
uniform float u_time;
varying vec2 vUv;

void main() {
  vec4 t_map = texture2D(map, fract(vUv + u_time);

  float offset = t_map.g;
  
  vec2 uv = vec2(
    vUv.x + offset * scaleX,
    vUv.y + offset * scaleY
  );

	vec4 t_image = texture2D(image, uv);

  gl_FragColor = t_image;
}
```

如此一来，dMap在渲染过程中不断平移，每个片段本次的uv偏移都是它邻点上一次的偏移，这样就可以有一种自然的波动效果了。
