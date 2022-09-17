
console.log("Included")

window.onload = function () {
    function click() {
        console.log("clicked")
        chrome.storage.local.get(["mode"], function (items) {
            if (items.mode == "auto") {
                chrome.runtime.sendMessage({ "count": "true" }, function (response) {
                    console.log(response)
                });
            }
        })
    }

    //
    function setClickListener() {
        let submitButton = document.getElementsByClassName("submitTaskButton")[0];
        if (submitButton != undefined) {
            submitButton.removeEventListener("click", click);
            submitButton.addEventListener("click", click);
        }
    }

    setInterval(setClickListener, 5000)


}


