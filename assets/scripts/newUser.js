function fetchNewUser(name) {
    const configObject = generateNewUserConfigObject(name)
    // debugger
    fetch(baseURL+"users", configObject)
        .then(resp => resp.json())
        .then(json => {
            appendUserIdToMain(json.id)
        })
}

function generateNewUserConfigObject(name) {
    return {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            user_name: name
        })
    }
}

function appendUserIdToMain(id) {
    document.getElementById('main').dataset.userId = id
}