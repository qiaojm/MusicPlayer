//获取s选择器中对应的所有元素是一个集合
function $(s) {
    return document.querySelectorAll(s);
}
var lis = $("#list li");
//给歌曲列表每首歌（li）添加点击事件及class
for (var i = 0; i < lis.length; i++) {
    lis[i].onclick = function() {
        for (var j = 0; j < lis.length; j++) {
            lis[j].className = "";
        }
        this.className = "selected";
        load("/media/" + this.title);
    }

}
var type = $("#type li");
//切换显示的canvas图像
for (var i = 0; i < type.length; i++) {
    type[i].onclick = function(){
        for (var i = 0; i < type.length; i++) {
            type[i].className="";
        }
        this.className = "selected";
        draw.type = this.getAttribute("data-type");
    }
}

//发送一个http请求1
var xhr = new XMLHttpRequest();
//通过AudioContext来解码歌曲并播放
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
//创建一个改变音量的对象
var gainNode = audioCtx[audioCtx.createGain ? "createGain" : "createGainNode"]();
//判断是否已有歌曲播放，切换歌曲，防止多个歌曲同时播放
var judgeSource = null;
//若前一首歌曲还未解码，这时仍然会同时播放多首歌曲
var count = 0;
//创建一个接收频率的对象
var analyser = audioCtx.createAnalyser();
var size = 128;
analyser.fftSize = size * 2;
//绘制canvas的容器
var canvasBox = $("#canvasBox")[0];
var height, width;
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvasBox.appendChild(canvas);
//创建一个放频率的点数组
var Dots = [];
//生成一个m到n之间的数
function random(m,n){
    return Math.round(Math.random()*(n-m)+m);
}
function getDots(){
     Dots=[];
     for (var i = 0; i < size; i++) {
         var x = random(0,width);
         var y = random(0,height); 
         var color = "rgb("+random(0,255)+","+random(0,255)+","+random(0,255)+")" ;   
    
         Dots.push(
         {
            x:x,
            y:y,
            color:color
         });
          }
     }
     var line;
function resize() {
    height = canvasBox.clientHeight;
    width = canvasBox.clientWidth;
    canvas.height = height;
    canvas.width = width;
    line = ctx.createLinearGradient(0, 0, 0, height);
    line.addColorStop(0, "red");
    line.addColorStop(0.5, "orange");
    line.addColorStop(1, "yellow");
    getDots();

}
resize();
window.onresize = resize;

function draw(dataArray) {
    ctx.clearRect(0, 0, width, height);
    var w = width / size;
    ctx.fillStyle = line;
    for (var i = 0; i < size; i++) {
        if (draw.type == "column") {
        var h = dataArray[i] / 256 * height;
        ctx.fillRect(w * i, height - h, w * 0.6, h)}
        else if (draw.type == "dot") {
            ctx.beginPath();
            var o = Dots[i];
            var r = dataArray[i]/256 *50;
            ctx.arc(o.x,o.y,r,0,Math.PI *2,true);
            var g = ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,r);
            g.addColorStop(0,"#fff");
            g.addColorStop(1,o.color);
            ctx.fillStyle = g;
            ctx.fill();
            // ctx.strokeStyle = "#fff"
            // ctx.stroke();
        }
            // console.log(h,height);
    }
}
draw.type = "column"
function load(url) {
    var n = ++count;
    // console.log(n,count);
    xhr.abort(); //取消当前响应，关闭连接并且结束任何未决的网络活动。
    xhr.open("GET", url);
    xhr.responseType = "arraybuffer";
    xhr.onload = function() {
        if (n != count) return;
        //判断是否已有歌曲播放
        judgeSource && judgeSource[judgeSource.stop ? "stop" : "noteOff"]();
        // 旧版的回调函数语法
        audioCtx.decodeAudioData(xhr.response, function(buffer) {
            //创建一个控制歌曲播放的对象 
            if (n != count) return;
            // console.log(n,count);
            var source = audioCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(analyser);
            analyser.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            //设置循环
            source.loop = true;
            //开始播放
            source[source.start ? "start" : "noteOn"](0);
            judgeSource = source;
        }, function(error) {
            console.log(error);
        });

        // 方法二：新的promise-based语法
        // audioCtx.decodeAudioData(audioData).then(function(decodedData) {
        //     // use the decoded data here
        //     var source = audioCtx.createBufferSource();
        //     source.buffer = decodedData;
        //     // connect the AudioBufferSourceNode to the
        //     // destination so we can hear the sound
        //     source.connect(audioCtx.destination);
        //     // start the source playing
        //     source.start();
        // }, function(error) {
        //     console.log(error);
        // });

    }
    xhr.send();
}
//获取音乐文件频率实现可视化的函数
function visualizer() {
    var dataArray = new Uint8Array(analyser.frequencyBinCount);
    // console.log(dataArray);
    requestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame
        //重绘频率函数
    function v() {
        analyser.getByteFrequencyData(dataArray);
        // console.log(dataArray);
        //绘制canvas图像
        draw(dataArray);
        requestAnimationFrame(v);
    }
    requestAnimationFrame(v);

}
visualizer();
//改变音量的函数
function changeVolume(percent) {
    gainNode.gain.value = percent * percent;
}
$("#volume")[0].onchange = function() {
    changeVolume(this.value / this.max);
}
$("#volume")[0].onchange();
//发送一个http请求2
// function load(url){
// 	 xhr=null;
//    if (window.XMLHttpRequest) {
//    	xhr = new XMLHttpRequest();
//    }
//    else{
//    	xhr = new ActiveXObject("Microsoft.XMLHTTP");
//    }
//  if (xhr!=null) {

//     xhr.responseType="arraybuffer";
//  	xhr.open("Get",url);
//  	xhr.send(null);
//  	xhr.onreadystatechange=function (){
//       if (xhr.readyState==4 && xhr.status==200) {

//          xhr.onlode=function(){
//            console.log(xhr.response);
//          }
//       }
//        else
//     {
//     alert("Problem retrieving XML data:" + xhr.statusText);
//     }
//  	};
//  	console.log(xhr.readyState,xhr.status);
//  }
//  else{
//   alert("Your browser does not support XMLHTTP.");
//  }
//  	}