
console.log("Included")

window.onload = function () {
    function click() {
        console.log("clicked")
        chrome.runtime.sendMessage({ "count": "true" }, function (response) {
            console.log(response)
        });

    }

    // tf
    function setClickListener() {
        let submitButton = document.getElementsByClassName("submitTaskButton")[0];
        if (submitButton != undefined) {
            submitButton.removeEventListener("click", click);
            submitButton.addEventListener("click", click);
        }
    }

    setInterval(setClickListener, 10000)


}


