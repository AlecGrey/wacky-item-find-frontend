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
    hideLoginErrors()
}

function displaySignupFields() {
    hideLoginForm()
    showSignupForm()
    hideLoginErrors()
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

        joinSiteProcedures(json)
    } else {
        showLoginErrors()
        addErrorsToPage(json.errors)
    }
    document.getElementById('login-form').reset()
}

function signupProcedure(json) {
    if (!!json.id) {
        hideSignupForm()
        joinSiteProcedures(json)        
    } else {
        showLoginErrors()
        addErrorsToPage(json.errors)
    }
    document.getElementById('signup-form').reset()
}

function joinSiteProcedures(json) {
    appendUserIdToMain(json.id)
    fetchNewCart()
    appendUsernameToWelcomeMessage(json.name)
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

function showLoginErrors() {
    document.getElementById('error-box').className = 'd-flex justify-content-center flex-column alert alert-danger'
}

function hideLoginErrors() {
    document.getElementById('error-box').className = 'd-none'
}

function addErrorsToPage(errorArray) {
    const errorDiv = document.getElementById('error-box')
    removeAllChildNodes(errorDiv)
    for (const err of errorArray) {
        const p = createErrorTextElement(err)
        errorDiv.appendChild(p)
    }
}

function createErrorTextElement(string) {
    const p = document.createElement('p')
    p.className = 'my-1'
    p.textContent = string
    return p
}