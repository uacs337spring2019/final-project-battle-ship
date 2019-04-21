/**
 * Riley McGarity
 * 
 * this is the js to support a player in the battlfield of the water
 * it allows a player to place their ships on screen and then battle 
 * another player.
 */
"use strict";
(function(){
    //gets value from html
    let pval = parseInt(document.getElementsByClassName("pid")[0].id); 
    //globals that hold game state
    let valid = false;
    let intervalholder = null;
    let isturn = false;
    let ohits = 0;
    let hits = 0;
    let playerboard =   [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]];
    let opponentboard = [
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0]];
    

    /**
     * on load sets up the piece placement and sends an initial state to the
     * service
     */
    window.onload = function(){
        post();
        setup();
    }

    /**
     * if window closes disconnects other player
     */
    window.onbeforeunload = function(){
        post("close");
    }

    /**
     * calls functions to allow user to setup their board
     */
    function setup(){
        drawsetup();
        onhoverconfighor(5);
    }

    /**
     * fetches the new boards when its not the players turn and waits for the 
     * board to change
     */
    function getboards(){
        //fetch board
        fetch("http://localhost:3000?mode=boards")
        .then(checkStatus)
        //returned data
        .then(function(responseText){
            //posts returned from service
            let boards = JSON.parse(responseText);
            if(pval == 1){
                playerboard = boards.p1;
                opponentboard = boards.p2;
            }
            else{
                playerboard = boards.p2;
                opponentboard = boards.p1;
            }
            drawboard();
        })
        //error returned
        .catch(function(error){
            console.error(error);
        });
        //fetch turn
        fetch("http://localhost:3000?mode=turn")
        .then(checkStatus)
        //returned data
        .then(function(responseText){
            //posts returned from service
            let turn = parseInt(JSON.parse(responseText));
            if(pval == turn){
                isturn = true;
                clearInterval(intervalholder);
                drawboard();
            }
            else{
                isturn = false;
            }
        })
        //error returned
        .catch(function(error){
            console.error(error);
        });
    }

    /**
     * draws the setup
     */
    function drawsetup(){
        let setupdiv = document.getElementById("init");
        setupdiv.innerHTML=""

        for(let row = 0; row < 8; row++){
            let rdivone = document.createElement("div");
            for(let column = 0; column < 8; column++){
                let cdivone = document.createElement("div");

                cdivone.id = row + "_" + column;

                if(playerboard[row][column] == 0){
                    //miss area draw blue
                    cdivone.className = "open";
                }
                else if(playerboard[row][column] == 1){
                    //ship area draw grey
                    cdivone.className = "ship";
                }
                else if(playerboard[row][column] == 2){
                    //miss area but fired upon draw white
                    cdivone.className = "miss";
                }
                else if(playerboard[row][column] == 3){
                    //hit area but fired upon draw red
                    cdivone.className = "hit";
                }
                rdivone.appendChild(cdivone);

            }
            setupdiv.appendChild(rdivone);
        }
    }

    /**
     * resets the ship hover config so we can switch between contexts
     */
    function resetconfig(){
        for(let row = 0; row < 8; row++){
            for(let column = 0; column < 8; column++){
                let el = document.getElementById(row+"_"+column);
                el.onclick = "";
                el.onmouseenter = "";
                el.onmouseleave = "";
            }
        }
    }

    /**
     * sets up horizontal hover for ship placement
     * @param {*} shipid the ship being placed
     */
    function onhoverconfighor(shipid){
        let rotate = document.getElementById("rotate");
        rotate.onclick = function(){
            onhoverconfigver(shipid);
        }
        resetconfig()
        for(let row = 0; row < 8; row++){
            if(shipid == 5){
                for(let column = 0; column < 4; column++){
                    let cor0 = document.getElementById(row+"_"+(column));
                    let cor1 = document.getElementById(row+"_"+(column + 1));
                    let cor2 = document.getElementById(row+"_"+(column + 2));
                    let cor3 = document.getElementById(row+"_"+(column + 3));
                    let cor4 = document.getElementById(row+"_"+(column + 4));
                    if((cor0.className != "ship")&&(cor1.className != "ship")&&(cor2.className != "ship")&&(cor3.className != "ship")&&(cor4.className != "ship")){
                        //on hover
                        cor0.onmouseenter = function(){
                            cor0.className = "activeplace";
                            cor1.className = "activeplace";
                            cor2.className = "activeplace";
                            cor3.className = "activeplace";
                            cor4.className = "activeplace";
                        }
                        //off hover
                        cor0.onmouseleave = function(){
                            cor0.className = "open";
                            cor1.className = "open";
                            cor2.className = "open";
                            cor3.className = "open";
                            cor4.className = "open";
                        }
                        //click
                        cor0.onclick = function(){
                            //place current ship
                            for(let i=0; i<5; i++){
                                playerboard[row][column + i] = 1;
                            }
                            //setup next ship
                            drawsetup();
                            onhoverconfighor(4);
                        }
                    }
                }
            }
            else if(shipid == 4){
                for(let column = 0; column < 5; column++){
                    let cor0 = document.getElementById(row+"_"+(column));
                    let cor1 = document.getElementById(row+"_"+(column + 1));
                    let cor2 = document.getElementById(row+"_"+(column + 2));
                    let cor3 = document.getElementById(row+"_"+(column + 3));
                    if((cor0.className != "ship")&&(cor1.className != "ship")&&(cor2.className != "ship")&&(cor3.className != "ship")){
                        //on hover
                        cor0.onmouseenter = function(){
                            cor0.className = "activeplace";
                            cor1.className = "activeplace";
                            cor2.className = "activeplace";
                            cor3.className = "activeplace";
                        }
                        //off hover
                        cor0.onmouseleave = function(){
                            cor0.className = "open";
                            cor1.className = "open";
                            cor2.className = "open";
                            cor3.className = "open";
                        }
                        //click
                        cor0.onclick = function(){
                            //place current ship
                            for(let i=0; i<4; i++){
                                playerboard[row][column + i] = 1;
                            }
                            //setup next ship
                            drawsetup();
                            onhoverconfighor(3);
                        }
                    }
                }
            }
            else if(shipid == 3 || shipid == 2){
                for(let column = 0; column < 6; column++){
                    let cor0 = document.getElementById(row+"_"+(column));
                    let cor1 = document.getElementById(row+"_"+(column + 1));
                    let cor2 = document.getElementById(row+"_"+(column + 2));
                    if((cor0.className != "ship")&&(cor1.className != "ship")&&(cor2.className != "ship")){
                        //on hover
                        cor0.onmouseenter = function(){
                            cor0.className = "activeplace";
                            cor1.className = "activeplace";
                            cor2.className = "activeplace";
                        }
                        //off hover
                        cor0.onmouseleave = function(){
                            cor0.className = "open";
                            cor1.className = "open";
                            cor2.className = "open";
                        }
                        //click
                        cor0.onclick = function(){
                            //place current ship
                            for(let i=0; i<3; i++){
                                playerboard[row][column + i] = 1;
                            }
                            //setup next ship
                            drawsetup();
                            if(shipid == 3){
                                onhoverconfighor(2);
                            }
                            else{
                                onhoverconfighor(1);
                            }
                        }
                    }
                }
            }
            else if(shipid == 1){
                for(let column = 0; column < 7; column++){
                    let cor0 = document.getElementById(row+"_"+(column));
                    let cor1 = document.getElementById(row+"_"+(column + 1));
                    if((cor0.className != "ship")&&(cor1.className != "ship")){
                        //on hover
                        cor0.onmouseenter = function(){
                            cor0.className = "activeplace";
                            cor1.className = "activeplace";
                        }
                        //off hover
                        cor0.onmouseleave = function(){
                            cor0.className = "open";
                            cor1.className = "open";
                        }
                        //click
                        cor0.onclick = function(){
                            //place current ship
                            for(let i=0; i<2; i++){
                                playerboard[row][column + i] = 1;
                            }
                            begin();
                        }
                    }
                }
            }
        }
    }

    /**
     * sets up verticle hover for ship placement
     * @param {*} shipid the ship being placed
     */
    function onhoverconfigver(shipid){
        let rotate = document.getElementById("rotate");
        rotate.onclick = function(){
            onhoverconfighor(shipid);
        }
        resetconfig()
        for(let column = 0; column < 8; column++){
            if(shipid == 5){
                for(let row = 0; row < 4; row++){
                    let cor0 = document.getElementById(row+"_"+column);
                    let cor1 = document.getElementById((row + 1)+"_"+column);
                    let cor2 = document.getElementById((row + 2)+"_"+column);
                    let cor3 = document.getElementById((row + 3)+"_"+column);
                    let cor4 = document.getElementById((row + 4)+"_"+column);
                    if((cor0.className != "ship")&&(cor1.className != "ship")&&(cor2.className != "ship")&&(cor3.className != "ship")&&(cor4.className != "ship")){
                        //on hover
                        cor0.onmouseenter = function(){
                            cor0.className = "activeplace";
                            cor1.className = "activeplace";
                            cor2.className = "activeplace";
                            cor3.className = "activeplace";
                            cor4.className = "activeplace";
                        }
                        //off hover
                        cor0.onmouseleave = function(){
                            cor0.className = "open";
                            cor1.className = "open";
                            cor2.className = "open";
                            cor3.className = "open";
                            cor4.className = "open";
                        }
                        //click
                        cor0.onclick = function(){
                            //place current ship
                            for(let i=0; i<5; i++){
                                playerboard[row + i][column] = 1;
                            }
                            //setup next ship
                            drawsetup();
                            onhoverconfigver(4);
                        }
                    }
                }
            }
            else if(shipid == 4){
                for(let row = 0; row < 5; row++){
                    let cor0 = document.getElementById(row+"_"+column);
                    let cor1 = document.getElementById((row + 1)+"_"+column);
                    let cor2 = document.getElementById((row + 2)+"_"+column);
                    let cor3 = document.getElementById((row + 3)+"_"+column);
                    if((cor0.className != "ship")&&(cor1.className != "ship")&&(cor2.className != "ship")&&(cor3.className != "ship")){
                        //on hover
                        cor0.onmouseenter = function(){
                            cor0.className = "activeplace";
                            cor1.className = "activeplace";
                            cor2.className = "activeplace";
                            cor3.className = "activeplace";
                        }
                        //off hover
                        cor0.onmouseleave = function(){
                            cor0.className = "open";
                            cor1.className = "open";
                            cor2.className = "open";
                            cor3.className = "open";
                        }
                        //click
                        cor0.onclick = function(){
                            //place current ship
                            for(let i=0; i<4; i++){
                                playerboard[row + i][column] = 1;
                            }
                            //setup next ship
                            drawsetup();
                            onhoverconfigver(3);
                        }
                    }
                }
            }
            else if(shipid == 3 || shipid == 2){
                for(let row = 0; row < 6; row++){
                    let cor0 = document.getElementById(row+"_"+column);
                    let cor1 = document.getElementById((row + 1)+"_"+column);
                    let cor2 = document.getElementById((row + 2)+"_"+column);
                    if((cor0.className != "ship")&&(cor1.className != "ship")&&(cor2.className != "ship")){
                        //on hover
                        cor0.onmouseenter = function(){
                            cor0.className = "activeplace";
                            cor1.className = "activeplace";
                            cor2.className = "activeplace";
                        }
                        //off hover
                        cor0.onmouseleave = function(){
                            cor0.className = "open";
                            cor1.className = "open";
                            cor2.className = "open";
                        }
                        //click
                        cor0.onclick = function(){
                            //place current ship
                            for(let i=0; i<3; i++){
                                playerboard[row + i][column] = 1;
                            }
                            //setup next ship
                            drawsetup();
                            if(shipid == 3){
                                onhoverconfigver(2);
                            }
                            else{
                                onhoverconfigver(1);
                            }
                        }
                    }
                }
            }
            else if(shipid == 1){
                for(let row = 0; row < 7; row++){
                    let cor0 = document.getElementById(row+"_"+column);
                    let cor1 = document.getElementById((row + 1)+"_"+column);
                    if((cor0.className != "ship")&&(cor1.className != "ship")){
                        //on hover
                        cor0.onmouseenter = function(){
                            cor0.className = "activeplace";
                            cor1.className = "activeplace";
                        }
                        //off hover
                        cor0.onmouseleave = function(){
                            cor0.className = "open";
                            cor1.className = "open";
                        }
                        //click
                        cor0.onclick = function(){
                            //place current ship
                            for(let i=0; i<2; i++){
                                playerboard[row + i][column] = 1;
                            }
                            begin();
                        }
                    }
                }
            }
        }
    }

    /**
     * checks to see if a win occured in either direction
     */
    function checkwin(){
        if(ohits == 17){
            win();
        }
        else if(hits == 17){
            lose();
        }
    }

    /**
     * if player wins displays message and lets them start a new game
     */
    function win(){
        document.getElementById("win").style.display = "flex";
        document.getElementById("newgamewin").onclick = function(){
            location.reload();
        }
    }

    /**
     * if player loses displayes message and lets them start a new game
     */
    function lose(){
        document.getElementById("lose").style.display = "flex";
        document.getElementById("newgamewin").onclick = function(){
            location.reload();
        }
    }

    /**
     * draws the current boards on the page and if its the players
     * turn activates these boxes
     */
    function drawboard(){
        ohits = 0;
        hits = 0;
        let playerdiv = document.getElementById("player");
        let opponentdiv = document.getElementById("opponent");
        playerdiv.innerHTML = "";
        opponentdiv.innerHTML = "";

        for(let row = 0; row < 8; row++){
            let rdivone = document.createElement("div");
            let rdivtwo = document.createElement("div");
            for(let column = 0; column < 8; column++){
                let cdivone = document.createElement("div");
                let cdivtwo = document.createElement("div");

                cdivone.id = row + "_" + column;
                cdivtwo.id = row + "_" + column;

                if(playerboard[row][column] == 0){
                    //miss area draw blue
                    cdivone.className = "open";
                }
                else if(playerboard[row][column] == 1){
                    //ship area draw grey
                    cdivone.className = "ship";
                }
                else if(playerboard[row][column] == 2){
                    //miss area but fired upon draw white
                    cdivone.className = "miss";
                }
                else if(playerboard[row][column] == 3){
                    //hit area but fired upon draw red
                    cdivone.className = "hit";
                    hits++;
                }

                //draws part of Opponent board
                if(opponentboard[row][column] == 0 || opponentboard[row][column] == 1){
                    //miss area or hit area draw blue
                    cdivtwo.className = "open";
                    if(isturn){    
                        cdivtwo.onclick = clickhadle;
                        cdivtwo.onmouseenter = onhoverhandle;
                        cdivtwo.onmouseleave = offhoverhandle;
                    }
                }
                else if(opponentboard[row][column] == 2){
                    //miss area but fired upon draw white
                    cdivtwo.className = "miss";
                }
                else if(opponentboard[row][column] == 3){
                    //hit area but fired upon draw red
                    cdivtwo.className = "hit";
                    ohits++;
                }


                rdivone.appendChild(cdivone);
                rdivtwo.appendChild(cdivtwo);

            }
            playerdiv.appendChild(rdivone);
            opponentdiv.appendChild(rdivtwo);
        }
        checkwin();
    }

    /**
     * when a box is clicked on it attacks the other player
     * only active during the players turn
     */
    function clickhadle(event){
        let local = this.id;
        local = local.split("_");
        let row = local[0];
        let column = local[1];
        if(opponentboard[row][column] == 0){
            opponentboard[row][column] = 2;
        }
        if(opponentboard[row][column] == 1){
            opponentboard[row][column] = 3;
        }
        post("attack");
    }

    /**
     * starts the hovering on a location
     */
    function onhoverhandle(){
        this.className = "active open";
    }

    /**
     * stops the hovering on a location
     */
    function offhoverhandle(){
        this.className = "open";
    }

    /**
     * When user clicks to place pieces they are forced to wait till the other player is ready
     * once the other player is ready the game begins
     */
    function begin(){
        document.getElementById("setup").style.display = "none";
        //displays waiting message
        document.getElementById("message").style.display = "block";
        //sets status to valid and posts it to the service
        valid = true;
        intervalholder = setInterval(getvalid,500);
        post("none");
    }

    /**
     * checks to see if the other user is ready when both users are ready then the
     * boards are drawn and player one starts the game
     */
    function getvalid(){
        //fetch until valid
        fetch("http://localhost:3000?mode=status")
        .then(checkStatus)
        //returned data
        .then(function(responseText){
            //posts returned from service
            let posts = JSON.parse(responseText);
            if(pval == 1){
                if(posts.p2){
                    getboards();
                    document.getElementById("message").style.display = "none";
                    document.getElementById("game").style.display = "block";
                    clearInterval(intervalholder);
                    setInterval(checkvalid, 10000);
                    getboards();
                }
            }
            else{
                if(posts.p1){
                    getboards();
                    document.getElementById("message").style.display = "none";
                    document.getElementById("game").style.display = "block";
                    clearInterval(intervalholder);
                    setInterval(checkvalid, 10000);
                    intervalholder = setInterval(getboards,500);
                }
            }
        })
        //error returned
        .catch(function(error){
            console.error(error);
        });
    }

    /**
     * checks for the users to still be connected
     */
    function checkvalid(){
        //fetch until valid
        fetch("http://localhost:3000?mode=status")
        .then(checkStatus)
        //returned data
        .then(function(responseText){
            //posts returned from service
            let posts = JSON.parse(responseText);
            if(pval == 1){
                if(!posts.p2){
                    alert("Player 2 disconnected restarting...");
                    location.reload();
                }
            }
            else{
                if(!posts.p1){
                    alert("Player 1 disconnected restarting...");
                    location.reload();
                }
            }
        })
        //error returned
        .catch(function(error){
            console.error(error);
        });
    }

    /**
     * Post updates the state of the board when attacking aka inmode == "attack"
     * Post sets up boards when player is done placing pieces inmode == "none"
     */
    function post(inmode){
        if(inmode == "attack"){
            //disables buttons
            isturn = false;
            //draws board after attack
            drawboard();
            //keeps checking board until other player places move
            intervalholder = setInterval(getboards,500);
        }

        if(inmode == "close"){
            valid = false;
        }

        //adds params to fetch
        const message ={mode : inmode, player: pval, pboard: playerboard, oboard: opponentboard, pvalid: valid};
        const fetchOptions = {  method : 'POST', 
        headers : { 'Accept': 'application/json','Content-Type' : 'application/json'}, 
        body : JSON.stringify(message)};
        
        //calls fetch
        fetch("http://localhost:3000", fetchOptions)
            .then(checkStatus)
            .catch(function(error){
                console.error(error);
        });
    }

    /**
     * checks if a response is valid or invalid
     * @param {*} response the response that has been recieved
     */
    function checkStatus(response) {  
        //response is valid
        if (response.status >= 200 && response.status < 300) {  
            return response.text();
        } 
        //response is invalid
        else {  
            return Promise.reject(new Error(response.status+": "+response.statusText)); 
        } 
    }
})();