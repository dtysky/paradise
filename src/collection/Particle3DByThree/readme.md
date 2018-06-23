# Particle3DByThree

Some particles.  

Code: [https://github.com/dtysky/paradise/tree/master/src/collection/Particle3DByThree](http://github.com/dtysky/paradise/tree/master/src/collection/Particle3DByThree)  

Demo: [http//:paradise.dtysky.com/particle-3d-by-three](paradise.alipay.net/particle-3d-by-three)

## 原理

这个效果是[3D Particle Explorations](https://tympanus.net/Development/3d-particle-explorations/)其中之一的实现。觉得蛮有意思满酷炫就研究实现了一下。  

### 基元

首先，顾名思义，这是一个粒子效果。和大多的粒子效果一样，它都是由一个一个小的“基元”组合而成的，而在本作品中这个基元就是“球体”，也就是说，那一个个粒子本质上是由SphereGeometry加上不同的Material形成的Mesh。对于本例的粒子，主要被设置的显示属性是半径、位置、颜色和透明度。  

### 生长

光有粒子本身是无法实现效果的，我们还需要让它们按照一定的规律动起来。这个动起来包括两部分——其一是粒子自身的约束，其二是粒子间的约束。  

首先是粒子自身的约束，这其实就是一个生命周期中，生长和消亡的过程。看到这个效果，我们很自然的可以想到——是不是有一个摄像机在对着粒子群，而粒子是在随着时间向着摄像头运动呢？当然是的，粒子群确实是在进行着“出生 -> 向摄像头运动 -> 消失”的生命循环，但实际上你会发现，仅仅是让粒子改变位置是无法达到这种效果的，我们还必须在粒子的一次生命周期中改变它的大小和透明度，使得变化更加自然：  

```ts
this.mesh.scale.set(scale, scale, scale);
this.mesh.position.setZ(z);
// 4为设定的边界，可以调整
(this.mesh.material as THREE.Material).opacity = (1 - Math.abs(z) / 4) * this.config.opacity;
```

但仅仅这样还是不够的，如果所有粒子的行为都一致，那么实际的效果也只是粒子群同时运动到了某一平面，并没有实际效果的那种层次感。所以必须有一种细致操控每一个粒子的方法，来使得它们的生长具有差异化。这个方法也很简单，就是——给每个粒子设置不同的出生时间`born`和生命`life`，然后通过这两个参数控制粒子运动的整个周期，这就可以是的粒子群在宏观上拥有一致的运动曲线和终点，而在微观上每一个粒子又都各有自己的特点：  

```ts
if (!this.initialized) {
  if (this.current < born) {
    this.current += deltaTime;
    return;
  }

  this.initialized = true;
  this.current = 0;
}

if (this.current + deltaTime > life) {
  return;
}

this.current += deltaTime;
```

这段代码说明了`born`、`life`的作用，它们决定了每个粒子开始运动和结束运动的时间。

### 运动曲线

光有时间无法让粒子运动起来，我们还需要根据时间去算粒子的`z`和`scale`，这就需要插值。一个简单的方式是线性插值，即值和时间成正比，但这显然无法达到我们的效果，我们需要的是一个Q弹的运动曲线，让每个粒子的运动有一种平滑自然的效果。  

一般而言，为了实现曲线，大家都会选择`Tween`或者近似品，但为了从全局严格管控每一个粒子的行为，我引入了更底层的**d3-ease**和**d3-interpolate**，前者是运动曲线生成库，后者是插值库，二者配合就可以算出粒子起始和终点属性中任意的平滑的值。  

现在让我们回到曲线本身，看着实例，想想我们究竟需要怎样的曲线？看起来像是`QuadInOut`对不对？不错，大概没错，但其实还是有些不同。`QuadInOut`的曲线是这样的：  

```txt
                           -
                          -
                        --
                      --
                   ---
                ---   
            ----
         ---
      ---
    --  
  --       
 -      
-        
```

但我们需要的曲线是这样的：  

```txt
                                          -
                                          -
                                        --
                                      --
                                  ---
                                ---   
            -------------------
         ---
      ---
    --  
  --       
 -      
-        
```


事实上，`QuadInOut`也不过是`QuadIn`和`QuadOut`的合成，它把两者各scale了0.5，之后再将二者拼起来，我们当然也可以这样做：  

```ts
export function customInOut (duration: number, point1: number, point2: number, current: number): number {
  if (current < point1) {
    return d3Ease.easeQuadIn(current / point1) / 2;
  } else if (current < point2) {
    return .5;
  }

  return d3Ease.easeQuadOut((current - point2) / (duration - point2)) / 2 + .5;
}
```

这里我将曲线分成了三个阶段，第一阶段用`QuadIn`，第二阶段保持状态，第三阶段用`QuadOut`，这就是我们需要的曲线。有了曲线，插值就十分简单了，根据阶段选择不同的插值器即可，这里不再赘述：  

```ts
const percent = customInOut(this.config.life, life * edgeTime1, life * edgeTime2, this.current);

if (percent === .5) {
  return;
}

const index = percent < .5 ? 0 : 1;
const realPercent = percent < .5 ? percent * 2 : percent * 2 - 1;
const {scale, z} = this.interpolates[index](realPercent);
```

### 斥力

到了这一步，粒子可以运动起来，也可以有层次感，但是不是觉得还少了些什么？对，还少了**散开**的效果。从实例中不难发现，粒子间的间距实际上是动态变化，当一个新的粒子插入粒子群时，所有的粒子开始动态调整间隙，一开始逐渐变大，到了一定的间隙之后基本保持不变。  

这个现象很自然得可以想到用**斥力**来描述，废话不多说放代码：  

```ts
for (let i = 0; i < count; i += 1) {
  const p1 = this.particles[i];
  const p1Pos = p1.mesh.position;

  if (!p1.initialized) {
    continue;
  }

  for (let j = 0; j < count; j += 1) {
    const p2 = this.particles[j];

    if (p1 === p2 || !p2.initialized) {
      continue;
    }

    const p2Pos = p2.mesh.position;
    const dx = p1Pos.x - p2Pos.x;
    const dy = p1Pos.y - p2Pos.y;
    const dist = dx * dx + dy * dy;
    const radii = (p1.size + p2.size) * (p1.size + p2.size) + spacing;

    if (dist < radii) {
      const angle = Math.atan2(dy, dx) + generateRandom(-0.05, 0.05);
      const diff = radii - dist;
      const x = Math.cos(angle) * diff * 0.05;
      const y = Math.sin(angle) * diff * 0.05;
      p1Pos.x += x * dTime;
      p1Pos.y += y * dTime;
      p2Pos.x -= x * dTime;
      p2Pos.y -= y * dTime;
    }
  }
}
```

这段代码简单明（cu）了（bao），就是遍历每一个粒子，然后去计算其他粒子对该粒子的力的作用，这里要注意两个约束：只有出生了的粒子才会进行计算，只有在两个粒子的间隙小于约束的间隙时才会进行调整，这样可以避免无效和错误的计算。

至此，整个系统就可以完美运行了。
