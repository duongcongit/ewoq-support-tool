
// console.log("OK");

window.onload = function () {

    setTimeout(() => {
        // let btnstart = document.getElementsByClassName("start-button")[0];
        // btnstart.style.backgroundColor = "blue";
        // btnstart.style.color = "white";
        // btnstart.disabled = false;
    }, 5000)



    // var isNotiSoundPlaying = false;
    // setInterval(() => {
    //     let btnstart = document.getElementsByClassName("start-button")[0];
    //     if (!btnstart.disabled) {
    //         if (!isNotiSoundPlaying) {
    //             chrome.runtime.sendMessage({ "getResFile": "taskAvailableNotiSound" }, (response) => {
    //                 let soundUrl = response;
    //                 audioElement = document.createElement('audio');
    //                 audioElement.innerHTML = '<source src="' + soundUrl + '" type="audio/mpeg" />'
    //                 audioElement.play();

    //                 chrome.runtime.sendMessage({ "taskAvailableLoopNoti": "true" }, (response) => {
    //                     let loopMode = response;
    //                     if (loopMode) {
    //                         audioElement.loop = true;
    //                     }
    //                     else{
    //                         audioElement.loop = false;
    //                     }
    //                 })

    //                 chrome.runtime.sendMessage({ "createAvalableTaskNoiti": "true" }, (response) => {

    //                 })

    //                 let btnCancel = document.getElementById("btnResetCounter");
    //                 btnCancel.addEventListener("click", () => {
    //                     audioElement.pause();
    //                 })

    //             })
    //             isNotiSoundPlaying = true;
    //         }

    //     }
    // }, 2000)





    let i = 1;
    const a = setInterval(() => {
        console.log(i);
        if (i == 5) {
            // chrome.runtime.sendMessage({ "autoCount": "true" }, (response) => {
            //     console.log(response);
            // })
            clearInterval(a);
        }
        i++;
    }, 1000)


    // let btnSubmit = document.getElementsByClassName("submitTaskButton")[0];
    // btnSubmit.addEventListener("click", () => {
    //     chrome.runtime.sendMessage({ "autoCount": "true" }, (response) => {
    //         console.log(response);
    //     })
    // })


    // setTimeout(() => {
    //     let btnSubmit = document.getElementsByClassName("submitTaskButton")[0];
    //     btnSubmit.click();
    //     chrome.runtime.sendMessage({ "autoSubmitCount": "true" }, (response) => {
    //         console.log(response);
    //     })
    // }, 5000)




}