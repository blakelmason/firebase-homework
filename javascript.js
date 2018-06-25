

//firebase setup
var config = {
    apiKey: "AIzaSyC-tAHhSgqMV47IPSYH9WUFBCZdqRmp8vo",
    authDomain: "fir-homework-f2706.firebaseapp.com",
    databaseURL: "https://fir-homework-f2706.firebaseio.com",
    projectId: "fir-homework-f2706",
    storageBucket: "",
    messagingSenderId: "679186971153"
};
firebase.initializeApp(config);
var database = firebase.database();

database.ref('LFo3LW2wOnbQyc7_ENh').on('value', (snapshot) => {
    console.log(snapshot.val())
})

//get trains from database and display on page
database.ref().on('value', (snapshot) => {
    var data = snapshot.val();
    var counter = 0

    //loop through each train in database
    for (var key in data) {
        
        counter++;
        var rowId = 'train' + counter;

        //create table row for the train
        $('tbody').append('<tr id="' + rowId + '"></tr>');

        //calculate the time from first train
        var firstTrain = moment(data[key]['firstTrain']);
        var timeDifference = moment().diff(firstTrain, 'minutes');

        //calculate how long until the next train arrives
        var frequency = data[key]['frequency'];
        var minutesAway = frequency - (timeDifference % frequency);

        //calculate next arrival time
        var nextArrival = moment().add(minutesAway, 'minutes').format('dddd, MMMM Do hh:mm A');
        var hoursUntilArrival = Math.floor(minutesAway / 60);
        var minutesUntilArrival = minutesAway % 60;
        var timeUntilArrival = hoursUntilArrival + 'h ' + minutesUntilArrival + 'm';

        //add the data to the row
        $('#' + rowId).append('<td>' + data[key].name + '</td>')
        $('#' + rowId).append('<td>' + data[key]['destination'] + '</td>')
        $('#' + rowId).append('<td>' + frequency + '</td>')
        $('#' + rowId).append('<td>' + nextArrival + '</td>')
        $('#' + rowId).append('<td>' + timeUntilArrival + '</td>')
    }
})

//hour and minute choices
for (var i = 1; i <= 24; i++) {
    var hour = i.toString();
    if (hour.length < 2) hour = '0' + hour;
    $('#hourChoice').append('<option>' + hour + '</option>')
}
for (var i = 0; i <= 55; i += 5) {
    var minute = i.toString();
    console.log(minute.length)
    if (minute.length < 2) minute = '0' + minute;
    $('#minuteChoice').append('<option>' + minute + '</option>')
}

//add new train info to database
$(document.body).on('click', '.btn', function () {
    //remove message if present
    $('#message').remove();

    //get user input
    var hourChoice = $('#hourChoice option:selected').text();
    var minuteChoice = $('#minuteChoice option:selected').text();
    var frequency = $('#trainFrequency').val();
    var name = $('#trainName').val();
    var destination = $('#trainDestination').val();
    console.log(hourChoice + ' ' + minuteChoice + ' ' + frequency + ' ' + name + ' ' + destination)

    //check if all fields are full
    if (name && destination && hourChoice && minuteChoice && frequency) {

        //check if frequency is a number and above 0
        frequency = Number(frequency);
        if (typeof frequency != NaN && frequency > 0) {

            //parse the first train time
            var today = moment().format('YYY-MM-DD');
            var firstTrain = today + ' ' + hourChoice + ':' + minuteChoice; 

            //add data to database
            $('.btn').after('<span id="message" class="px-3 text-success">Train added to schedule</span>');
            database.ref().push({
                name: name,
                destination: destination,
                frequency: frequency,
                firstTrain: firstTrain
            })

        //frequency is not a number or above 0
        } else {
            $('.btn').after('<span id="message" class="px-3 text-danger">Frequency must be a number above 0</span>')
        }

    //missing inputs
    } else {
        $('.btn').after('<span id="message" class="px-3 text-danger">Please add missing information</span>')
    }
});






















/*
//get values in database
database.ref().on("value", function (snapshot) {
    var data = snapshot.val();
    console.log(data);
    var counter = 0

    //loop through each train in database
    for (var key in data) {
        counter++;
        var rowId = 'train' + counter;

        //create table row for the train
        $('tbody').append('<tr id="' + rowId + '"></tr>');

        //calculate the time from first train
        var firstTrain = moment(data[key]['firstTrain']);
        var timeDifference = moment().diff(firstTrain, 'minutes');

        //calculate how long until the next train arrives
        var frequency = data[key]['frequency'];
        var minutesAway = frequency - (timeDifference % frequency);

        //calculate next arrival time
        var nextArrival = moment().add(minutesAway, 'minutes').format('hh:mm');
        var hoursUntilArrival = Math.floor(minutesAway / 60);
        var minutesUntilArrival = minutesAway % 60;
        var timeUntilArrival = hoursUntilArrival + 'h ' + minutesUntilArrival + 'm';

        //add the data to the row
        $('#' + rowId).append('<td>' + key + '</td>')
        $('#' + rowId).append('<td>' + data[key]['destination'] + '</td>')
        $('#' + rowId).append('<td>' + frequency + '</td>')
        $('#' + rowId).append('<td>' + nextArrival + '</td>')
        $('#' + rowId).append('<td>' + timeUntilArrival + '</td>')
    }
});

//hour and minute choices
for (var i = 1; i <= 24; i++) {
    $('#hourChoice').append('<option>' + i + '</option>')
}
for (var i = 0; i <= 55; i += 5) {
    $('#minuteChoice').append('<option>' + i + '</option>')
}

$(document.body).on('click', '.btn', function () {
    $('#message').remove();
    var hourChoice = $('#hourChoice option:selected').text();
    var minuteChoice = $('#minuteChoice option:selected').text();
    var frequency = $('#trainFrequency').val();
    var name = $('#trainName').val();
    var destination = $('#trainDestination').val();
    console.log(hourChoice + ' ' + minuteChoice + ' ' + frequency + ' ' + name + ' ' + destination)
    if (name && destination && hourChoice && minuteChoice && frequency) {
        frequency = Number(frequency);
        if (typeof frequency != NaN && frequency > 0) {
            $('.btn').after('<span id="message" class="px-3 text-success">Train added to schedule</span>');
            var objectName = name;
            this[objectName] = {
                destination: destination,
                firstTrain: hourChoice,
                frequency: frequency
            }
                console.log(John)
        } else {
            $('.btn').after('<span id="message" class="px-3 text-danger">Frequency must be a number above 0</span>')
        }
    } else {
        $('.btn').after('<span id="message" class="px-3 text-danger">Please add missing information</span>')
    }
});
*/

