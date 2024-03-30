console.log("popup.js initialised")

//Consts
const allButtons = document.querySelectorAll(".choiceButton")

const defaults = {
    mode: "auto",
}

//Funcs

function apiInitialiser() {
    if (typeof browser !== "undefined" && browser.storage.local ) {
        console.log("Browser is firefox")
        return browser
    }
    else if (typeof chrome !== "undefined" && chrome.storage.local) {
        console.log("Browser is chrome")
        return chrome
    }
}

const api = apiInitialiser()

function loadValue(index) {
    return new Promise((resolve, reject) => {
        api.storage.local.get(index).then(result => {
            let key
            let value

            if (Object.keys(result).length === 0 ){
                console.log("No value for", index)
                api.storage.local.set({[index]: defaults[index]})
                value = defaults[index]
            }
            else {
                [key, value] = Object.entries(result)[0]
            }
            
            resolve(value)
        })
    })
}

function choiceHandler(event) {
    let selection = event.target
    let buttons = Array.from(selection.parentElement.children)

    buttons.forEach(button => {
        button.classList.remove("selected")
    })
    selection.classList.add("selected")

    api.storage.local.set({[selection.parentElement.id]: selection.id}).then(() => {
        console.warn("Set", selection.parentElement.id, "to", selection.id)
    })
}

function loadData() {
    const allChoices = document.querySelectorAll(".choiceContainer")
    allChoices.forEach(choice => {
        loadValue(choice.id).then(value => {
            document.getElementById(value).classList.add("selected")
        })

    })
}

//Main
loadData()
allButtons.forEach(button => {
    button.addEventListener("click", choiceHandler)
})