var request = require('request');
var fs = require('fs');
var filePath = "~/Wallpapers/";
var URL = "https://www.reddit.com/r/earthporn/top.json?sort=new&limit100";

function download(url, filename){
  request.head(url, function(err, res, body){
    request(url).pipe(fs.createWriteStream(filename));
  });
};

function deleteExisting() {
  return new Promise (function(resolve, reject) {
    fs.readdir(filePath, function(err, files) {
      if (files !== undefined) {
        files.forEach(function(file) {
          fs.unlink(file);
        });
      }
    });
    return resolve("files deleted");
  });
}

function callRedditAPI() {
  request(URL, function (err, response, body) {
    var json = JSON.parse(body);
    var numberFound = 0;

    for (var x=0; x < json.data.children.length; x++) {
      if (json.data.children[x].data.over_18 === false) {
        if (json.data.children[x].data.preview.images[0].source.width >= 1440 && json.data.children[x].data.preview.images[0].source.height >= 900) {
          download(json.data.children[x].data.preview.images[0].source.url, filePath + x + ".jpg");
        }
      }
    }
  })
}

deleteExisting().then(function(success) {
  callRedditAPI();
});
