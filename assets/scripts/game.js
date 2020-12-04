// ----- NEW GAME FUNCTIONS ----- //
function startNewGame(event) {
    // resets game environment, fetches game list, runs game
    toggleGameItemContainerDisplay()
    fetchSampleItem()
    allowCartItemsToBeAdded()
    startGame() // includes game end functionality
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
    fetchPostGameScore()
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

function fetchPostGameScore() {
    // take the cartId and number of skips and send to DB to generate a score
    const cart = document.getElementById('cart')
    const cartId = parseInt(cart.dataset.cartId)
    const skips = parseInt(cart.dataset.gameSkips)
    // debugger
    const configObject = generateScoreConfigObject(cartId, skips)

    fetch(baseURL + 'scores', configObject)
        .then(resp => resp.json())
        .then(json => {
            // console.log(json);
            alert(`${json.name} scored ${json.score} points!`)
        })
}

function generateScoreConfigObject(cartId, skips) {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            cart_id: cartId,
            skips: skips
        })
    }
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

function skipGameItem(event) {
    document.getElementById('cart').dataset.gameSkips++
    fetchSampleItem()
}