
/*
 * GET home page.
 */
var fs = require('fs');
var logerDir = './loger', resultPath = logerDir + '/result.txt';
var getResult = function( path ){
    var resultJson;
    if( fs.existsSync( path ) ) {
        var result = fs.readFileSync(path).toString();

        try{
            resultJson = JSON.parse( result );
        } catch ( e ){
            resultJson = {
                list : []
            };
        }

    } else {
        resultJson = {
            list : []
        };
    }

    return resultJson;
};

exports.index = function(req, res){
  var data = {
      title: '微信公众平台数据采集'
  };
  data["detail"] = getResult( resultPath );

  res.render('index', data);
};