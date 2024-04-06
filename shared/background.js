import { download } from "./download.js"
import { initialiseValue, settings, api } from "./init.js"

chrome.contextMenus.create({
    id: "download",
    title: "Download media on page",
    contexts: ["all"],
    type: "normal"
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    switch (info.menuItemId) {
        case "download":
            download()
            break
    }
})

//Settings initialisation

Object.keys(settings).forEach(setting => {
    initialiseValue(setting)
    api.storage.local.get(setting).then(value =>{
        console.log(setting, "initialised to", Object.values(value)[0])
    })
})