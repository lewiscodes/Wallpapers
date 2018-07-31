var request = require('request')
var fs = require('fs')
var path = require('path')
var settings = JSON.parse(fs.readFileSync('./settings.json', 'utf8'))
var filePath = require('os').homedir() + settings.filepath
var URL = 'https://www.reddit.com/r/' + settings.subreddit + '/top.json?sort=new&limit100'

function download (url, filename) {
  filename = path.basename(url)
  var extension = filename.substring(filename.lastIndexOf('.'), filename.lastIndexOf('?'))
  filename = filename.substring(0, filename.indexOf(extension)) + extension
  request(url).pipe(fs.createWriteStream(filePath + filename))
};

function deleteExisting () {
  return new Promise(function (resolve, reject) {
    fs.readdir(filePath, function (err, files) {
      if (err) {
        console.log(err)
      }

      if (files.length === 0) {
        return resolve('no files to delete')
      } else {
        var x = 0
        files.forEach(function (file) {
          fs.unlink(filePath + file, function () {
            x++
            if (x === files.length) {
              return resolve('files deleted')
            }
          })
        })
      }
    })
  })
}

function callRedditAPI () {
  request(URL, function (err, response, body) {
    if (err) { console.log(err) }
    var json = JSON.parse(body)

    for (var x = 0; x < json.data.children.length; x++) {
      if (json.data.children[x].data.over_18 === false) {
        if (json.data.children[x].data.preview.images[0].source.width >= settings.image.minWidth && json.data.children[x].data.preview.images[0].source.height >= settings.image.minHeight) {
          download(json.data.children[x].data.preview.images[0].source.url, filePath + x + '.jpg')
        }
      }
    }
  })
}

deleteExisting().then(function (success) {
  // callRedditAPI()
})
