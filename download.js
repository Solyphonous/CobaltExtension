export function download() {
    browser.tabs.query({ currentWindow: true, active: true }).then(tabs => {
        let url = tabs[0].url
        var uri = encodeURIComponent(url)

        var data = {
            url: uri
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

                    browser.tabs.create({
                        url: json.url
                    }).then(tab => {
                        browser.tabs.onUpdated.addListener(function (tabId, changeInfo, updatedTab) {
                            if (tabId === tab.id && changeInfo.status === 'complete' && !json.url.includes("twimg")) {
                                browser.tabs.remove(tabId);
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
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname == "/popup.html") {
        document.getElementById('download').addEventListener('click', function() {
            download()
        });
    }
});
