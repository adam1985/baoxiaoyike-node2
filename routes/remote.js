
/*
 * GET update listing.
 */

var cheerio = require('cheerio');
var nodegrass = require('nodegrass');
var dateFormat = require('../module/dateFormat');
var http = require("http");
var fs = require('fs');
var base64 =  require('./module/base64');
var spawn = require('child_process').spawn;


exports.post = function(req, res){


        var logerDir = './loger',
            pageJson = logerDir + '/pageJson.txt',
            resultPath = logerDir + '/result.txt';

    var pBody = req.body.data,
        index = +req.body.index,
        sendData = (function(){
            var obj = {
                  title : pBody.title
            },
            pageUrl = pBody.pageUrl,
            imgSrc = pBody.imgSrc,
            content = '[[videoBase64=' + base64.encode( pageUrl + '||' + imgSrc  ) + ']]';
            obj["in-category"] = pBody["in-category"];
            obj.content = content;
            return obj;

        }()),

        resultStr = fs.readFileSync(resultPath ).toString(),
        resultObj = JSON.parse( resultStr );

    resultObj[index]["in-category"] = pBody["in-category"];
    resultObj[index]["post-state"] = pBody["post-state"];

    fs.writeFileSync(resultPath, JSON.stringify(resultObj) );

    res.set({'Content-Type':'text/plain'});
    res.send(JSON.stringify({
        success : true,
        data : {
            msg : "发布成功"
        }
    }));

};