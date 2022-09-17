$(document).ready(function () {

    // Switch mode
    $(document).on("click", "#autoModeSwitch", function () {
        if ($("#autoModeSwitch").is(":checked")) {
            chrome.runtime.sendMessage({ "switchAutoMode": "turn on" }, function (response) {
                console.log(response)
            });
        }
        else {
            chrome.runtime.sendMessage({ "switchAutoMode": "turn off" }, function (response) {
                console.log(response)
            });
        }
    })

    // Check mode
    chrome.storage.local.get(["mode"], function (items) {
        if (items.mode == "auto") {
            document.getElementById("autoModeSwitch").checked = true;
        }
        else {
            document.getElementById("autoModeSwitch").checked = false;
        }
    })

    // Set new total click
    $(document).on("click", "#btnSetTotalClick", function () {
        var newTotalClick = parseInt($("#inputSetTotalClick").val());
        if (newTotalClick >= 0) {
            chrome.runtime.sendMessage({ "setTotalClick": newTotalClick.toString() }, function (response) {
                console.log(response)
            });
        }
    })

    // Reset counter
    $(document).on("click", "#btnResetCounter", function () {
        chrome.runtime.sendMessage({ "resetCounter": "true" }, function (response) {
            console.log(response)
        });
    })

    // Get history click
    chrome.storage.local.get(["historyClick"], function (items) {
        if (items.historyClick != undefined) {
            console.log("co")
            let table = document.getElementById("tableBodyHistory");
            let tableData = "";
            let historyClick = items.historyClick;
            for (let i = historyClick.length - 1; i >= 0; i--) {
                tableData += '<tr> <th>' + (i + 1) + '</th> <td>' + historyClick[i] + '</td> </tr>';
            }
            table.innerHTML = tableData;
        }
    })


})



