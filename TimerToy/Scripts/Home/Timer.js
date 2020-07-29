
class Timer {


    constructor(timerData, html) {

        let table = document.createElement("table");
        table.className = "timer_table";
        table.innerHTML = html;

        let elapsedTime = timerData.ElapsedTime;

        //Assign Table Vars
        let row1 = table.children[0].children[1];
        let row3 = table.children[0].children[3];


        // timerName
        let row0 = table.children[0].children[0];
        let nameInput = row0.children[0].children[0];
        nameInput.value = timerData.TimerDescription;
        nameInput.oldValue = timerData.TimerDescription;
        nameInput.key = timerData.TimerKey;

        nameInput.addEventListener("keyup", function (event) {
            if (event.key === "Enter") {
                saveTimerName(this);
            }
        });

        nameInput.addEventListener("blur", function (event) {
            saveTimerName(this);
        });

        //timerSegments
        let row2 = table.children[0].children[2];
        let daysContainer = row2.children[0];
        let hoursContainer = row2.children[1];
        let minutesContainer = row2.children[2];
        let secondsContainer = row2.children[3];

        //on Botton
        let row4 = table.children[0].children[4];
        let onButton = row4.children[0];
        onButton.key = timerData.TimerKey;
        onButton.onclick = toggleTimer;


        //Public Properies
        this.container = table;
        this.key = timerData.TimerKey;


        var isRunning = timerData.IsRunning;
        this.isRunning = isRunning;

        this.refresh = function(timerData){
            nameInput.value = timerData.TimerDescription;
            nameInput.oldValue = timerData.TimerDescription;
            elapsedTime = timerData.ElapsedTime;
            isRunning = timerData.IsRunning;
        }


        this.addSecond = function () {
            elapsedTime++;
            //elapsedTime = (3 * 24 * 60 * 60) + (15 * 60 * 60) + (32 * 60) + 6;
            let timeSeg = parseSeconds(elapsedTime);
            daysContainer.innerHTML = timeSeg.days;
            hoursContainer.innerHTML = timeSeg.hours;
            minutesContainer.innerHTML = timeSeg.minutes;
            secondsContainer.innerHTML = timeSeg.seconds;

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

        function toggleTimer() {

            var request = new XMLHttpRequest();
            var url = '/Api/ToggleTimer';
            var parms = 'TimerKey=' + this.key;

            request.open('POST', url, true);
            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            request.onload = function () {
                let timer = JSON.parse(this.response);
                refresh(timer);
            }

            request.send(parms);

            this.blur();

        }

    }

}