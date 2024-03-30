const settingsMap = {
    mode: {
        auto: false,
        audio: true,
    }
}

function getSetting(setting) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(null, function (data) {
            if (setting in data) {
                let value = data[setting]
                
                console.warn(data[setting])
                console.warn(settingsMap[setting][value])

                resolve(settingsMap[setting][value])
            } else {
                reject(null)
            }
        })
    })
    
}
export function download() {
    chrome.tabs.query({ currentWindow: true, active: true }).then(tabs => {

        let url = tabs[0].url
        let uri = encodeURIComponent(url)

        let data = {
            url: uri,
            isAudioOnly: getSetting("mode")
        }

        console.warn(data.isAudioOnly)
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

                    chrome.tabs.create({
                        url: json.url
                    }).then(tab => {
                        chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, updatedTab) {
                            if (tabId === tab.id && changeInfo.status === 'complete' && !json.url.includes("twimg")) {
                                chrome.tabs.remove(tabId);
                            }
                        })

                        if (window.location.pathname == "/popup.html") {
                            window.close()
                        }
                    })
                }
                else {
                    //Logs error if returned from cobalt api
                    console.error(json.text)
                }
            })
            //Logs error if POST request fails
            .catch(error => console.error("Error: ", error))
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
