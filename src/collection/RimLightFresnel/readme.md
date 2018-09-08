# RimLightFresnel

轮廓边缘照明-菲涅尔反射。  

Code: [github.com/dtysky/paradise/tree/master/src/collection/RimLightFresnel](http://github.com/dtysky/paradise/tree/master/src/collection/RimLightFresnel)  

Demo: [paradise.dtysky.moe/effect/rim-light-fresnel](http://paradise.dtysky.moe/effect/rim-light-fresnel)  

## 原理

本次实现的效果是轮廓边缘内发光。顾名思义，其指的是在模型轮廓边缘内部的发光效果，核心是“边缘”和“内部”这两个词，也适合“外发光”（辉光、泛光）最大的区别。由于是在模型内部的发光，所以我们完全可以针对模型自身的材质去实现，不必使用后处理，这一点在性能上有所优势。当然，最重要的还是它本身能达到的效果的适用范围。

### 现实中的考察

计算机图形学很大一部分都是对现实的仿真，所以我们需要先考量一下这个效果在现实中的表现和原理。在现实中，边缘轮廓外发光最常见的例子就是一个平整而深远的水面，比如湖面。  

当我们站在湖边看着湖面时，你会发现在脚下的湖面中的水是透明的，其反射并不强烈，而当望向远处之时，却会发现水并不透明，反射十分强烈，有一种泛光的效果。也就是说，当你的视线和观察的具有此效应的物质表面的夹角越小时，反射约明显。  

这个现象也可以从玻璃珠观察到。当看向玻璃珠的中心之时，会发现反射比较弱，视线越靠近珠子两侧则反射越明显。

### 菲涅尔反射

上面的这种现象在光学中叫做[“菲涅尔反射”](https://zh.wikipedia.org/wiki/%E8%8F%B2%E6%B6%85%E8%80%B3%E6%96%B9%E7%A8%8B)。其本质上是由光从一种介质传播到另一种介质中的反射和折射造成的。一般来讲，对于金属外的绝大多数介质，光总在法线法线入射时**反射比最小**，即反光最少，而在和法线垂直的方向入射时，其反射比达到最大（不透射）。  

这也就是说，我们可以在计算机中很简单地模拟这种现象，只要有模型上某顶点的法线和当前摄像机的视线，便可以通过很小的计算量计算出光强，从而得到这种轮廓边缘内发光的效果。

### 法线与视线

对于是一直在关注此系列的同学，对于法线和视线应当不陌生了。法线信息存储在模型的顶点数据中，携带着对某一图元所在平面的垂直向量的方向信息。而视线，则指的是摄像机前向向量（对于THREEJS是`forward`属性）。  

有了法线和视线，结合上面所述的菲涅尔发射原理，我们便可以视线效果，首先在顶点着色器中计算光强：  

```glsl
uniform vec3 view_vector;
uniform float c;
uniform float p;

varying vec2 vUv;
varying float intensity;

void main() {
  vec3 v_normal = normalize(normalMatrix * normal);
	vec3 v_view = normalize(normalMatrix * view_vector);

	intensity = pow(c - dot(v_normal, v_view), p);
  vUv = uv;
	
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

片段着色器：

```glsl
uniform sampler2D diffuse;
uniform vec3 glow_color;

varying float intensity;
varying vec2 vUv;

void main() {
	vec3 glow = glow_color * intensity;
  
  gl_FragColor = vec4(glow, 1.0) + texture2D(diffuse, vUv);
}

```

以上shader中，`view_vector`为视线向量。我们首先将视线和法线和法线变换矩阵`normalMatrix`求叉积并归一化，得到正确的视线和法线向量。之后再对这二者求点积，这个点积本质上其实就是两个向量夹角的余弦，由于余弦函数的性质，可知实现和法线平行时其值最大，垂直时其值最小。这一点和我们需要的恰恰相反，考虑到只用关心模型朝向视线这一边的渲染，我们只需要考虑夹角在**-90 ~ 90deg**时的状况，显然得知其值域实际上是0 ~ 1，所以我们只需要简单得换算一下，便可以得到最终的结果：  

```glsl
intensity = 1 - dot(v_normal, v_view);
```

这便是最朴素的菲涅尔反射的光强计算。在此公式的计算下，当我们将这个材质运用到球体上时，球体上将会叠加一层“光罩”，光的强度在球心处为0，在球的边缘处为1。


### 更细致的控制

然而仅有朴素的效果是不够的，我们还希望对发光的效果有着更细致的控制，比如反光的范围、方向、光强增强的速度等。相比读者已经注意到了在顶点着色器中那个最终的公式了：  

```glsl
intensity = pow(c - dot(v_normal, v_view), p);
```

这个公式中有两个参数`c`和`p`，它们实际上就是提供效果细致控制的参数。其中`c`控制的是发光的方向和范围，`p`控制的是光强增强的速度和光强的极限。你可以在DEMO的调参控制器中调节它们来查看效果。

### 限制

菲涅尔反射是根据法线和视线的夹角来计算最终照明的光强的，所以对于**立方体**、**棱柱**这种平整模型，由于模型的每个面的法线都一致，所以无法达到想要的效果。如果一定要使用这种效果，可以考虑曲面细分平滑或者利用法线贴图来修改顶点法线。
