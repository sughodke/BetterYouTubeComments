var youtube = require('youtube-feeds')

var TimeRegex = /([0-9]|[0-9][0-9]):[0-9][0-9]/;
var args = [];

function getGoodComments(comments) {
  if (typeof(comments) == undefined)  return;
  comments.forEach(function (entry){
    var comment = {
      name: entry.author[0].name['$t'],
      uri: entry.author[0].uri['$t'],
      content: entry.content['$t']
    };

    var m = comment.content.match(TimeRegex);
    if (m) {
      comment['videotime'] = m[0];
      console.log(comment);
    }
  });
}

function printComments(ytid,startidx) {
  startidx = startidx || 1;

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

    var comments = data['entry'];
    getGoodComments(comments);

    var res = {
      total: data['openSearch$totalResults']['$t'],
      start: data['openSearch$startIndex']['$t'],
      limit: data['openSearch$itemsPerPage']['$t']
    };
    
    var next = res.start + res.limit;
    if (next < res.total && next < 1000) {
      //console.log(res);
      //console.log(next);
      printComments(ytid, next);
    }
  });
}





if (process.argv.length == 2) args = ['nOEw9iiopwI'];
else {
  args = process.argv.splice(2);
}

args.forEach(function(arg){ printComments(arg) });
