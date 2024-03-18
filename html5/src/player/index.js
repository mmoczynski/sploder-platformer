const Game = require("../game");

function Player() {

}

Player.Game = function(xmlDocument) {

    // Call constructor for Game class.
    Game.call(this,xmlDocument);

}

// Protype inheritence
Object.assign(Player.Game.prototype,Game.prototype);

Player.Game.prototype.startGame = function() {

}

Player.Game.prototype.updateGame = function() {

}

Player.Game.prototype.loadNextLevel = function() {

}

Player.Game.prototype.restartGame = function() {

}

Player.Game.prototype.endGame = function() {

}

Player.GameLevel = function() {

}