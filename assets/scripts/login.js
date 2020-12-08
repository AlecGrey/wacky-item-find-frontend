// function createLoginDiv() {
//     // add all login features to a new div and return div
//     const div = document.createElement('div')
//     const button = document.createElement('button')
//     button.className = 'btn btn-secondary'
//     button.dataset.type = 'guest'
//     button.textContent = ' Play as Guest '
//     div.appendChild(button)
//     return div
// }

function loginButtonClick(event) {
    if (event.target.tagName !== 'BUTTON') {return}
    // debugger
    switch (event.target.dataset.type) {
        case 'login':
            displayLoginFields()
            break
        case 'signup':
            displaySignupFields()
            break
        default:
            break
    }
}

function displayLoginFields() {
    hideSignupForm()
    showLoginForm()
}

function displaySignupFields() {
    hideLoginForm()
    showSignupForm()
}

function returnToLogin() {
    toggleUserDivDisplay()
    toggleLeaderboardButtonDisplay()
    toggleStartGameButton()
    toggleLoginContainerDisplay()
    removeCartFromHead()
    removeUserIdFromMainDiv()
}

// ----- TOGGLE FORM BUTTONS ----- //
function hideSignupForm() {
    document.getElementById('signup-form').className = 'd-none'
}

function showSignupForm() {
    document.getElementById('signup-form').className = 'd-block'
}

function hideLoginForm() {
    document.getElementById('login-form').className = 'd-none'
}

function showLoginForm() {
    document.getElementById('login-form').className = 'd-block'
}

// ----- LOGIN/SIGNUP EVENTS ----- //
function addLoginEvent() {
    document.getElementById('login-form').addEventListener('submit', fetchLoginUser)
}

function addSignupEvent() {
    document.getElementById('signup-form').addEventListener('submit', fetchNewUser)
}

function fetchNewUser(event) {
    event.preventDefault()
    const username = event.target.username.value
    if (username === '') {return alert('username cannot be blank!')}

    const configObject = generateNewUserConfigObject(username)
    fetch(baseURL+"users", configObject)
        .then(resp => resp.json())
        .then(signupProcedure)
}

function fetchLoginUser(event) {
    event.preventDefault()
    const username = event.target.username.value
    if (username === "") {return alert('username cannot be blank!')}
    if (username === "ADMIN") {return loadAdminPage()}

    fetch(baseURL+'login?username='+username)
        .then(resp => resp.json())
        .then(loginProcedure)
}

function loginProcedure(json) {
    if (!!json.id) {
        hideLoginForm()

        joinSiteProcedures(json.name)
    } else {
        alert('Invalid login!')
    }
    document.getElementById('login-form').reset()
}

function signupProcedure(json) {
    if (!!json.id) {
        hideSignupForm()
        joinSiteProcedures(json.name)        
    } else {
        alert('Invalid Username!')
    }
    document.getElementById('signup-form').reset()
}

function joinSiteProcedures(name) {
    appendUserIdToMain(name)
    fetchNewCart()
    appendUsernameToWelcomeMessage(name)
    toggleUserDivDisplay()
    toggleLeaderboardButtonDisplay()
    toggleLoginContainerDisplay()
    toggleStartGameButton()
    fetchAndUpdateCurrentLeaderboard()
}

function generateNewUserConfigObject(name) {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            username: name
        })
    }
}

function appendUserIdToMain(id) {
    document.getElementById('main').dataset.userId = id
}