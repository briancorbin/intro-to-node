var http = require('http')
var fs = require('fs')

http.createServer(function(request, response) {
    if(request.url == "/index") {
        fs.readFile("index.html", function(err, data) {
            if(err) {
                response.writeHead(404)
                response.write("Not Found!")
            } else {
                response.writeHead(200, {'Content-Type': 'text/html'})
                response.write(data)
            }
            response.end()
        })

        return
    }
    
    if(/^\/[a-zA-Z0-9\/]*.css$/.test(request.url.toString())){
        sendFileContent(response, request.url.toString().substring(1), "text/css");
        return
    }

    if(/^\/[a-zA-Z0-9\/]*.js$/.test(request.url.toString())){
        sendFileContent(response, request.url.toString().substring(1), "text/javascript");
        return
    }

    if(/^\/[a-zA-Z0-9\/]*.php$/.test(request.url.toString())){
        sendFileContent(response, request.url.toString().substring(1), "text/php");
        return
    }

    console.log("requested url: " + request.url)
    response.end()
    
}).listen(8080)

function sendFileContent(response, fileName, contentType){
    fs.readFile(fileName, function(err, data){
      if(err){
        response.writeHead(404);
        response.write("Not Found!");
      }
      else{
        response.writeHead(200, {'Content-Type': contentType});
        response.write(data);
      }
      response.end();
    });
  }