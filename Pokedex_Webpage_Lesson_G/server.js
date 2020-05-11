var http = require('http')
var fs = require('fs')

const { Pool } = require('pg')
const dotenv = require('dotenv')

dotenv.config()

const pool = new Pool({
    user: process.env.SQL_USER,
    host: process.env.SQL_HOST,
    database: process.env.SQL_DATABASE,
    password: process.env.SQL_PASSWORD,
    port: process.env.SQL_PORT
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
        pool.query("SELECT * FROM public.pokemon ORDER BY id ASC", (err, res) => {
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

    if(/^\/api\/pokemon\/[0-9]*$/.test(request.url.toString())){
        console.log("Looking for pokemon at URL: " + request.url)
        var urlParts = request.url.toString().split('/')
        var pokemonId = urlParts[3]

        // var client = new Client({
        //     user: 'postgres',
        //     host: '/cloudsql/node-pokedex-tutorial:us-east1:node-pokedex-tutorial',
        //     database: 'postgres',
        //     password: 'pokemon',
        //     port: 5432,
        // })

        pool.query("SELECT * FROM public.pokemon WHERE id='" + pokemonId + "'", (err, res) => {
            if(err) {
                console.log(err)
                response.writeHead(404)
            } else if (res.rowCount !== 1) {
                response.writeHead(404)
            } else {
                const myPokemon = res.rows[0]
                response.writeHead(200, {"Content-Type": "application/json"})
                response.write(JSON.stringify(myPokemon))
            }

            response.end()
        })
    }
    
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