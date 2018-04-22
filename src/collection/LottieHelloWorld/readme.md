使用[lottie-web(bodymovin)](https://github.com/airbnb/lottie-web)的一个超简单的例子。  
[code](http://github.com/dtysky/paradise/tree/master/src/collection/LottieHelloWorld),[demo](http://paradise.dtysky.moe/lottie-hello-world)  

## 原理

Lottie（BodyMovin）是airbnb退出的一套设计师和前端合作的工具，设计师用AE创作出动画效果并用其提供的插件导出成json和资源，前端利用对应的lib，比如Web前端利用lottie-web便可以将其渲染到视图层。  

本例子只是一个基础的例子。我在AE工程**ae.aep**中创建了一个**Hello World**的文本路径动画，并将其利用插件导出成了一个**data.json**，然后在前端渲染出来，用户可以通过调整Controller中的参数尝试调整动画的运作。  

注意由于没有指定字体文件，此处只能使用svg渲染。
