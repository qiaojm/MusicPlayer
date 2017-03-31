# MusicPlayer
[![Travis branch](https://img.shields.io/travis/qiaojm/MusicPlayer/master.svg)](https://travis-ci.org/qiaojm/MusicPlayer)
### 简单介绍
- 服务端:Node+Express+ejs
- 前端界面:HTML+CSS3+JS
- 音频操作:webAudio
- 数据可视化:Canvas

### 创建步骤
- 安装Node
- 安装Express(```npm install -g express-generator```)
- 使用.ejs的文件(```express -e 文件名```),进行完此步骤会有一个music(里面会有app.js+package.json等)文件
- 切换到music文件(```cd music```)
- 执行```npm install```(此时会创建一个node_modules文件)
- 安装一个小插件,实时监控(```npm install -g supervisor```),安装好后便可以使用```supervisor bin/www```实时监测代码变化
- 输入```http://127.0.0.1:3000```即可看见搭建好的express项目了

### 小知识
- Express 默认的是3000端口

### AudioContex（Web API）
- 包含各个AudioNode对象以及它们的联系对象，可以理解为audio上下文对象。绝大多数情况下，一个document中只有一个AudioContex
- 创建：```var ac = new window.AudioContex();```
- 属性： destination，AudioDestinationNode对象，所有的音频输出聚集地，相当于音频的硬件，所有的AudioNode都直接或间接的连接到这里;currentTime,AudioContext从创建开始到当前的时间
- 方法：
  1. ```decodeAudioData(arrayBuffer,succ(buffer),err)```,异步解码包含在arrayBuffer中的音频数据
  2. ```creatBufferSource()```创建audioBufferSourceNode对象
  3. ```createAnalyser()```,创建AnalyserNode对象
  4. ```createGain()/createGainNode()```,创建GainNode对象

Reference:[更多内容](https://developer.mozilla.org/zh-CN/docs/Web/API/AudioContext)

          
