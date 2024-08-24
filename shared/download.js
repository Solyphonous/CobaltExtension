import { api, settings } from "./init.js"

//Consts

const settingsMap = settings

//Funcs
function getSetting(setting) {
    return new Promise((resolve, reject) => {
        if (setting == "instance") { // Stupid workaround for instance bc it's prob the only setting that will ever work like this
            api.storage.local.get("instance").then(data => {
                resolve(data["instance"])
            })
        } else {
            api.storage.local.get(setting, function (data) { // What the fuck is going on here?? Why retrieve the entire settings list for every call??????
                if (setting in data) {
                    let value = data[setting]
                    resolve(settingsMap[setting][value])
                } else {
                    reject(null)
                }
            })
        }
    })
}

function showError(msg) {
    const url = api.runtime.getURL('error.html') + '?error=' + encodeURIComponent(msg)
    api.tabs.create({ url: url })
}

export async function download() {

    const promises = [
        getSetting("mode"),
        getSetting("quality"),
        getSetting("youtube codec"),
        getSetting("audio format"),
        getSetting("filename style"),
        getSetting("tiktok og audio"),
        getSetting("mute audio"),
        getSetting("yt audio track"),
        getSetting("metadata"),
        getSetting("twitter gifs"),
        getSetting("vimeo type"),
        getSetting("tiktok codec"),
        getSetting("instance")
    ]

    const [
        isAudioOnly,
        vQuality,
        vCodec,
        aFormat,
        filenamePattern,
        isTTFullAudio,
        isAudioMuted,
        dubLang,
        disableMetaData,
        twitterGif,
        vimeoDash,
        tiktokH265,
        instance
    ] = await Promise.all(promises)

    api.tabs.query({ currentWindow: true, active: true }).then(tabs => {

        let url = tabs[0].url
        let uri = encodeURIComponent(url)

        let data = {
            url: uri,
            isAudioOnly: isAudioOnly,
            vQuality: vQuality,
            vCodec: vCodec,
            aFormat: aFormat,
            filenamePattern: filenamePattern,
            isTTFullAudio: isTTFullAudio,
            isAudioMuted: isAudioMuted,
            dubLang: dubLang,
            disableMetaData: disableMetaData,
            twitterGif: twitterGif,
            vimeoDash: vimeoDash,
            tiktokH265: tiktokH265
        }

        fetch(instance+"/api/json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(json => {
                if (json.status != "error") {

                    api.tabs.create({
                        url: json.url
                    }).then(tab => {
                        api.tabs.onUpdated.addListener(function (tabId, changeInfo, updatedTab) {
                            if (tabId === tab.id && changeInfo.status === 'complete' && !json.url.includes("twimg") && !json.url.includes("redd.it")) {
                                api.tabs.remove(tabId);
                            }
                        })

                        if (window.location.pathname == "/popup.html") {
                            window.close()
                        }
                    })
                }
                else {
                    //Logs error if returned from cobalt api
                    showError(json.text)
                }
            })
            //Logs error if POST request fails
            .catch(error => showError(error))
    })
}

//Button inside browser action menu
try {
    document.addEventListener('DOMContentLoaded', function () {
        if (window.location.pathname == "/popup.html") {
            document.getElementById('download').addEventListener('click', function () {
                download()
            });
        }
    });

} catch {
    console.warn("Stupid warning for chrome port")
}
