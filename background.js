console.log("hello wanker")

browser.contextMenus.create({
        id: "download",
        title: "Download media on page",
        contexts: ["selection"]
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
    switch (info.menuItemId) {
        case "download":
        console.log("I downloa,d")
        break
    }
})

