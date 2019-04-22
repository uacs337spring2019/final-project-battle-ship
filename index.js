/**
 * Riley McGarity
 * 
 * This is the index js page which checks and only allows 2 player in the game
 * at once. but spectators can always enter
 */
"use strict";
(function(){
    /**
     * on load buttons are wired and the check status is done to make buttons 
     * available if they are allowed
     */
    window.onload = function () {
        //sets up button to allow user to move between screens
        let one = document.getElementById("one");
        let two = document.getElementById("two");
        let spec = document.getElementById("spec");
        one.onclick = function() {
            window.location.href = "../html/player1.html";
        }
        two.onclick = function() {
            window.location.href = "../html/player2.html";
        }
        spec.onclick = function() {
            window.location.href = "../html/spectator.html";
        }
        setInterval(checkbtns, 100);
    }

    /**
     * checks to see if buttons can be enabled/disabled
     */
    function checkbtns(){
        let one = document.getElementById("one");
        let two = document.getElementById("two");
        //fetch until valid
        fetch("https://battleship-337.herokuapp.com?mode=cstat")
        .then(checkStatus)
        //returned data
        .then(function(responseText){
            //posts returned from service
            let vals = JSON.parse(responseText);
            one.disabled = vals.p1;
            two.disabled = vals.p2;
        })
        //error returned
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
