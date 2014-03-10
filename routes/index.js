
/*
 * GET home page.
 */

exports.index = function(req, res){
  var ytid = req.param('v') || 'nOEw9iiopwI';
  res.render('index', { id: ytid });
};

exports.youtube = function(req, res){
  var yt = require('../yt-lib.js');

  var y = new yt();
  var ytid = req.param('id');

  res.writeHead(200, {"Content-Type": "application/json"});

  res.write('[ ');
  y.on('comment', function (e){ 
    res.write(JSON.stringify(e)); 
    res.write(', ');
  });

  y.on('eof', function (e){ 
    res.write('{} ]');
    res.end();
  });

  y.getComments(ytid);

  //res.render('index', { title: 'Express' });
};
