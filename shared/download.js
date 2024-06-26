import { api, settings } from "./init.js"

//Consts

const settingsMap = settings

//Funcs
function getSetting(setting) {
    return new Promise((resolve, reject) => {
        api.storage.local.get(null, function (data) {
            if (setting in data) {
                let value = data[setting]
                resolve(settingsMap[setting][value])
            } else {
                reject(null)
            }
        })
    })

}

function showError(msg) {
    const url = api.runtime.getURL('error.html') + '?error=' + encodeURIComponent(msg)
    api.tabs.create({ url: url })
}

export async function download() {
    const isAudioOnly = await getSetting("mode")
    const vQuality = await getSetting("quality")
    const vCodec = await getSetting("youtube codec")
    const aFormat = await getSetting("audio format")
    const filenamePattern = await getSetting("filename style")
    const isTTFullAudio = await getSetting("tiktok og audio")
    const isAudioMuted = await getSetting("mute audio")
    const dubLang = await getSetting("yt audio track")
    const disableMetaData = await getSetting("metadata")
    const twitterGif = await getSetting("twitter gifs")
    const vimeoDash = await getSetting("vimeo type")
    const tiktokH265 = await getSetting("tiktok codec")

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

        fetch("https://co.wuk.sh/api/json", {
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
                            if (tabId === tab.id && changeInfo.status === 'complete' && !json.url.includes("twimg")) {
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
