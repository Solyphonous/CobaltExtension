import { api, settings } from "./init.js"

console.log("popup.js initialised")

// Funcs

// Data stuff
function loadData(choices) {
    choices.forEach(choice => {
        api.storage.local.get(choice.id).then(result => {
            let value = Object.values(result)[0]
            document.getElementById(value).classList.add("selected")
        })
    })

    // Instance Picker

    api.storage.local.get("instance").then(result => {
        console.log(result)
        let value = Object.values(result)[0]
        console.log(value)
        document.getElementById("instance-value").value = value
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

    api.storage.local.set({ [selection.parentElement.id]: selection.id }).then(() => {
        console.log("Set", selection.parentElement.id, "to", selection.id)
    })
}

function dropdownHandler(event) {
    let selection = event.target
    let dropdown = selection.parentElement.querySelector(".dropdown-content")

    dropdown.classList.toggle("active")
}

function generateSettings() {
    for (const key in settings) {
        if (key != "mode" && key != "instance") {
            let dropdown = document.createElement("div")
            dropdown.classList.add("dropdown")
            document.getElementById("settings").appendChild(dropdown)

            let button = document.createElement("button")
            button.classList.add("dropdown-btn")
            button.textContent = key
            dropdown.appendChild(button)

            let dropdownContent = document.createElement("div")
            dropdownContent.classList.add("dropdown-content")
            dropdownContent.id = key
            dropdown.appendChild(dropdownContent)

            for (const setting in settings[key]) {
                let settingButton = document.createElement("button")
                settingButton.classList.add("setting")
                settingButton.id = setting
                settingButton.textContent = setting

                dropdownContent.appendChild(settingButton)
            }
        }
    }
}

function validateURL(url) {
    if (!url.match("^https:")) {
        url = "https://"+url
    }
    if (!url.match("/$")) {
        url = url+"/"
    }

    return url
}

function changeInstance(event) {
    let url = document.getElementById("instance-value").value
    url = validateURL(url)
    api.storage.local.set({"instance": url})
    document.getElementById("instance-value").value = url
    event.preventDefault()
}

// Main

document.addEventListener("DOMContentLoaded", function () {
    generateSettings()

    const allButtons = Array.from(document.querySelectorAll(".choiceButton")).concat(Array.from(document.querySelectorAll(".setting")))
    const allChoices = Array.from(document.querySelectorAll(".choiceContainer")).concat(Array.from(document.querySelectorAll(".dropdown-content")))

    loadData(allChoices)

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

    // Instance picker handling

    document.getElementById("instance-picker-button").addEventListener("click", function () {
        document.getElementById("instance-picker").classList.add("open")
    })

    document.getElementById("instance-picker-back").addEventListener("click", function () {
        document.getElementById("instance-picker").classList.remove("open")
    })

    document.getElementById("instance-form").addEventListener("submit", function (event) {
        changeInstance(event)
    })
})