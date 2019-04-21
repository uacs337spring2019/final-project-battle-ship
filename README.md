# 337
These are the current ideas for the Battleship project:

3 possible user pages
    -player 1
    -player 2
    -spectator

index.html will contain the initial page that allows a user to join the current game
    -redirects to player 1 and player 2 page
    -redirects to spectator page
    -holds current games who's states are stored in sql
    -allows new games to be created 
    -shows old games and their results

player1.html
    -contains the player 1 board and can only see player 1 board

player2.html
    -contains the player 2 board and can only see player 2 board

spectator.html
    -contains both boards with hit/miss counters

find way so that only 2 players can enter at once
    -possible ways... make fetch that allows entry when its detected that the game is missing a player
    -find way that when a player leaves the game can detect the change

service
    -holds game state and allows players to join if and only if space is open
    -allows a new game to be created