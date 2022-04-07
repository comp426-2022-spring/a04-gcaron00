const { coinFlip, coinFlips, countFlips, flipACoin } = require('./modules/coin.js');
// import minimist from "minimist"
// import express from "express"

const express = require("express")
const morgan = require('morgan')
const fs = require('fs')
const args = require("minimist")(process.argv.slice(2))  //require("minimist")(

const app = express()
//app.use(express.urlencoded({ extended: true }));
app.use(express.json())
const db = require('./database.js')

const log = args.log || "true"
const help = args.help
const debug = args.debug
const port = args.port || 5555

if (help) {
    console.log(`server.js [options]

    --port	Set the port number for the server to listen on. Must be an integer
                between 1 and 65535.

    --debug	If set to \`true\`, creates endlpoints /app/log/access/ which returns
                a JSON access log from the database and /app/error which throws 
                an error with the message "Error test successful." Defaults to 
                \`false\`.

    --log		If set to false, no log files are written. Defaults to true.
                Logs are always written to database.
    
                --help	Return this message and exit.`)
    process.exit(0)
    
}

app.use(morgan("tiny"));
if(log === "true"){
    const WRITESTREAM  = fs.createWriteStream('access.log', { flags: 'a' })
    app.use(morgan('combined', { stream: WRITESTREAM }))
    console.log("Access logging")
}


if (debug) {
    app.get("/app/log/access", (req, res) => {	
        try {
            const stmt = db.prepare('SELECT * FROM accesslog').all()
            res.status(200).json(stmt)
        } catch {
            console.error(e)
        }
    });
    app.get('/app/error', (req, res) => {
        throw new Error('Error test successful.');
    });
}


const server = app.listen(port, () => {
    console.log('App is running on port %PORT%'.replace('%PORT%', port))
})

app.get('/app/flip', (req, res) => {
    res.status(200).json({"flip": coinFlip()})
})

app.get('/app/flips/:number', (req, res) => {
    const result = coinFlips(parseInt(req.params.number))
    const count = countFlips(result)
    res.status(200).json({"raw": result, "summary": count})
})

app.get('/app/flip/call/:call', (req, res) => {
    res.status(200).json(flipACoin(req.params.call))
})

app.get('/app', (req, res) => {
    res.statusMessage = 'OK';
    res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
    res.end(res.statusCode+ ' ' +res.statusMessage)
})

app.use(function(req, res) {
    res.status(404).send("404 NOT FOUND")
    res.type("text/plain")
})