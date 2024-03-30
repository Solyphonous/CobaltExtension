console.log("popup.js initialised")

//Consts
const allButtons = document.querySelectorAll(".choiceButton")

const defaults = {
    mode: "auto",
}

//Funcs

function loadValue(index) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(index).then(result => {
            let [key, value] = Object.entries(result)[0]
            if (value === undefined) {
                console.log("No value for", index)
                chrome.storage.local.set({index: defaults[index]})
                value = defaults[index]
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

    chrome.storage.local.set({[selection.parentElement.id]: selection.id}).then(() => {
        console.warn("Set", selection.parentElement.id, "to", selection.id)
    })
}

function loadData() {
    const allChoices = document.querySelectorAll(".choiceContainer")
    allChoices.forEach(choice => {
        loadValue(choice.id).then(value => {
            console.log(value)
            document.getElementById(value).classList.add("selected")
        })

    })
}

//Main
loadData()
allButtons.forEach(button => {
    button.addEventListener("click", choiceHandler)
})