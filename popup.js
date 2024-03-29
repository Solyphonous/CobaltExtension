console.log("popup.js initialised")

//Consts
const allButtons = document.querySelectorAll(".choiceButton")

const defaults = {
    mode: "auto",
}

//Funcs
function loadValue(index) {
    let value = localStorage.getItem(index)
    console.log(index, value)
    if (value == "undefined") {
        console.log("No value for ", index)
        localStorage.setItem(index, defaults[index])
        value = localStorage.getItem(index)
    }
    return value
}

function choiceHandler(event) {
    let selection = event.target
    let buttons = Array.from(selection.parentElement.children)

    buttons.forEach(button => {
        button.classList.remove("selected")
    })
    selection.classList.add("selected")

    localStorage.setItem(selection.parentElement.id, selection.id)
    console.log("Set", selection.parentElement.id, "to", selection.id)
}

function loadData() {
    const allChoices = document.querySelectorAll(".choiceContainer")
    allChoices.forEach(choice => {
        let value = loadValue(choice.id)
        document.getElementById(value).classList.add("selected")
    })
}

//Main
loadData()
allButtons.forEach(button => {
    button.addEventListener("click", choiceHandler)
})