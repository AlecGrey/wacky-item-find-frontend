function appendUsernameToWelcomeMessage(name) {
    // adds a jumbotron div with user welcome and page options
    document.getElementById('welcome-header').textContent = `Welcome, ${name}!`
}

function createUserDisplayContent() {
    const userDisplay = document.getElementById('user-display')
    const welcomeDiv = createNewWelcomeDiv()
    const changeNameDiv = createChangeUserNameDiv()
    const deleteUserDiv = createDeleteUserDiv()
    const logoutDiv = createLogoutDiv()
    
    userDisplay.append(welcomeDiv, changeNameDiv, deleteUserDiv, logoutDiv)
}

function createNewWelcomeDiv() {
    const jumbotron = document.createElement('div')
    jumbotron.id = 'user-welcome'
    jumbotron.className = 'jumbotron'

    const welcomeHeader = document.createElement('h1')
    welcomeHeader.className = "display-4"
    welcomeHeader.id = 'welcome-header'

    const lead = document.createElement('p')
    lead.className = 'lead'
    lead.textContent = "You've been hand-selected to take part in our Wacky Item Game!"

    const hr = document.createElement('hr')
    hr.className = "my-4"

    const h4 = document.createElement('h4')
    h4.textContent = 'How to play'

    const instructions = document.createElement('p')
    instructions.className = 'lead'
    instructions.innerHTML = `It's your lucky day.  You have been hand selected from nearly tens of applicants to participate in our wacky game show.  The objective of this game is to seek out and find specific items from our store.  Unfortunately because of COVID we've had to make this a <em>virtual event...</em><br><br>Using our HIGH-TECH search features, narrow down and fine tune your selections in order to find as many items as possible in the time period!<br><br>Click <strong>Start Game</strong> above to get started, or checkout our our <strong>Leaderboard</strong>!`

    const disclaimer = document.createElement('p')
    disclaimer.className = 'disclaimer font-italic'
    disclaimer.innerHTML = `You do not get to keep these items upon game completion.  In fact, there is very little point to this game at all and is an entirely underwhelming experience.  All items are from the etsy store.  We do not take responsibility for any emotional scarring which may occur from finding kinky items that <strong>apparently</strong> run rampant on the etsy marketplace.`


    jumbotron.append(welcomeHeader, lead, hr, h4, instructions, disclaimer)
    return jumbotron
}

function createChangeUserNameDiv() {
    const changeNameDiv = document.createElement('div')
    changeNameDiv.id = 'change-name-div'

    const button = document.createElement('button')
    button.className = 'btn btn-secondary'
    button.textContent = 'Change Username'

    const form = document.createElement('form')
    form.id = 'change-username-form'
    form.className = 'd-none'

    const input = document.createElement('input')
    input.type = 'text'

    const submit = document.createElement('input')
    submit.className = 'btn btn-secondary'
    submit.type = 'submit'

    button.addEventListener('click', toggleFormDisplayEvent)
    form.addEventListener('submit', changeUsername)

    form.append(input, submit)
    changeNameDiv.append(button, form)

    return changeNameDiv
}

function createDeleteUserDiv() {
    const div = document.createElement('div')
    div.id = 'delete-user-div'

    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'Delete User'
    deleteButton.className = 'btn btn-secondary'
    deleteButton.id = 'delete-user-button'

    const yes = document.createElement('button')
    yes.textContent = 'Yes'
    yes.className = 'd-none'
    yes.id = 'delete-yes'

    const no = document.createElement('button')
    no.textContent = 'No'
    no.className = 'd-none'
    no.id = 'delete-no'

    deleteButton.addEventListener('click', areYouSureEvent)
    yes.addEventListener('click', deleteUserFromDatabase)
    no.addEventListener('click', cancelDeleteUser)

    div.append(deleteButton, yes, no)
    return div
}

function createLogoutDiv() {
    const div = document.createElement('div')
    div.id = 'logout-div'

    const logoutButton = document.createElement('button')
    logoutButton.textContent = 'Logout'
    logoutButton.className = 'btn btn-secondary'
    logoutButton.id = 'logout-button'

    logoutButton.addEventListener('click', returnToLogin)

    div.appendChild(logoutButton)
    return div
}

// ----- Event handling functions ----- //

function areYouSureEvent(event) {
    toggleDeleteConfirmationButtonsDisplay()
}

function deleteUserFromDatabase(event) {
    toggleDeleteConfirmationButtonsDisplay()
    userId = document.getElementById('main').dataset.userId

    fetch(baseURL+'users/'+userId, {method: 'DELETE'})
        .then(resp => resp.json())
        .then(returnToLogin) //method found in index.js 
}

function cancelDeleteUser(event) {
    toggleDeleteConfirmationButtonsDisplay()
}

function toggleFormDisplayEvent(event) {
    toggleFormDisplay(event.target)
}

function toggleFormDisplay(btn) {
    const button = btn
    const form = document.getElementById('change-username-form')
    if (form.className === 'd-none') {
        form.className = 'd-block'
        button.textContent = 'Cancel'
    } else {
        form.className = 'd-none'
        button.textContent = 'Change Username'
    }
}

function toggleDeleteConfirmationButtonsDisplay() {
    yesButton = document.getElementById('delete-yes')
    noButton = document.getElementById('delete-no')
    deleteButton = document.getElementById('delete-user-button')

    if (yesButton.className === 'd-none') {
        yesButton.className = 'btn btn-secondary'
        noButton.className = 'btn btn-secondary'
        deleteButton.textContent = 'Are You Sure?'
    } else {
        yesButton.className = 'd-none'
        noButton.className = 'd-none'
        deleteButton.textContent = 'Delete User'
    }
}

function changeUsername(event) {
    event.preventDefault()
    const userId = document.getElementById('main').dataset.userId
    const newUsername = event.target.children[0].value
    const configObject = generatePatchObjectForNewUsername(newUsername)
    // debugger
    fetch(baseURL+'users/'+userId, configObject)
        .then(resp => resp.json())
        .then(updateUserPage)
}

function generatePatchObjectForNewUsername(username) {
    return {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: username
        })
    }
}

function updateUserPage(json) {
    // changes the welcome message, hides the form, and resets the form field
    const changeNameDiv = document.getElementById('change-name-div')
    toggleFormDisplay(changeNameDiv.children[0])
    document.querySelector('#user-welcome > h1').textContent = `Welcome, ${json.name}!`
    changeNameDiv.children[1].reset()
}