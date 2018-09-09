# GlowEmissiveMap

基于EmissiveMap的辉光的例子。  

Code: [github.com/dtysky/paradise/tree/master/src/collection/GlowEmissiveMap](http://github.com/dtysky/paradise/tree/master/src/collection/GlowEmissiveMap)  

Demo: [paradise.dtysky.moe/effect/glow-emissive-map](http://paradise.dtysky.moe/effect/glow-emissive-map)  

## 原理

一般的辉光流程按照上一章的**全局辉光-后处理+色调映射**即可实现，不过那个实现方法有个弊端，就是阈值化这一步，辉光部分的筛选是程序决定的，很大程度上不可控，在现实应用中，我们需要更可控的方法来操纵辉光达到想要的效果。

### 自发光贴图

决定最终渲染风格的是美术人员，所以我们当然希望美术能决策整个场景，甚至将这种决策细化到单个模型。方法也很简单，和其他很多效果一样，我们可以建立一张纹理，通过采样这个纹理来决定辉光的强度和颜色，借此来取代阈值化的过程。  

比如在这个DEMO中，我渲染了一个宇宙战舰（Unity免费模型），为了让战舰的特定部分辉光，我直接用EmissiveMap，即自发光纹理作为辉光的来源，由于战舰整体分为三个部分，我这里只给出一个部分的EmissiveMap作为实例：  

![](//src.dtysky.moe/image/blog/skill-2018_09_09a/6.jpg)

整体的渲染流程和标准的全局辉光并无区别，在第一步还是正常地渲染整个场景，只是在筛选辉光像素这一部分，我修改了模型的材质，这个材质只以`emissive`和`emissiveMap`为基础色，渲染的结果即为标准流程中阈值化的结果：  

```ts
// init
this.scene.traverse(node => {
  if (!(node instanceof THREE.Mesh)) {
    return;
  }

  const material = node.material as THREE.MeshStandardMaterial;
  const {emissive, emissiveMap} = material;

  this.originMaterials[node.uuid] = material;
  this.emissiveMaterials[node.uuid] = new THREE.MeshBasicMaterial({color: emissive, map: emissiveMap});
});

// loop
this.scene.traverse(node => {
  if (!(node instanceof THREE.Mesh)) {
    return;
  }

  if (this.originMaterials[node.uuid]) {
    node.material = this.emissiveMaterials[node.uuid];
  }
});
this.renderer.render(this.scene, this.camera, this.rendererTarget1, true);
```

![](//src.dtysky.moe/image/blog/skill-2018_09_09a/7.jpg)

接下来的流程和标准辉光流程一致。最终渲染效果如下：  

![](//src.dtysky.moe/image/blog/skill-2018_09_09a/8.jpg)
