
/*
 * GET update listing.
 */

var cheerio = require('cheerio');
var nodegrass = require('nodegrass');
var dateFormat = require('../module/dateFormat');
var http = require("http");
var fs = require('fs');
var base64 =  require('../module/base64');
var spawn = require('child_process').spawn;


exports.post = function(req, res){


        var logerDir = './loger',
            pageJson = logerDir + '/pageJson.txt',
            resultPath = logerDir + '/result.txt',
            postPath = logerDir + '/post_content.txt';

    var pBody = req.body,
        index = +pBody.index,
        category = pBody["in-category"],
        postState = pBody["post-state"],
        have_post = pBody["have_post"],
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

    fs.writeFileSync(postPath, JSON.stringify(sendData) );

    resultObj.list[index]["in-category"] = category;
    resultObj.list[index]["post-state"] = postState;
    //resultObj.list[index]["post-status"] = "发布成功";
    //resultObj.list[index].success = 1;

    fs.writeFileSync(resultPath, JSON.stringify(resultObj) );

    res.set({'Content-Type':'text/plain'});
    if( postState == 1 && have_post == 0 ) {
        var casper = spawn('casperjs', [
            "casper/post.js"
        ], {});

        casper.stdout.on('data', function (data) {
            data = data.toString();
            console.log(data);
        });

        casper.on('exit', function (code,signal) {
            res.send(JSON.stringify({
                success : true,
                data : {
                    msg : "发布成功"
                }
            }));
        });

    } else {
        res.send(JSON.stringify({
            success : false,
            data : {
                msg : "发布成功"
            }
        }));
    }

};