//获取s选择器中对应的所有元素是一个集合
function $(s){
  return document.querySelectorAll(s);
}
var lis = $("#list li");
//给歌曲列表每首歌（li）添加点击事件及class
for (var i = 0; i < lis.length; i++) {
	lis[i].onclick = function(){
		for (var j = 0; j < lis.length; j++) {
			lis[j].className="";
		}
		this.className="selected";
		load("/media/"+this.title);
	}

} 
//发送一个http请求1
var xhr = new XMLHttpRequest();
//通过AudioContext来解码歌曲并播放
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function load(url){
xhr.open("GET",url);
xhr.responseType="arraybuffer";
xhr.onlode = function(){
	audioCtx.decodeAudioData(xhr.response, function(buffer) {
		var source = audioCtx.createBufferSource();
        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source[source.start?"start":"noteOn"](0);
      },function(e){"Error with decoding audio data" + e.err});

  }
xhr.send();
}





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

