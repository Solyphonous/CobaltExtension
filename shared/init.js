//Browser API

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
//Local Storage

const defaults = {
    mode: "auto",
    quality: "720p"
}

const settings = {
    mode: {
        auto: false,
        audio: true,
    },
    quality: {
        "360p": "360",
        "480p": "480",
        "720p": "720",
        "1080p": "1080",
        "1440p": "1440",
        "4k": "4k",
        "8k+": "max"
    }
}

function initialiseValue(index) {
    return new Promise((resolve, reject) => {
        api.storage.local.get(index).then(result => {
            let value

            if (Object.keys(result).length === 0 ){
                console.log("No value for", index)
                api.storage.local.set({[index]: defaults[index]})
                value = defaults[index]
            }
        })
    })
}

export {api, defaults, settings, initialiseValue}