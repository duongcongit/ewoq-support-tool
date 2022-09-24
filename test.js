
console.log("OK");

window.onload = function () {


    setTimeout(() => {
        // let btnstart = document.getElementsByClassName("start-button")[0];
        // btnstart.style.backgroundColor = "blue";
        // btnstart.style.color = "white";
        // btnstart.disabled = false;
    }, 5000)



    var isNotiSoundPlaying = false;
    setInterval(() => {
        let btnstart = document.getElementsByClassName("start-button")[0];
        if (!btnstart.disabled) {
            if (!isNotiSoundPlaying) {
                chrome.runtime.sendMessage({ "getResFile": "taskAvailableNotiSound" }, (response) => {
                    let soundUrl = response;
                    audioElement = document.createElement('audio');
                    audioElement.innerHTML = '<source src="' + soundUrl + '" type="audio/mpeg" />'
                    audioElement.play();

                    chrome.runtime.sendMessage({ "taskAvailableLoopNoti": "true" }, (response) => {
                        let loopMode = response;
                        if (loopMode) {
                            audioElement.loop = true;
                        }
                        else{
                            audioElement.loop = false;
                        }
                    })

                    chrome.runtime.sendMessage({ "createAvalableTaskNoiti": "true" }, (response) => {

                    })

                    let btnCancel = document.getElementById("btnResetCounter");
                    btnCancel.addEventListener("click", () => {
                        audioElement.pause();
                    })

                })
                isNotiSoundPlaying = true;
            }

        }
    }, 2000)





}