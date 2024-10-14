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
        getSetting("metadata"),
        getSetting("twitter gifs"),
        getSetting("tiktok codec"),
        getSetting("instance")
    ]

    const [
        isAudioOnly,
        vQuality,
        youtubeVideoCodec,
        aFormat,
        filenameStyle,
        isTTFullAudio,
        disableMetaData,
        twitterGif,
        tiktokH265,
        instance
    ] = await Promise.all(promises)

    api.tabs.query({ currentWindow: true, active: true }).then(tabs => {

        let url = tabs[0].url

        let data = {
            url: url,
            downloadMode: isAudioOnly,
            videoQuality: vQuality,
            youtubeVideoCodec: youtubeVideoCodec,
            audioFormat: aFormat,
            filenameStyle: filenameStyle,
            tiktokFullAudio: isTTFullAudio,
            disableMetadata: disableMetaData,
            twitterGif: twitterGif,
            tiktokH265: tiktokH265
        }

        fetch(instance, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(data)
        })
            .then(response => response.text())
            .then(rawtext => {
                console.log("Raw response: ", rawtext)

                try {
                    const json = JSON.parse(rawtext)

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
                        showError("error from cobalt api: \n" + json.error.code)

                    }
                } catch (error) {
                    showError("failed to parse JSON: \n" + rawtext);
                }
            })
            //Logs error if POST request fails
            .catch(error => showError("post request failed: \n" + error))
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
