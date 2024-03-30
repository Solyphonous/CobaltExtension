import { download } from "./download.js"

console.log("CobaltExtension initialised successfully")

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

