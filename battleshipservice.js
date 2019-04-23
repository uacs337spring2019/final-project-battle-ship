/**
 * Riley McGarity
 * This is the service for our battleship game that runs the backend of 
 * our game. It supports posts.
 */
 "use strict";
/**
 * starts all functions using the moduler js design pattern
 */
(function(){
    /* global require */
    const express = require("express");
    const app = express();
    const bodyParser = require('body-parser');
    const jsonParser = bodyParser.json();

    //globals that hold state of the system
    let playerturn = 1;
    let p1stat = false;
    let p2stat = false;
    let p1connect = false;
    let p2connect = false;
    //post changes this to what user defines maybe store in file later
    let playerOneBoard =   [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]];
    let playerTwoBoard =    [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]];

    //defaults to allow posts and gets and let us know the service is running
    console.log("Started console server");
    app.use(express.static('public'));
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

    window.open("index.html");
    //allows user to interact with the service
    app.get('/', function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        let deff = {};
        let params = req.query;
        if(params.mode == "turn"){
            deff = playerturn
        }
        else if(params.mode == "boards"){
            deff.p1 = playerOneBoard;
            deff.p2 = playerTwoBoard;
        }
        else if(params.mode == "status"){
            deff.p1 = p1stat;
            deff.p2 = p2stat;
        }
        else if(params.mode == "cstat"){
            deff.p1 = p1connect;
            deff.p2 = p2connect;
        }
        else{
            deff = "no mode"
        }
        res.send(JSON.stringify(deff));
    });

    //reads in input and posts to the file, returns a status of success or failure
    app.post('/', jsonParser, function (req, res) {
        let pval = req.body.player;
        let pboard = req.body.pboard;
        let oboard = req.body.oboard;
        let pvalid = req.body.pvalid;
        //new board when users attack
        if(req.body.mode == "attack"){
            if(pvalid && pval == 1){
                p1stat = true;
                playerOneBoard = pboard;
                playerTwoBoard = oboard;
                playerturn = 2;
            }
            else if(pvalid && pval == 2){
                p2stat = true;
                playerOneBoard = oboard;
                playerTwoBoard = pboard;
                playerturn = 1;
            }
        }
        //if user closes their window
        else if(req.body.mode == "close"){
            if(pval == 1){
                p1stat = false;
                p1connect = false;
            }
            else{
                p2stat = false;
                p2connect = false;
            }
        }
        //init step when user opens service
        else{
            if(pvalid && pval == 1){
                p1stat = true;
                playerOneBoard = pboard;
            }
            else if(pvalid && pval == 2){
                p2stat = true;
                playerTwoBoard = pboard;
            }
            //new game was initiated becasue a player left
            else{
                if(pval == 1){
                    p1connect = true;
                }
                else if(pval == 2){
                    p2connect = true;
                }

                playerturn = 1;
                p1stat = false;
                p2stat = false;

                //post changes this to what user defines
                playerOneBoard =   [
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0]];
                playerTwoBoard =    [
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0],
                    [0,0,0,0,0,0,0,0]];
            }
        }
        //success
        res.sendStatus(201);
    });

    //connects to port 3000 or heroku port
    let port = process.env.PORT;
    if (port == null || port == "") {
        port = 3000;
    }
    app.listen(port);
})();