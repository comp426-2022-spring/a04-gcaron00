const { coinFlip, coinFlips, countFlips, flipACoin } = require('./modules/coin.js');
// import minimist from "minimist"
// import express from "express"

const express = require("express")
const morgan = require('morgan')
const fs = require('fs')
const args = require("minimist")(process.argv.slice(2))  //require("minimist")(
const Database = require('better-sqlite3')

const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
const db = new Database('log.db')

const log = args.log
const help = args.help
const debug = args.debug
const port = args.port || 5555

if(log){
    const writestream  = fs.createWriteStream('./access.log', { flags: 'a' })
    app.use(morgan('combined', { stream: writestream  }))
}

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

app.use( (req, res, next) => {
    let logdata = {
        remoteaddr: req.ip,
        remoteuser: req.user,
        time: Date.now(),
        method: req.method,
        url: req.url,
        protocol: req.protocol,
        httpversion: req.httpVersion,
        secure: req.secure,
        status: res.statusCode,
        referer: req.headers['referer'],
        useragent: req.headers['user-agent']
    }
    const stmt = database.prepare(`INSERT INTO accesslog (remoteaddr, 
        remoteuser, time, method, url, protocol, httpversion, secure, 
        status, referer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    const info = stmt.run(logdata.remoteaddr, logdata.remoteuser, logdata.time, 
        logdata.method, logdata.url, logdata.protocol, logdata.httpversion, logdata.secure, 
        logdata.status, logdata.referer, logdata.useragent)
    res.status(200).json(info)
})

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