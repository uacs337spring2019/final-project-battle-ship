"use strict";
(function(){
    window.onload = function(){
        drawboard();
        setInterval(getboards, 1000); 
    }

    //holds the empty boards until the users are ready
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
    
    /**
     * fetches the new boards when board changes
     */
    function getboards(){
        //fetch board
        fetch("http://battleship-337.herokuapp.com?mode=boards")
        .then(checkStatus)
        //returned data
        .then(function(responseText){
            //posts returned from service
            let boards = JSON.parse(responseText);
            playerOneBoard = boards.p1;
            playerTwoBoard = boards.p2;
            drawboard();
        })
        //error returned
        .catch(function(error){
            console.error(error);
        });
    }

    /**
     * Draws the current state of the two boards
     */
    function drawboard(){
        let playeronediv = document.getElementById("playerone");
        let playertwodiv = document.getElementById("playertwo");
        playeronediv.innerHTML = "";
        playertwodiv.innerHTML = "";

        for(let row = 0; row < 8; row++){
            let rdivone = document.createElement("div");
            let rdivtwo = document.createElement("div");
            for(let column = 0; column < 8; column++){
                let cdivone = document.createElement("div");
                let cdivtwo = document.createElement("div");

                cdivone.id = row + "_" + column;
                cdivtwo.id = row + "_" + column;

                if(playerOneBoard[row][column] == 0){
                    //miss area draw blue
                    cdivone.className = "open";
                }
                else if(playerOneBoard[row][column] == 1){
                    //ship area draw grey
                    cdivone.className = "ship";
                }
                else if(playerOneBoard[row][column] == 2){
                    //miss area but fired upon draw white
                    cdivone.className = "miss";
                }
                else if(playerOneBoard[row][column] == 3){
                    //hit area but fired upon draw red
                    cdivone.className = "hit";
                }

                if(playerTwoBoard[row][column] == 0){
                    //miss area draw blue
                    cdivtwo.className = "open";
                }
                else if(playerTwoBoard[row][column] == 1){
                    //ship area draw grey
                    cdivtwo.className = "ship";
                }
                else if(playerTwoBoard[row][column] == 2){
                    //miss area but fired upon draw white
                    cdivtwo.className = "miss";
                }
                else if(playerTwoBoard[row][column] == 3){
                    //hit area but fired upon draw red
                    cdivtwo.className = "hit";
                }
                rdivone.appendChild(cdivone);
                rdivtwo.appendChild(cdivtwo);
            }
            playeronediv.appendChild(rdivone);
            playertwodiv.appendChild(rdivtwo);
        }
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
