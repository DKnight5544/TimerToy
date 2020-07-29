

let _PageNameInput;
let _timerObjectTemplate;
let _mainContainer;
let _timerObjArray = [];

function body_onload() {
    _timerObjectTemplate = document.getElementById("TimerTemplate").innerHTML;
    _mainContainer = document.getElementById("MainContainer");
    pageName_setup();
    getPageData();

    setInterval(pulse, 1000);

    //RefreshTimer = setInterval(getDesktopData, 500);

}

function pulse() {
    let activeTimers = _timerObjArray.filter(t => t.isRunning);
    activeTimers.forEach(function (timerObj) {
        timerObj.elapsedTime++;
        displayTime(timerObj);
    })
}

function pageName_setup() {

    _PageNameInput = document.getElementById('PageNameInput');
    _PageNameInput.value = _PageName;
    _PageNameInput.oldValue = _PageName;
    _PageNameInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            pageName_save(this);
        }
    });

    _PageNameInput.addEventListener("blur", function (event) {
        pageName_save(this);
    });

}

function pageName_save(sender) {

    if (sender.oldValue != sender.value && sender.value != "") {

        var request = new XMLHttpRequest();
        var url = '/Api/UpdatePageName';
        var parms = 'PageKey=' + _PageKey;
        parms += '&PageName=' + sender.value.trim();
        request.open('POST', url, true);

        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        request.onload = function () {
            let resp = this.response;
            if (resp == "OK") {
                _PageName = sender.value.trim();
                sender.value = _PageName;
                sender.oldValue = _PageName;
            }
        }
        request.send(parms);

    }
    else {
        sender.value = sender.oldValue;
    }

    sender.blur();
}

function getPageData() {

    let parms = "";
    let request = new XMLHttpRequest();
    let url = '/Api/SelectAll';

    parms += 'PageKey=' + _PageKey;

    request.open('POST', url, true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    request.onload = function () {

        let pageData = JSON.parse(this.response);

        for (let idx = 0; idx < pageData.length; idx++) {

            let timerObj;
            let timerData = pageData[idx];

            //if timer is new add it to the timerObjArray.
            timerObj = _timerObjArray.find(t => t.key == timerData.TimerKey);
            if (!timerObj) {
                timerObj = getTimerObj(timerData.TimerKey)
                _timerObjArray.push(timerObj);
                _mainContainer.appendChild(timerObj);
            }

            refreshTimerObj(timerData);
        }

    }

    request.send(parms);
}

function refreshTimerObj(timerData) {

    let timerObj = _timerObjArray.find(t => t.key == timerData.TimerKey);

    timerObj.nameInput.value = timerData.TimerDescription;
    timerObj.oldName = timerData.TimerDescription;

    let seconds = timerData.ElapsedTime;

    timerObj.isRunning = timerData.IsRunning;
    timerObj.elapsedTime = timerData.ElapsedTime;

    displayTime(timerObj);

    timerObj.onButton.style.color = timerData.IsRunning ? "black" : "white";
    timerObj.onButton.style.backgroundColor = timerData.IsRunning ? "silver" : "#404040";
    timerObj.offButton.style.color = !timerData.IsRunning ? "black" : "white";
    timerObj.offButton.style.backgroundColor = !timerData.IsRunning ? "silver" : "#404040";
}

function displayTime(timerObj) {
    let timeSeg = parseSeconds(timerObj.elapsedTime);
    timerObj.daysContainer.innerHTML = timeSeg.days;
    timerObj.hoursContainer.innerHTML = timeSeg.hours;
    timerObj.minutesContainer.innerHTML = timeSeg.minutes;
    timerObj.secondsContainer.innerHTML = timeSeg.seconds;
}

function getTimerObj(key) {

    let div = document.createElement("div");

    div.innerHTML = _timerObjectTemplate;
    table.key = key;


    // timerName
    let row0 = table.children[0].children[0];
    table.nameInput = row0.children[0].children[0];
    table.nameInput.addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            saveTimerName(key);
        }
    });
    table.nameInput.addEventListener("blur", function (event) {
        saveTimerName(key);
    });


    //timerSegments
    let row2 = table.children[0].children[2];
    table.daysContainer = row2.children[0];
    table.hoursContainer = row2.children[1];
    table.minutesContainer = row2.children[2];
    table.secondsContainer = row2.children[3];


    //Row 3 -- Adjust timers
    const S = 1;
    const M = S * 60;
    const H = M * 60;
    const D = H * 24;
    let row3 = table.children[0].children[3];
    row3.children[0].onclick = function () { adjustTimer(key, -D) };
    row3.children[1].onclick = function () { adjustTimer(key, D) };
    row3.children[2].onclick = function () { adjustTimer(key, -H) };
    row3.children[3].onclick = function () { adjustTimer(key, H) };
    row3.children[4].onclick = function () { adjustTimer(key, -M) };
    row3.children[5].onclick = function () { adjustTimer(key, M) };
    row3.children[6].onclick = function () { adjustTimer(key, -S) };
    row3.children[7].onclick = function () { adjustTimer(key, S) };


    //on button
    let row4 = table.children[0].children[4];
    table.onButton = row4.children[0];
    table.onButton.onclick = function () {
        toggleTimer(key);
    };

    //off button
    table.offButton = row4.children[1];
    table.offButton.onclick = function () {
        toggleTimer(key);
    };

    //reset button    
    table.resetButton = row4.children[3];
    table.resetButton.onclick = function () {
        resetTimer(key);
    };

    //delete button    
    table.deleteButton = row4.children[4];
    table.deleteButton.onclick = function () {
        deleteTimer(key);
    };

    return table;

}

function saveTimerName(key) {

    let timerObj = _timerObjArray.find(t => t.key == key);

    let oldName = timerObj.oldName;
    let newName = timerObj.nameInput.value.trim();

    if (newName != oldName && newName != "") {

        var request = new XMLHttpRequest();
        var url = '/Api/UpdateTimerName';
        var parms = 'TimerKey=' + key;
        parms += '&TimerName=' + newName;
        request.open('POST', url, true);

        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

        request.onload = function () {
            let timerData = JSON.parse(this.response);
            refreshTimerObj(timerData);
            timerObj.nameInput.blur();
        }
    }
    else {
        timerObj.nameInput.value = oldName;
    }


    request.send(parms);

}

function parseSeconds(seconds) {

    const S = 1;
    const M = S * 60;
    const H = M * 60;
    const D = H * 24;

    let days = Math.trunc(seconds / D);
    seconds -= D * days;

    let hours = Math.trunc(seconds / H);
    seconds -= H * hours;

    let minutes = Math.trunc(seconds / M);
    seconds -= M * minutes;

    let timeSeg = new Object();

    timeSeg.days = days.toString();
    timeSeg.hours = ("000" + hours.toString()).slice(-2);
    timeSeg.minutes = ("000" + minutes.toString()).slice(-2);
    timeSeg.seconds = ("000" + seconds.toString()).slice(-2);

    return timeSeg;

}

function toggleTimer(key) {

    var request = new XMLHttpRequest();
    var url = '/Api/ToggleTimer';
    var parms = 'TimerKey=' + key;

    request.open('POST', url, true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    request.onload = function () {
        let timerData = JSON.parse(this.response);
        refreshTimerObj(timerData);
    }

    request.send(parms);

    this.blur();

}

function addTimer() {

    var request = new XMLHttpRequest();
    var url = '/Api/AddTimer';
    var parms = 'PageKey=' + _PageKey;
    request.open('POST', url, true);

    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    request.onload = function () {

        let timerData = JSON.parse(this.response);
        let timerObj = _timerObjArray.find(t => t.key == timerData.TimerKey)

        //if timer is new add it to the timerObjArray.;
        if (!timerObj) {
            timerObj = getTimerObj(timerData.TimerKey)
            _timerObjArray.push(timerObj);
            _mainContainer.appendChild(timerObj);
        }

        refreshTimerObj(timerData);
    }

    request.send(parms);

}

function resetTimer(key) {

    var request = new XMLHttpRequest();
    var url = '/Api/ResetTimer';
    var parms = 'TimerKey=' + key;

    request.open('POST', url, true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    request.onload = function () {
        let timerData = JSON.parse(this.response);
        refreshTimerObj(timerData);
    }

    request.send(parms);

    this.blur();

}

function adjustTimer(key , seconds) {

    var request = new XMLHttpRequest();
    var url = '/Api/AdjustTimer';
    var parms = 'TimerKey=' + key;
    parms += '&Seconds=' + seconds;

    request.open('POST', url, true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    request.onload = function () {
        let timerData = JSON.parse(this.response);
        refreshTimerObj(timerData);
    }

    request.send(parms);

    this.blur();

}

function deleteTimer(key) {

    var request = new XMLHttpRequest();
    var url = '/Api/DeleteTimer';
    var parms = 'TimerKey=' + key;
    request.open('POST', url, true);

    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    request.onload = function () {

        let msg = this.response;

        if (msg === "OK") {
            let timerObj = _timerObjArray.find(t => t.key === key);
            _mainContainer.removeChild(timerObj);
            _timerObjArray = _timerObjArray.filter(t => t.key != key);
        }
    }

    request.send(parms);

}

