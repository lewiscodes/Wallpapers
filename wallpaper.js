var request = require('request');
var fs = require('fs');
var path = require('path');
var filePath = "../../Wallpapers/";
var URL = "https://www.reddit.com/r/earthporn/top.json?sort=new&limit100";

function download(url, filename){
  console.log(url);
  console.log(filename);
  var filename = path.basename(url);
  var extension = filename.substring(filename.lastIndexOf("."), filename.lastIndexOf("?"));
  filename = filename.substring(0, filename.indexOf(extension)) + extension;
  request(url).pipe(fs.createWriteStream("./Wallpapers/" + filename));
};

function deleteExisting() {
  return new Promise (function(resolve, reject) {
    fs.readdir(filePath, function(err, files) {
      console.log(files);
      if (files === undefined || files.length === 0) {
        return resolve("no files to delete");
      } else {
        var x = 0;
        files.forEach(function(file) {
          fs.unlink(filePath + file, function(err) {
            x++;
            if (x === files.length) {
              return resolve("files deleted");
            }
          });
        });
      }
    });
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
