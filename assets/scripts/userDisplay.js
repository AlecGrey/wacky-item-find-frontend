function appendUserToUserDisplay(name) {
    // adds a jumbotron div with user welcome and page options
    const userDisplay = document.getElementById('user-display')
    const welcomeDiv = createNewWelcomeDiv(name)
    const changeNameDiv = createChangeUserNameDiv()

    userDisplay.append(welcomeDiv, changeNameDiv)
}

function createNewWelcomeDiv(name) {
    const jumbotron = document.createElement('div')
    jumbotron.id = 'user-welcome'
    jumbotron.className = 'jumbotron'

    const welcomeHeader = document.createElement('h1')
    welcomeHeader.className = "display-4"
    welcomeHeader.textContent = `Welcome, ${name}!`

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