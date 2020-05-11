var http = require('http')
var fs = require('fs')

const { Client } = require('pg')

const client = new Client({
    user: 'postgres',
    host: '34.73.162.180',
    database: 'postgres',
    password: 'pokemon',
    port: 5432,
})


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
    
    if(request.url == "/api/pokemon") {
        client.connect()
        client.query("SELECT * FROM public.pokemon ORDER BY id ASC", (err, res) => {
            client.end()
            if(err) {
                console.log(err)
                response.write(404)
                response.end()
            } else {
                var json = JSON.stringify({
                    pokemon: res.rows
                });
    
                response.end(json);
            }
        })
        return
    }

    if(request.url == "/api/pokemon/1") {
        client.connect()
        client.query("SELECT * FROM public.pokemon WHERE id='1'", (err, res) => {
            client.end()
            if(err) {
                console.log(err)
                response.write(404)
                response.end()
                return
            }
            const myPokemon = res.rows[0]
            console.log(myPokemon)
            response.writeHead(200, {"Content-Type": "application/json"})
            response.write(JSON.stringify(myPokemon))
            response.end()
        })
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