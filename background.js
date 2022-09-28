
const SHODAN_API = "iVaixJbnxaPBeJhuQHTM6Sn7kyOMQ5xJ";

chrome.runtime.onInstalled.addListener(function (reason) {

    let exitsNotiSound = [];
    exitsNotiSound.push(["Bell ringing 1", "bell-ringing-1.mp3"]);
    exitsNotiSound.push(["Bell ringing 2", "bell-ringing-2.mp3"]);
    exitsNotiSound.push(["Iphone", "iphone.mp3"]);
    exitsNotiSound.push(["Iphone Notification", "iphone_notification.mp3"]);
    exitsNotiSound.push(["Old telephone ring", "old-telephone-ring.mp3"]);
    exitsNotiSound.push(["Phone off hook", "phone-off-hook.mp3"]);
    exitsNotiSound.push(["Telephone ring", "telephone-ring.mp3"]);
    exitsNotiSound.push(["Vintage telephone ringtone", "vintage-telephone-ringtone.mp3"]);

    if (reason.reason == "install") {
        chrome.storage.local.set({
            "totalClick": 0,
            "lastClick": null,
            "clickHistory": [],
            "autoCount": false,
            "autoCountSound": "default.mp3",
            "countTime": false,
            "countTimeBoxPos": 45,
            "autoSubmit": false,
            "autoSubmitAfter": 120,
            "showAutoSubmitWhileRemaining": 90,
            "alertVPNDisconnected": false,
            "taskAvailableNoti": false,
            "taskAvailableNotiTitle": "Attention",
            "taskAvailableNotiContent": "Task available!",
            "taskAvailableNotiSound": false,
            "taskAvailableNotiSoundFileName": "vintage-telephone-ringtone.mp3",
            "taskAvailNotiSoundCustom": false,
            "soundExists": exitsNotiSound,
            "soundCustoms": [],
            "taskAvailableLoopNoti": true,
        });
    }

})
// On start up
chrome.runtime.onStartup.addListener(function () {

})

const isUrlFound = async (url) => {
    try {
        const response = await fetch(url, {
            method: 'HEAD',
            cache: 'no-cache'
        });

        return response.status === 200;

    } catch (error) {
        console.log(error);
        return false;
    }
}



// setTimeout(() => {
//     let ip = "31.171.154.220";
//     fetch('https://api.shodan.io/shodan/host/' + ip + "?key=" + SHODAN_API)
//         .then((response) => response.json())
//         .then((data) => {
//             // chrome.storage.local.set({
//             //     "currentIpAddr": data.ipAddress,
//             // });
//             let tags = data.tags;
//             let host = JSON.stringify(data.data[0].http.host);
//             console.log("Tags: " + tags);
//             console.log("IP: " + host);
//             if(tags == "vpn"){
//                 console.log("VPN")
//             }
//         });
// }, 100)

// Message listener
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    // Alert VPN disconnected mode
    if (Object.getOwnPropertyNames(request) == "getAlertVPNDisMode") {
        chrome.storage.local.get(["alertVPNDisconnected"], function (items) {
            sendResponse(items.alertVPNDisconnected);
        });
        return true;
    }


    // Check VPN
    if (Object.getOwnPropertyNames(request) == "checkVPN") {

        fetch('http://ip-api.com/json')
            .then((response) => response.json())
            .then((data) => {
                let ip = data.query;
                fetch('https://api.shodan.io/shodan/host/' + ip + "?key=" + SHODAN_API)
                    .then((response) => response.json())
                    .then((data) => {
                        let tags = data.tags;
                        // let host = JSON.stringify(data.data[0].http.host);
                        // console.log("Tags: " + tags);
                        // console.log("IP: " + host);
                        sendResponse(tags);
                    });
            });

        return true;
    }

    // Auto count
    if (Object.getOwnPropertyNames(request) == "autoCount") {
        if (request.autoCount == "true") {
            chrome.storage.local.get(["autoCount"], function (items) {
                if (items.autoCount == true) {
                    chrome.storage.local.get(["totalClick"], function (items) {
                        let newTotalClick = parseInt(items.totalClick) + 1;
                        chrome.storage.local.set({ totalClick: newTotalClick });
                        chrome.action.setBadgeText({ text: newTotalClick.toString() });
                        sendResponse(newTotalClick);
                    });
                }
                else {
                    sendResponse("Not auto");
                }
            });

            updateLastClick();
        }
        return true;

    }

    // Auto submit count
    if (Object.getOwnPropertyNames(request) == "autoSubmitCount") {
        if (request.autoSubmitCount == "true") {
            chrome.storage.local.get(["autoCount", "autoSubmit"], function (items) {
                if (items.autoSubmit == true && items.autoCount == false) {
                    chrome.storage.local.get(["totalClick"], function (items) {
                        let newTotalClick = parseInt(items.totalClick) + 1;
                        chrome.storage.local.set({ totalClick: newTotalClick });
                        chrome.action.setBadgeText({ text: newTotalClick.toString() });
                        sendResponse(newTotalClick);

                    });
                }
                else {
                    sendResponse("Auto submit false");
                }
            });

            updateLastClick();
            return true;
        }

    }

    // Get count task time mode
    if (Object.getOwnPropertyNames(request) == "getCountTaskTimeMode") {
        if (request.getCountTaskTimeMode == "true") {

            chrome.storage.local.get(["countTime"], function (items) {
                sendResponse(items.countTime);
            });
        }
        return true;
    }

    // Get and return sound
    if (Object.getOwnPropertyNames(request) == "getResFile") {
        if (request.getResFile == "taskAvailableNotiSound") {

            chrome.storage.local.get(["taskAvailableNotiSoundFileName"], function (items) {
                let fileName = items.taskAvailableNotiSoundFileName;
                chrome.storage.local.get(["taskAvailNotiSoundCustom"], async function (items) {
                    let soundUrl = "";
                    if (items.taskAvailNotiSoundCustom == false) {
                        soundUrl = chrome.runtime.getURL("res/sounds/" + fileName);
                    } else {
                        soundUrl = chrome.runtime.getURL("res/sounds/customs/" + fileName);
                    }
                    //
                    let isFileExists = await isUrlFound(soundUrl);
                    if (!isFileExists) {
                        soundUrl = chrome.runtime.getURL("res/sounds/vintage-telephone-ringtone.mp3");
                        isFileExists = await isUrlFound(soundUrl);
                        if (!isFileExists) {
                            // https://.... sound source
                            soundUrl = chrome.runtime.getURL("res/sounds/vintage-telephone-ringtone.mp3");
                            isFileExists = await isUrlFound(soundUrl);
                            sendResponse(soundUrl);
                        }
                        else {
                            sendResponse(soundUrl);
                        }
                    }
                    else {
                        sendResponse(soundUrl);
                    }
                });

            });
        }
        return true;

    }

    // Check custom sound file
    if (Object.getOwnPropertyNames(request) == "checkCustomSoundFile") {
        let a = async () => {
            let soundUrl = chrome.runtime.getURL("res/sounds/customs/" + request.checkCustomSoundFile);
            let isFileExists = await isUrlFound(soundUrl);
            sendResponse(isFileExists);
        }
        a();
        return true;

    }


    // Get tast avail noti mode
    if (Object.getOwnPropertyNames(request) == "taskAvailableNoti") {
        if (request.taskAvailableNoti == "true") {

            chrome.storage.local.get(["taskAvailableNoti"], function (items) {
                sendResponse(items.taskAvailableNoti);
            });
        }
        return true;

    }

    // Get tast available noti sound
    if (Object.getOwnPropertyNames(request) == "taskAvailableNotiSound") {
        chrome.storage.local.get(["taskAvailableNotiSound"], (items) => {
            sendResponse(items.taskAvailableNotiSound);
        });
        return true;

    }


    // Get loop notification sound
    if (Object.getOwnPropertyNames(request) == "getTaskAvailableLoopNoti") {
        if (request.getTaskAvailableLoopNoti == "true") {

            chrome.storage.local.get(["taskAvailableLoopNoti"], function (items) {
                sendResponse(items.taskAvailableLoopNoti);
            });
        }
        return true;

    }


    // Create noitification
    if (Object.getOwnPropertyNames(request) == "createAvalableTaskNoiti") {
        if (request.createAvalableTaskNoiti == "true") {
            chrome.storage.local.get(["taskAvailableNotiTitle", "taskAvailableNotiContent"], function (items) {
                chrome.notifications.create({
                    title: items.taskAvailableNotiTitle,
                    message: items.taskAvailableNotiContent,
                    iconUrl: "/assets/imgs/icons/ewoq-logo.png",
                    type: "basic"
                })
            });
        }
        return true;

    }


    // Get auto submit mode
    if (Object.getOwnPropertyNames(request) == "getAutoSubmitMode") {
        if (request.getAutoSubmitMode == "true") {
            chrome.storage.local.get(["autoSubmit"], function (items) {
                sendResponse(items.autoSubmit);
            });
        }
        return true;

    }

    // Get time auto submit after
    if (Object.getOwnPropertyNames(request) == "getAutoSubmitAfter") {
        if (request.getAutoSubmitAfter == "true") {
            chrome.storage.local.get(["autoSubmitAfter"], function (items) {
                sendResponse(items.autoSubmitAfter);
            });
        }
        return true;

    }

    // Get show auto submit while remainning
    if (Object.getOwnPropertyNames(request) == "getShowAutoSubmitWhileRemaining") {
        if (request.getShowAutoSubmitWhileRemaining == "true") {
            chrome.storage.local.get(["showAutoSubmitWhileRemaining"], function (items) {
                sendResponse(items.showAutoSubmitWhileRemaining);
            });
        }
        return true;

    }


    // Switch auto count mode
    if (Object.getOwnPropertyNames(request) == "switchAutoCountMode") {
        // Turm on
        if (request.switchAutoCountMode == "turn on") {
            chrome.storage.local.set({ "autoCount": true });
            chrome.action.setIcon({ path: "/icon/icon_auto.png" });
            chrome.contextMenus.update("3", {
                title: "Auto count: ON"
            });
            sendResponse("Turn on Auto count mode");
        }
        // Turn off
        else {
            chrome.storage.local.set({ "autoCount": false });
            chrome.contextMenus.update("3", {
                title: "Auto count: OFF"
            });
            chrome.action.setIcon({ path: "./icon/icon_manual.png" });
            sendResponse("Turn off Auto count mode");
        }

        return true;

    }

    // Switch count time mode
    if (Object.getOwnPropertyNames(request) == "switchCountTimeMode") {
        // Turm on
        if (request.switchCountTimeMode == "turn on") {
            chrome.storage.local.set({ "countTime": true });
            chrome.contextMenus.update("4", {
                title: "Count time: ON"
            });
            sendResponse("Turn on Count time mode");
        }
        // Turn off
        else {
            chrome.storage.local.set({ "countTime": false });
            chrome.contextMenus.update("4", {
                title: "Count time: OFF"
            });
            sendResponse("Turn off Count time mode");
        }
        return true;

    }


    // Switch auto submit mode
    if (Object.getOwnPropertyNames(request) == "switchAutoSubmitMode") {
        // Turm on
        if (request.switchAutoSubmitMode == "turn on") {
            chrome.storage.local.set({ "autoSubmit": true });
            chrome.contextMenus.update("5", {
                title: "Auto submit: ON"
            });
            sendResponse("Turn on Auto submit mode");
        }
        // Turn off
        else {
            chrome.storage.local.set({ "autoSubmit": false });
            chrome.contextMenus.update("5", {
                title: "Auto submit: OFF"
            });
            sendResponse("Turn off Auto submit mode");
        }
        return true;

    }

    // Switch alert VPN disconnect
    if (Object.getOwnPropertyNames(request) == "switchAlertVPNDisMode") {
        // Turm on
        if (request.switchAlertVPNDisMode == "turn on") {
            chrome.storage.local.set({ "alertVPNDisconnected": true });
            sendResponse("Turn on VPN disconnect mode");
        }
        // Turn off
        else {
            chrome.storage.local.set({ "alertVPNDisconnected": false });
            sendResponse("Turn off VPN disconnect mode");
        }
        return true;

    }


    // Switch task avail noti
    if (Object.getOwnPropertyNames(request) == "switchTaskAvailableNoti") {
        // Turm on
        if (request.switchTaskAvailableNoti == "turn on") {
            chrome.storage.local.set({ "taskAvailableNoti": true });
            chrome.contextMenus.update("6", {
                title: "Task available notification: ON"
            });
            sendResponse("Turn on Task available noti");
        }
        // Turn off
        else {
            chrome.storage.local.set({ "taskAvailableNoti": false });
            chrome.contextMenus.update("6", {
                title: "Task available notification: OFF"
            });
            sendResponse("Turn off Task available noti");
        }
        return true;

    }


    // Reset counter
    if (Object.getOwnPropertyNames(request) == "resetCounter") {
        if (request.resetCounter == "true") {
            chrome.storage.local.set({ totalClick: 0 });
            chrome.action.setBadgeText({ text: "0" });
            sendResponse("Counter reset successfully");
        }
    }

    // Set total click
    if (Object.getOwnPropertyNames(request) == "setTotalClick") {
        let totalClick = parseInt(request.setTotalClick);
        chrome.storage.local.set({ totalClick: totalClick });
        chrome.action.setBadgeText({ text: totalClick.toString() });
        sendResponse("Set new total click to " + totalClick + " successfully");
    }

    // Set check network status
    if (Object.getOwnPropertyNames(request) == "setTotalClick") {
        let totalClick = parseInt(request.setTotalClick);
        chrome.storage.local.set({ totalClick: totalClick });
        chrome.action.setBadgeText({ text: totalClick.toString() });
        sendResponse("Set new total click to " + totalClick + " successfully");
    }

});

// Get current time
function getCurrentTime() {
    let currentdate = new Date();
    let currentTime =
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear() +
        ", " +
        currentdate.getHours() +
        ":" +
        currentdate.getMinutes() +
        ":" +
        currentdate.getSeconds();

    return currentTime;
}

// Function update last click
function updateLastClick() {
    let lastClickTime = getCurrentTime();
    chrome.storage.local.set({ "lastClick": lastClickTime });
    chrome.contextMenus.update("7", {
        title: "Last click: " + lastClickTime,
    });

    //
    chrome.storage.local.get(["clickHistory"], function (items) {
        let his = items.clickHistory;
        if (his.length < 200) {
            his.push(lastClickTime);
        } else {
            for (let i = 0; i < his.length; i++) {
                if (i == his.length - 1) {
                    his[i] = lastClickTime;
                } else {
                    his[i] = his[i + 1];
                }
            }
        }

        chrome.storage.local.set({ clickHistory: his });

    });


}

// Load current when restart extension/browser
setTimeout(function () {
    chrome.storage.local.get([
        "totalClick",
        "lastClick",
        "autoCount",
        "countTime",
        "autoSubmit",
        "taskAvailableNoti"

    ], function (items) {

        let totalClick = items.totalClick;
        let autoCount = items.autoCount ? "ON" : "OFF";
        let autoCountIcon = items.autoCount ? "/icon/icon_auto.png" : "/icon/icon_manual.png";
        let countTime = items.countTime ? "ON" : "OFF";
        let autoSubmit = items.autoSubmit ? "ON" : "OFF";
        let taskAvailableNoti = items.taskAvailableNoti ? "ON" : "OFF";
        let lastClick = items.lastClick;

        // 1. Total click
        chrome.action.setBadgeText({ text: totalClick.toString() });
        // 3. Auto count
        chrome.contextMenus.update("3", {
            title: "Auto count: " + autoCount,
        });
        chrome.action.setIcon({ path: autoCountIcon });
        // 4. Count time
        chrome.contextMenus.update("4", {
            title: "Count time: " + countTime,
        });
        // 5. Auto submit
        chrome.contextMenus.update("5", {
            title: "Auto submit: " + autoSubmit,
        });
        // 6. Task available noitification
        chrome.contextMenus.update("6", {
            title: "Task available noitification: " + taskAvailableNoti,
        });
        // 7. Last click
        chrome.contextMenus.update("7", {
            title: "Last click: " + lastClick,
        });
    });

    // Check lis sound custom
    chrome.storage.local.get(["soundCustoms", "taskAvailableNotiSoundFileName", "taskAvailNotiSoundCustom"], async function (items) {
        let currentFileName = items.taskAvailableNotiSoundFileName;
        let oldList = items.soundCustoms;
        let newList = [];
        let cond1 = false;
        let cond2 = false;
        for (let i = 0; i < oldList.length; i++) {
            let fileName = oldList[i][1];
            let fileUrl = chrome.runtime.getURL("res/sounds/customs/" + fileName);
            let isFileExists = await isUrlFound(fileUrl);
            if (isFileExists) {
                newList.push(oldList[i])
            }
            // Set new
            if(!isFileExists && currentFileName == fileName){
                cond1 = true;
            }
        }
        //
        if(newList.length == 0){
            cond2 = true;
        }
        //
        if(items.taskAvailNotiSoundCustom == true && (cond1 == true || oldList.length == 0)){
            if(cond2 == true){
                chrome.storage.local.set({
                    "taskAvailNotiSoundCustom": false,
                    "taskAvailableNotiSoundFileName": "vintage-telephone-ringtone.mp3"
                });
            }
            else{
                chrome.storage.local.set({
                    "taskAvailableNotiSoundFileName": newList[0][1]
                });
            }
        }
        chrome.storage.local.set({ "soundCustoms": newList });
        // console.log(newList);

    });

}, 500)

// Context menu create
chrome.contextMenus.removeAll(function () {

    // 1
    chrome.contextMenus.create({
        id: "1",
        title: "-1",
        contexts: ["all"],
    });

    // 2
    chrome.contextMenus.create({
        id: "2",
        title: "Reset counter",
        contexts: ["all"],
    });

    // 3
    chrome.contextMenus.create({
        id: "3",
        title: "Auto count: OFF",
        contexts: ["all"],
    });

    // 4
    chrome.contextMenus.create({
        id: "4",
        title: "Count time: OFF",
        contexts: ["all"],
    });

    // 5
    chrome.contextMenus.create({
        id: "5",
        title: "Auto submit: OFF",
        contexts: ["all"],
    });

    // 6
    chrome.contextMenus.create({
        id: "6",
        title: "Task available notification: OFF",
        contexts: ["all"],
    });

    // 7
    chrome.contextMenus.create({
        id: "7",
        title: "Last click: ",
        contexts: ["all"],
    });


    chrome.storage.local.get(["lastClick"], function (items) {
        chrome.contextMenus.update("7", {
            title: ("Last click: " + items.lastClick)
        });
    });

    // 8
    chrome.contextMenus.create({
        id: "8",
        title: "Guideline",
        contexts: ["all"],
    });

    // 9
    chrome.contextMenus.create({
        id: "9",
        title: "Develop by: duongcongit",
        contexts: ["all"],
    });

});

// Context menu click event
chrome.contextMenus.onClicked.addListener(function (id, tab) {
    // 1. Decrease counter
    if (id.menuItemId == 1) {
        chrome.storage.local.get(["totalClick"], function (items) {
            let totalClick = parseInt(items.totalClick);
            if (totalClick > 0) {
                totalClick = totalClick - 1;
                chrome.storage.local.set({ totalClick: totalClick.toString() });
                chrome.action.setBadgeText({ text: totalClick.toString() });
            }

        });

    }
    // 2. Reset counter
    if (id.menuItemId == 2) {
        totalClick = 0;
        chrome.storage.local.set({ totalClick: "0" });
        chrome.action.setBadgeText({ text: "0" });
    }
    // 3. Auto count task EWOQ
    if (id.menuItemId == 3) {
        chrome.storage.local.get(["autoCount"], function (items) {
            if (items.autoCount == true) {
                chrome.storage.local.set({ "autoCount": false });
                chrome.contextMenus.update("3", {
                    title: "Auto count: OFF"
                });
                chrome.action.setIcon({ path: "/icon/icon_manual.png" });
            }
            else if (items.autoCount == false || items.mode == undefined) {
                chrome.storage.local.set({ "autoCount": true });
                chrome.contextMenus.update("3", {
                    title: "Auto count: ON"
                });
                chrome.action.setIcon({ path: "/icon/icon_auto.png" });
            }
        });

    }
    // 4. Count task time
    if (id.menuItemId == 4) {
        chrome.storage.local.get(["countTime"], function (items) {
            if (items.countTime == true) {
                chrome.storage.local.set({ "countTime": false });
                chrome.contextMenus.update("4", {
                    title: ("Count submit: OFF")
                });
            }
            else {
                chrome.storage.local.set({ "countTime": true });
                chrome.contextMenus.update("4", {
                    title: ("Count time: ON")
                });
            }
        });

    }
    // 5. Auto submit
    if (id.menuItemId == 5) {
        chrome.storage.local.get(["autoSubmit"], function (items) {
            if (items.autoSubmit == true) {
                chrome.storage.local.set({ "autoSubmit": false });
                chrome.contextMenus.update("5", {
                    title: ("Auto submit: OFF")
                });
            }
            else {
                chrome.storage.local.set({ "autoSubmit": true });
                chrome.contextMenus.update("5", {
                    title: ("Auto submit: ON")
                });
            }
        });

    }
    // 6. Task available notification
    if (id.menuItemId == 6) {
        chrome.storage.local.get(["taskAvailableNoti"], function (items) {
            if (items.taskAvailableNoti == true) {
                chrome.storage.local.set({ "taskAvailableNoti": false });
                chrome.contextMenus.update("6", {
                    title: ("Task available notification: OFF")
                });
            }
            else {
                chrome.storage.local.set({ "taskAvailableNoti": true });
                chrome.contextMenus.update("6", {
                    title: ("Task available notification: ON")
                });
            }
        });

    }
    // 8. User guide
    if (id.menuItemId == 8) {
        chrome.tabs.create({ url: "USERGUIDE.html" });
    }
});

// Increase counter when click to extensions icon
chrome.action.onClicked.addListener((tab) => {
    chrome.storage.local.get(["totalClick"], function (items) {
        let totalClick = 0;
        if (items.totalClick != undefined) {
            totalClick = parseInt(items.totalClick);
        }
        totalClick++;
        chrome.action.setBadgeText({ text: totalClick.toString() });
        chrome.storage.local.set({ totalClick: totalClick.toString() });

    });

    updateLastClick();

});




// =========== Test
// function updateMode() {
//     chrome.storage.local.get(["autoCount"], function (items) {
//         if (items.autoCount == true) {
//             chrome.action.setIcon({ path: "/icon/icon_auto.png" });
//             chrome.contextMenus.update("1", {
//                 title: "Auto count: ON"
//             });
//         }
//         else {
//             chrome.contextMenus.update("1", {
//                 title: "Auto count: OFF"
//             });
//             chrome.action.setIcon({ path: "./icon/icon_manual.png" });
//         }
//     });
// }

// setInterval(updateMode, 2000);

// Test
// setTimeout(() => {
//     var startbtn = document.getElementsByClassName("start-button");
//     var nta = document.getElementsByClassName("no-tasks-message");

//     startbtn[0].style.backgroundColor = "blue"
//     nta[0].style.display = "none"


//      let soundurl = "chrome-extension://mpnmhdjdjmehhkopjdogbbjobeneeabf/res/sounds/doit.mp3"

//     for (const strttxt of document.getElementsByClassName("content")) {
//         if (strttxt.textContent.includes("Start Next Task")) {
//             strttxt.style.color = "white"
//         }
//     }

// audioElement = document.createElement('audio');
// audioElement.innerHTML = '<source src="' + soundurl + '" type="audio/mpeg" />'
// audioElement.play();

// }, 10000)