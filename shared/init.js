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
    "mode": "auto",
    "quality": "720p",
    "twitter gifs": "Convert to .gif",
    "youtube codec": "h264 (mp4)",
    "vimeo type": "progressive",
    "audio format": "mp3",
    "mute audio": "unmuted",
    "yt audio track": "original",
    "tiktok og audio": "modified audio",
    "filename style": "classic",
    "metadata": "yes metadata",
    "tiktok codec": "default",
    "instance": "https://api.cobalt.tools"
}

const settings = {
    "mode": {
        auto: false,
        audio: true,
    },
    "quality": {
        "144p": "144",
        "240p": "240",
        "360p": "360",
        "480p": "480",
        "720p": "720",
        "1080p": "1080",
        "1440p": "1440",
        "4k": "4k",
        "8k+": "max"
    },
    "twitter gifs": {
        "Convert to .gif": true,
        "Leave as mp4": false
    },
    "youtube codec": {
        "h264 (mp4)": "h264",
        "av1 (mp4)": "av1",
        "vp9 (webm)": "vp9"
    },
    "vimeo type": {
        "progressive": false,
        "dash": true
    },
    "audio format": {
        "best": "best",
        "mp3": "mp3",
        "ogg": "ogg",
        "wav": "wav",
        "opus": "opus"
    },
    "mute audio": {
        "unmuted": false,
        "muted": true
    },
    "yt audio track": {
        "original": false,
        "translated": true
    },
    "tiktok og audio": {
        "original": true,
        "modified audio": false
    },
    "filename style": {
        "classic": "classic",
        "pretty": "pretty",
        "basic": "basic",
        "nerdy": "nerdy"
    },
    "metadata": {
        "yes metadata": false,
        "no metadata": true
    },
    "tiktok codec": {
        "default": false,
        "h265": true
    },
    "instance": {} // No options since it's a text field, table required anyway to months-old lack of forward planning
}

function initialiseValue(index) {
    return new Promise((resolve, reject) => {
        api.storage.local.get(index).then(result => {
            if (Object.keys(result).length === 0 ){
                console.log("No value for", index)
                api.storage.local.set({[index]: defaults[index]})
                value = defaults[index]
            }
        })
    })
}

export {api, settings, initialiseValue}