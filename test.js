var yt = require('./yt-lib.js');
var y = new yt();
y.on('comment', function (e){ console.log( e ); });
y.getComments('nOEw9iiopwI');
