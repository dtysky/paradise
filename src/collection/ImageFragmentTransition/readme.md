# ImageFragmentTransition

2D图形碎片化转换鲜果。  

Code: [github.com/dtysky/paradise/tree/master/src/collection/ImageFragmentTransition](http://github.com/dtysky/paradise/tree/master/src/collection/ImageFragmentTransition)  

Demo: [paradise.dtysky.moe/effect/image-fragment-transition](http://paradise.dtysky.moe/effect/image-fragment-transition)  

## 原理

这是一个非典型的顶点着色器实现的顶点动画的例子。它构造了一个可被打碎的平面，使得我可以在碎片化的过程中对两张图片做平滑过渡。

### 使用顶点构成三角片

看到这里，需要读者对OpenGL图形绘制底层有基本的了解。我们知道，OpenGL绘制一个曲面，本质上绘制的是一个个顶点构成的一个个三角面，这一个个三角面组合起来，便形成了整体的曲面。而这些顶点数据都是存储在buffer中的，我们需要一开始生成一个buffer，然后将其作为attributes一次性提交给GPU，之后就可以通过少量uniform变量控制渲染啦。  

以ThreeJS为例，为了绘制一个三角形，我们需要进行几个步骤：  

1. 构造基于Buffer的几何体并生成顶点数据：

```ts
function disposeArray() {
  this.array = null;
}

const geometry = new THREE.BufferGeometry();
const positions = [x0, y0, z0, x1, y1, z1, x2, y2, z2];

geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3).onUpload(disposeArray));
```

注意这里最后一句，我们将`positions`中的每三个数据为一组(x, y, z)，将其作为attribute `position` 提交给GPU，并在提交后回收掉CPU这边的数组，避免内存浪费。提交之后，我们便可以在shader中使用数据了，注意shader中是针对每个顶点做处理，所以拿到的自然是`vec3`变量：  

```glsl
attribute vec3 position;
```

2. 编写shader，构造材质：

```ts
const material = new THREE.RawShaderMaterial({
    uniforms,
    vertexShader: shaders.vertex,
    fragmentShader: shaders.fragment
  });
material.needsUpdate = true;  
```

在这里，我们传入构造好的uniforms（主要是为了传入纹理和各个矩阵，有时也是为了动画），加之vertexShader和fragmentShader，便可以完成材质的构造。

3. 生成曲面：

```ts
const mesh = new THREE.Mesh(geometry, material);
```

将曲面添加到场景后，启动渲染，便可以看到一个三角片了。

### 使用三角片构造平面

光有一个三角片当然不够，接下来我们要构造一个平面。这其实也很简单，依样画葫芦重复构造三角片就OK。让我们想想——一个矩形该如何用三角形构造？当然是用两个对称的三角形拼起来啦：  

```ts
const positions = [l, t, 0, r, t, 0, l, b, 0, l, b, 0, r, b, 0, r, t, 0];
```

这里我构造了两个拼在一起的三角形，拼在一起就构成了矩形，其中l、r、t、b分别表示矩形的左右上下边界，由于是在xy平面，z都是0。

然而只是这样还是不够，我们需要的是碎片，很多很多碎片，不过这也不难办，只要将一个大矩形分隔成若干个小矩形，再将每个小矩形分割成两个三角片不就好了嘛：  

```ts
const stepX = .1;
const stepY = .05;
const hStepX = stepX;
const hStepY = stepY;

for (let x = left; x < right; x += stepX) {
  for (let y = top; y < bottom; y += stepY) {
    const xL = x;
    const xR = x + hStepX;
    const yT = y;
    const yB = y + hStepY;

    positions.push(xL, yT, 0);
    positions.push(xL, yB, 0);
    positions.push(xR, yB, 0);
    positions.push(xL, yT, 0);
    positions.push(xR, yT, 0);
    positions.push(xR, yB, 0);
  }
}
```

其中stepX和stepY分别为小矩形的宽度和高度，通过这段代码，我们便生成了很多个小碎三角片构成的大矩形。

### 着色

上面说的都是如何生成顶点，但还有很重要的一步没说——如何给三角片着色？有过一定基础的同学应该都知道，在fragment shader中我们一般是通过uv坐标来采样纹理输出颜色，大家有没想过这个uv是从哪来的？不错，这个uv实际上是从vertex shader中的attribute变量传来的，而这个attribute和`position`一样，都是在CPU中算好（存储在模型顶点数据中）的：  

```ts
for (let x = left; x < right; x += stepX) {
  for (let y = top; y < bottom; y += stepY) {
    // positions
    ......

    uvs.push((xL + right) / width, (yT + bottom) / height);
    uvs.push((xL + right) / width, (yB + bottom) / height);
    uvs.push((xR + right) / width, (yB + bottom) / height);
    uvs.push((xL + right) / width, (yT + bottom) / height);
    uvs.push((xR + right) / width, (yT + bottom) / height);
    uvs.push((xR + right) / width, (yB + bottom) / height);
  }
}

geometry.addAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2).onUpload(disposeArray));
```

在这里，我们计算了每个顶点的uv坐标，并一并作为`uv`这个attribute提交给了GPU，然后便可以在shader中使用：  

```glsl
attribute vec2 uv;
```

### 打碎！添加attribute连接顶点

到此为止，我们应该可以渲染出来一张正常的图片了，我知道你们想说什么：费这么大事就为了渲染张图片？不要急，我们接下来只需要一点小技巧，便可以实现一个简单的碎片化效果：  

```glsl
vec3 new_position = position;
new_position.z += position.x;

gl_Position = projectionMatrix * modelViewMatrix * vec4(new_position, 1.0);
```

通过这几句代码，我们将每个顶点的z坐标位移了其x坐标的距离，理论上，我这么写想达到一个“从左到右，三角片一层一层铺开”的效果。然而事与愿违，如果你去运行这段代码，会发现整个图片还是连续的，只不过发生了在x-z平面的斜切罢了。想一想，会发生这种状况的原因是什么？其实很简单，对于两个相邻的三角片，它们的三个顶点中有两个是重合的，重合的顶点自然会如果不加处理，它们的位置变换将会保持一致，这样一来，所有重合的顶点其实可以视为一个顶点，所以才会导致变换后的图像仍然连续。  

为了解决这个问题，我们要给同不同三角片的各个顶点不同的新attribute变量，来表明它们不同于重合点的属性。比如在3D模型中，有法线`normal`这个属性，它表明顶点的法线方向。在这个例子中，我们可以构造个叫做`centre`的属性，其表明每个三角片的中心点，然后再让三个顶点都拥有同样的`centre`属性：  

```ts
for (let x = left; x < right; x += stepX) {
  for (let y = top; y < bottom; y += stepY) {
    // positions, uvs
    ......

    for (let i = 0; i < 3; i += 1) {
      centres.push(xL + (xR - xL) / 4, (yT + yB) / 2, 0);
    }

    for (let i = 0; i < 3; i += 1) {
      centres.push(xR - (xR - xL) / 4, (yT + yB) / 2, 0);
    }
  }
}

geometry.addAttribute('centre', new THREE.Float32BufferAttribute(centres, 3).onUpload(disposeArray));
```

之后顶点的变换都以这个中心点的位置为基准，如此一来，便可以区分每个重合但不在同一个三角面的顶点了：

```glsl
new_position.z += centre.x;
```

### 动起来

现在，我们已经可以静态地打碎一张我们为其赋予纹理的图片了，但怎么让这个打碎的过程动起来呢？  

这里的方案是引入外部uniform变量`progress`，这个变量是一个范围是0~1的自增变量，它表明运动的进度。结合这个变量和一些其他的变量，加之自己喜欢的顶点变换逻辑（公式），我们便可以实现很多惊艳的效果，比如此例中，我以图片中心点和顶点的距离为基准，结合`progress`，使用三角函数来控制x、y坐标，并赋予每个顶点的z坐标一定的差值，最终加上旋转让整个效果更富有动感：  

```glsl
attribute vec3 position;
attribute vec3 centre;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float progress;
uniform float top;
uniform float left;
uniform float width;
uniform float height;

varying vec2 vUv;

vec3 rotate_around_z_in_degrees(vec3 vertex, float degree) {
	float alpha = degree * 3.14 / 180.0;
	float sina = sin(alpha);
	float cosa = cos(alpha);
	mat2 m = mat2(cosa, -sina, sina, cosa);
	return vec3(m * vertex.xy, vertex.z).xyz;
}

void main() {
	vUv = uv;
	vec3 new_position = position;
	vec3 center = vec3(left + width * 0.5, top + height * 0.5, 0);
	vec3 dist = center - centre;
	float len = length(dist);
	float factor;

	if (progress < 0.5) {
		factor = progress;
	} else {
		factor = (1. - progress);
	}

	float factor1 = len * factor * 10.;
	new_position.x -= sin(dist.x * factor1);
	new_position.y -= sin(dist.y * factor1);
	new_position.z += factor1;
	new_position = rotate_around_z_in_degrees(new_position, progress * 360.);

	gl_Position = projectionMatrix * modelViewMatrix * vec4(new_position, 1.0);
}
```

### 两张图片自然过渡

顶点动画到这里就结束了，对于本效果，最后还需要考虑的一点是如何让两张图片能自然得过渡。其实这一点在上面的vertex shader中就有所体现了——我以0.5为分界点，将整个运动的周期分为了两部分，第一部分平面逐渐被打碎，第二部分碎片逐渐收缩回平面。  

而配合vertex shader，适当得编写fragment shader便可以轻松完成两个纹理的自然过渡：  

```glsl
uniform sampler2D image1;
uniform sampler2D image2;
uniform float progress;

varying vec2 vUv;

void main() {
  vec4 t_image;
  vec4 t_image1 = texture2D(image1, vUv);
  vec4 t_image2 = texture2D(image2, vUv);

  t_image = progress * t_image1 + (1. - progress) * t_image2;

  gl_FragColor = t_image;
}
```

利用`progress`，将两个纹理按照不同的权重混色起来即可。
