import {api} from "./init.js"

console.log("popup.js initialised")

//Consts
const allButtons = document.querySelectorAll(".choiceButton")

//Funcs

//Data stuff
function loadData() {
    const allChoices = document.querySelectorAll(".choiceContainer")
    allChoices.forEach(choice => {
        api.storage.local.get(choice.id).then(result => {
            let value = Object.values(result)[0]
            document.getElementById(value).classList.add("selected")
        })
    })
}

//Other
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

//Main
loadData()
allButtons.forEach(button => {
    button.addEventListener("click", choiceHandler)
})