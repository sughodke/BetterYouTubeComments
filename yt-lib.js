var youtube = require('youtube-feeds');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var TimeRegex = /([0-9]|[0-9][0-9]):[0-9][0-9]/;

var yt = function () { }
  
util.inherits(yt, EventEmitter);

yt.prototype.getGoodComments = function (comments) {
    if (typeof(comments) == undefined)  return;
    var self=this; 
    comments.forEach(function (entry){
      var comment = {
        name: entry.author[0].name['$t'],
        uri: entry.author[0].uri['$t'],
        content: entry.content['$t']
      };
  
      var m = comment.content.match(TimeRegex);
      if (m) {
        comment['videotime'] = m[0];
        self.emit('comment',comment);
      }
    });
};

yt.prototype.getComments = function (ytid,startidx) {
    startidx = startidx || 1;
    var self=this; 

    youtube.video(ytid).comments({
               key: 'AIzaSyAaJ3ZpfI8RJIYmFXck2K7E6CP5ZmcFc9A',
               'start-index': startidx, 
               'max-results': 50 
             },
    function(error,data){
      if (error) {
        console.log(error);
        console.log(data);
      }
      //console.log(data);
  
      var comments = data['entry'];
      self.getGoodComments(comments);
  
      var res = {
        total: data['openSearch$totalResults']['$t'],
        start: startidx, //data['openSearch$startIndex']['$t'],
        limit: data['openSearch$itemsPerPage']['$t']
      };
      
      var next = res.start + res.limit;
      console.log({r: res, next: next});
      if (next < res.total && next < 1000) {
        //console.log(next);
        self.getComments(ytid, next);
      } else {
        self.emit('eof');
      }
    });
};

module.exports = yt;

