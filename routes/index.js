var express = require('express');
var router = express.Router();
var path = require('path');
var media = path.join(__dirname,"../public/media");
/* GET home page. */
router.get('/', function(req, res, next) {
	var fs = require('fs');
	fs.readdir(media,function(err,names){    //names为目录下的文件数组列表
    if (err) {
       return console.log(err);
    }
    else {
    	res.render('index', { title:'IQiao Music',music:names });
    }	
    });
});

module.exports = router;
