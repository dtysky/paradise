
一个使用纯CSS绘制的虹光波动图。  
[Code](http://github.com/dtysky/paradise/tree/master/src/collection/RainbowStarWave), [demo](http://paradise.dtysky.moe/rainbow-star-wave)

## 原理

其原理很简单，先生成DOM，再通过简单的`keyframes`配合`delay`来达到效果：  

### DOM

DOM元素通过参数`waves`和`lines`生成，其本质上生成的是一系列环状DOM，其中`waves`代表有多少圈，`lines`代表一圈有多少条线。  

换一个角度来看，这本质上构造了由一条条虚线拼凑出的一个圆环，虚线的数量由`lines`决定，每条虚线上的点数由`waves`决定。

### CSS

结合DOM元素来看，CSS做的事情就非常简单了，拆分来看，其无非是以下几个步骤：  

1. 自内而外扩大的圆环：只需要修改每一环的`scale`，使其从内而外逐渐扩大即可。
2. 点的外观：点的外观是基于线来确定的，每条虚线上点的形状、模糊、颜色、朝向都基本一致。其中形状可以用`border-radius`实现，模糊可以通过`box-shadow`来实现，颜色可以利用`hsl`色彩空间、通过变换其中的`hue`来实现，朝向则直接用`translate`以及`rotate`来实现。
3. 点的动画：写一个简单的`keyframes`来修改每一个点的`translate`和`scale`，使其同时进行位移和缩放，并无线循环。
4. 波动的效果：为了实现波动的效果，我们还需要给每个点的动画加上一个`delay`。不难理解，每条虚线上每个点的`delay`是相同的，而每个环上不同虚线上的点的`delay`是逐步递增的。
