import { download } from "./download.js"

console.log("CobaltExtension initialised successfully")

browser.contextMenus.create({
    id: "download",
    title: "Download media on page",
    contexts: ["all"],
    type: "normal"
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
    switch (info.menuItemId) {
        case "download":
            download()
            break
    }
})

