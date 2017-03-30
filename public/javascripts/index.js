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
//发送一个http请求1
var xhr = new XMLHttpRequest();
//通过AudioContext来解码歌曲并播放
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
//创建一个改变音量的对象
var gainNode = audioCtx[audioCtx.createGain?"createGain":"createGainNode"]() ;
//判断是否已有歌曲播放，切换歌曲，防止多个歌曲同时播放
var judgeSource = null;
//若前一首歌曲还未解码，这时仍然会同时播放多首歌曲
var count = 0;
function load(url) {
	var n = ++count;
    console.log(n,count);
    xhr.abort();//取消当前响应，关闭连接并且结束任何未决的网络活动。
    xhr.open("GET", url);
    xhr.responseType = "arraybuffer";
    xhr.onload = function() {
    	if(n != count) return;
    	//判断是否已有歌曲播放
    	judgeSource && judgeSource[judgeSource.stop?"stop":"noteOff"]();
        // 旧版的回调函数语法
        audioCtx.decodeAudioData(xhr.response, function(buffer) {
            //创建一个控制歌曲播放的对象 
    	if(n != count) return;           
            console.log(n,count);
        	var source = audioCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            //设置循环
            source.loop = true;
            //开始播放
            source[source.start?"start":"noteOn"](0); 
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
function changeVolume(percent){
	gainNode.gain.value = percent*percent ;
}
$("#volume")[0].onchange = function (){
  changeVolume(this.value/this.max);
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