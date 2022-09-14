function autoCout() {
    document.getElementById("test").addEventListener("click", function () {
    });
}

function stopCout() {
    document.getElementById("test").addEventListener("click", function () {
    });
}

var isActive = false;
var mode = "manual";
var current = 200;
chrome.action.setBadgeText({ text: current.toString() });



chrome.contextMenus.create({
    id: "1",
    title: "-1",
    contexts: ["all"],
    
});

chrome.contextMenus.create({
    id: "2",
    title: "Reset counter",
    contexts: ["all"],
});

chrome.contextMenus.create({
    id: "3",
    title: "Last click:",
    contexts: ["all"],
});

chrome.contextMenus.onClicked.addListener(function(id) {
    if(id.menuItemId == 1){
        current--;
        chrome.action.setBadgeText({ text: current.toString() });
    }
    if(id.menuItemId == 2){
        current=0;
        chrome.action.setBadgeText({ text: current.toString() });
    }
   })

chrome.action.onClicked.addListener((tab) => {

    if (tab.url.includes("test")) {
        if (isActive == false) {
            isActive = true;
            chrome.action.setIcon({ path: "/icon/icon_running.png" });

            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: autoCout
            });
        }
        else {
            isActive = false;
            chrome.action.setIcon({ path: "/icon/icon.png" });
        }

    }
});

