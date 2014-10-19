var casper = require('casper').create({
    pageSettings: {
        userAgent : "chrome",
        loadImages:  true,        // The WebPage instance used by Casper will
        loadPlugins: false        // use these settings
    }
});


var base64 =  require('../module/base64'),
    fs = require('fs'),
    postPath =  'loger/post_content.txt',
    args2 = casper.cli.args,
    post = JSON.parse(fs.read(postPath).toString());

casper.start('http://www.baoxiaoyike.cn/wp-admin/post-new.php', function() {

    this.fill('#loginform', {
        'log': 'admin',
        'pwd': 'yuan008598'
    }, false);

});

casper.then(function() {
    this.click('#wp-submit');
    this.echo('login...');
});



casper.then(function() {
	this.wait(2000, function(){
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
	});
	
	this.wait(2000, function(){
		this.echo(JSON.stringify({
			success : true
		})).exit();
	});


});

casper.run();
