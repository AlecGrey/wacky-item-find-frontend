// ----- NEW GAME FUNCTIONS ----- //
function startNewGame(event) {
    // resets game environment, fetches game list, etc
    resetGameEnvironment()
    toggleGameItemContainerDisplay()
    fetchSampleItem()
    allowCartItemsToBeAdded()
    startGame()
}

function startGame() {
    // sets timer using setInterval function, sets timeout for gameEnd()
    const gameTime = 30 // seconds
    toggleTimerDisplay()
    timer(gameTime * 10) // 30 second timer
}

function gameEnd() {
    // game end functionality, tied to a setTimeout function
    toggleTimerDisplay()
    toggleTimesUpDisplay()
    // alert(finalScore())
}

function resetGameEnvironment() {
    // add functionality to clean the game environment for a new game 
}

function fetchSampleItem() {
    fetch(baseURL+'items/sample-item')
        .then(resp => resp.json())
        .then(displayGameItem)
}

function displayGameItem(json) {
    const gameCard = createGameItemDiv(json)
    const gameCardContainer = document.getElementById('game-item-container')
    removeAllChildNodes(gameCardContainer)
    gameCardContainer.appendChild(gameCard)
}

// ----- HELPER METHODS ----- //
function timer(x) {
    //x should be in deciseconds, aka 10 per second
    if (x < 0) {
        return gameEnd()
    }
    // modify element with updated time
    document.getElementById('timer').textContent = `${Math.floor(x / 10)}:${x % 10}`

    return setTimeout(() => {timer(x - 1)}, 100)
} 