function displayLeaderboardPage(event) {
    fetchAndUpdateCurrentLeaderboard()
    toggleBetweenLeaderboardPageAndUserPage()
}

// ----- FETCH AND UPDATE LEADERBOARD ----- //

function fetchAndUpdateCurrentLeaderboard() {
    fetch(baseURL+'scores')
        .then(resp => resp.json())
        .then(updateLeaderboardItems)
}

function updateLeaderboardItems(json) {
    const tableBody = document.getElementById('leaderboard-scores')
    removeAllChildNodes(tableBody)
    let rank = 1
    for (const scoreObj of json) {
        const row = createTableRowFromScoreObjectAndRank(scoreObj, rank)
        tableBody.appendChild(row)
        rank++
    }
}

function createTableRowFromScoreObjectAndRank(score, i) {
    // takes in a score object and a rank and creates a row item
    const row = document.createElement('tr')
    row.dataset.userId = score.user.id
    
    const rank = document.createElement('th')
    rank.textContent = i
    rank.setAttribute("scope", "row")
    
    const points = document.createElement('td')
    points.textContent = score.score
    
    const user = document.createElement('td')
    user.textContent = score.user.name
    
    row.append(rank, points, user)
    return row
}

// ----- TOGGLE LEADERBOARD DISPLAY ----- //

function toggleBetweenLeaderboardPageAndUserPage() {
    toggleUserDivDisplay()
    toggleLeaderboardDivDisplay()
    toggleLeaderboardButtonDisplay()
    toggleHomepageButtonDisplay()
    toggleStartGameButton()
}

function toggleLeaderboardDivDisplay() {
    const leaderboard = document.getElementById('leaderboard-div')
    if (leaderboard.className === 'd-none') {
        leaderboard.className = 'd-flex justify-content-center flex-column'
    } else {leaderboard.className = 'd-none'}
}