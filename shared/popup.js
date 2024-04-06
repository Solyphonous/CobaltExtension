import {api} from "./init.js"

console.log("popup.js initialised")

// Consts 
const allButtons = Array.from(document.querySelectorAll(".choiceButton")).concat(Array.from(document.querySelectorAll(".setting")))
console.log(allButtons)
const allChoices = Array.from(document.querySelectorAll(".choiceContainer")).concat(Array.from(document.querySelectorAll(".dropdown-content")))

// Funcs

// Data stuff
function loadData() {
    allChoices.forEach(choice => {
        api.storage.local.get(choice.id).then(result => {
            let value = Object.values(result)[0]
            document.getElementById(value).classList.add("selected")
        })
    })
}

// Other
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

function dropdownHandler(event) {
    let selection = event.target
    let dropdown = selection.parentElement.querySelector(".dropdown-content")

    dropdown.classList.toggle("active")
}

// Main
loadData()

// Listeners
allButtons.forEach(button => {
    button.addEventListener("click", choiceHandler)
})

document.querySelectorAll(".dropdown-btn").forEach(button => {
    button.addEventListener("click", dropdownHandler)
})

// Settings open/close
document.getElementById("settings-button").addEventListener("click", function () {
    document.getElementById("settings").classList.add("open")
})

document.getElementById("settings-back").addEventListener("click", function () {
    document.getElementById("settings").classList.remove("open")
})