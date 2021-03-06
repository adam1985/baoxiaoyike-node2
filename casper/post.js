var casper = require('casper').create({
    pageSettings: {
        userAgent : "chrome",
        loadImages:  false,        // The WebPage instance used by Casper will
        loadPlugins: false        // use these settings
    },
    timeout : 30 * 1000,
    onTimeout : function(){
        this.echo(JSON.stringify({
            success : false
        })).exit();
    },
    onError : function(){
        this.echo(JSON.stringify({
            success : false
        })).exit();
    }
});


var base64 =  require('../module/base64'),
    fs = require('fs'),
    postPath =  'loger/post_content.txt',
    args2 = casper.cli.args,
    post = JSON.parse(fs.read(postPath).toString());

casper.start('http://www.baoxiaoyike.cn/wp-admin/post-new.php', function() {

    casper.waitFor(function check() {
        return this.evaluate(function() {
            return document.querySelectorAll('#loginform').length > 0;
        });
    }, function then() {
        this.fill('#loginform', {
            'log': 'lvyuan',
            'pwd': 'zxcvbnm008598'
        }, false);
        this.click('#wp-submit');
        this.echo('正在模拟登录');
    }, function timeout() { // step to execute if check has failed
        this.echo(JSON.stringify({
            success : false
        })).exit();
    });

});


casper.waitFor(function check() {
    return this.evaluate(function() {
        return document.querySelectorAll('#titlewrap').length > 0;
    });
}, function then() {
    casper.evaluate(function(title, content, category) {
        document.querySelector('#title').value = title;
        if( typeof tinyMCE != 'undefined' ) {
            tinyMCE.execCommand("mceInsertContent", false,  content);
        } else {
            document.querySelector('#content').innerHTML = content;
        }

        document.querySelector('#in-category-' + category).checked = true;

        document.querySelector('#post-format-video').checked = true;

        document.querySelector('#publish').click();

    }, post.title, post.content, post["in-category"]);

    casper.waitFor(function check() {
        return this.evaluate(function() {
            return document.querySelectorAll('#message').length > 0;
        });
    }, function then() {
        this.echo(JSON.stringify({
            success : true
        })).exit();
    }, function timeout() { // step to execute if check has failed
        this.echo(JSON.stringify({
            success : false
        })).exit();
    });
}, function timeout() { // step to execute if check has failed
        this.echo(JSON.stringify({
            success : false
        })).exit();
});


casper.run();
