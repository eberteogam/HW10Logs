$(function() {
    // Runs once all DOM elements are loaded and ready to use.

    // Display initial pet stats on page load
    checkAndUpdatePetInfoInHtml();

    // Bind each button to its click handler
    $('.treat-button').click(clickedTreatButton);
    $('.play-button').click(clickedPlayButton);
    $('.exercise-button').click(clickedExerciseButton);
    $('.sleep-button').click(clickedSleepButton);

    // --- Console demo buttons ---
    // Part1. Message Logging options
    $('.log-button').click(clickedLog);
    $('.log-warning-button').click(clickedLogWarning);
    $('.log-error-button').click(clickedLogError);
    $('.log-table-button').click(clickedLogTable);
    $('.log-group-button').click(clickedLogGroup);
    $('.log-custom-button').click(clickedLogCustom);

    // Part2. Messages logged by the browser itself.
    $('.cause-404-button').click(clickedCause404);
    $('.cause-typeerror-button').click(clickedCauseTypeError);
    $('.cause-violation-button').click(clickedCauseViolation);

    // --- jQuery unique method #1: .mouseenter() ---
    // .mouseenter(handler) fires when the mouse pointer enters the element.
    // Unlike .mouseover(), it does NOT re-fire when crossing child elements,
    // making it the cleaner choice for hover interactions on a single element.
    // Here it shows a random pet reaction whenever the user hovers over Rex.
    $('#pet-image').mouseenter(function() {
        var reactions = ["*wag wag wag*", "Pet me!", "Rub my belly!", "*happy panting*"];
        var random = reactions[Math.floor(Math.random() * reactions.length)];
        showNotification(random);
    });

    // --- jQuery unique method #2: .val() ---
    // .val() gets or sets the value of a form input element.
    // Called with no arguments: reads what the user typed in the input field.
    // Called with a string argument: sets the input's value (used here to clear it).
    // Here it reads the rename field and updates pet_info.name when OK is clicked.
    $('#rename-button').click(function() {
        var newName = $('#rename-input').val().trim();
        if (newName !== '') {
            pet_info.name = newName;
            checkAndUpdatePetInfoInHtml();
            $('#rename-input').val(''); // clear the field after renaming
        }
    });
});

// pet_info object: stores the pet's current name and stats
var pet_info = {
    name: "Rex",
    weight: 10,
    happiness: 5,
    energy: 8
};

// Arrays of pet comments for each action (picked randomly to vary the response)
var petComments = {
    treat:    ["Woof! That was delicious!", "Yum! More please!", "My favorite snack!"],
    play:     ["That was so fun!", "Let's go again!", "Woof woof!"],
    exercise: ["I'm so tired...", "That was tough!", "Are we done yet?"],
    sleep:    ["Zzz... so comfy.", "Wake me up later...", "Sweet dreams!"]
};

// Returns a random comment string for the given action key
function getRandomComment(action) {
    var comments = petComments[action];
    return comments[Math.floor(Math.random() * comments.length)];
}

// --- Button handlers ---

// Treat: Rex gets a snack — gains happiness and weight
function clickedTreatButton() {
    pet_info.happiness += 3;
    pet_info.weight    += 2;
    showNotification(getRandomComment('treat'));
    checkAndUpdatePetInfoInHtml();
}

// Log Warning
function clickedLog(){
    console.log("This is a regular log. log()");
}

function clickedLogWarning() {
    console.warn('This is a warning log. warn()');
}

// Log Error: console.error() formats the message with a red error icon and
// a stack trace, just like an uncaught exception.
function clickedLogError() {
    console.error("This is an error log. error()");
}

// Log Table: console.table() renders an array of objects as a sortable table.
// Notice that "birthday" is only populated for one row, mirroring the tutorial.
function clickedLogTable() {
    var artists = [
        { first: 'Teo', last: 'Gamarra'},
        { first: 'Oscar',   last: 'Marin' },
    ];
    console.log("this is a table log. table():");
    console.table(artists);
}

function clickedLogGroup() {
    var years = ['2023', '2024', '2025', '2026'];
    console.group('The following is a console group. group()');
    years.forEach(function(year) {
        console.log(year);
    });
    console.groupEnd();
}

function clickedLogCustom() {
    console.log(
        '%cThis is my Tamagochi.',
        'border: 2px solid red; background: blue; color: white; padding: 4px 8px; font-size: 14px;'
    );
}

// --- Browser-logged message demos ---

// Cause 404: fetching a file that doesn't exist makes the browser log a
// "Failed to load resource" 404 network error.
function clickedCause404() {
    fetch('this-file-does-not-exist.jpg');
}

// Cause TypeError: trying to set a property on a DOM node that wasn't found
// (querySelector returns null) makes the browser throw an uncaught TypeError.
function clickedCauseTypeError() {
    var node = document.querySelector('.element-that-does-not-exist');
    node.textContent = 'This will throw a TypeError.';
}

// Cause Violation: a click handler that blocks the main thread for ~3 seconds
// triggers the browser's "[Violation] 'click' handler took Nms" warning.
// (Enable the Verbose log level in DevTools to see it.)
function clickedCauseViolation() {
    var start = Date.now();
    while (Date.now() - start < 3000) {
        // Busy-wait to intentionally block the main thread.
    }
}

// Play: Rex has fun — gains happiness but burns off weight
function clickedPlayButton() {
    pet_info.happiness += 2;
    pet_info.weight    -= 1;
    showNotification(getRandomComment('play'));
    // Add CSS class to trigger the bounce-updown animation
    var $img = $('#pet-image');
    $img.addClass('playing');
    // Remove class after animation finishes (0.6s) so it can retrigger on next click
    setTimeout(function() {
        $img.removeClass('playing');
    }, 600);
    checkAndUpdatePetInfoInHtml();
}

// Exercise: Rex works hard — loses happiness and weight
function clickedExerciseButton() {
    pet_info.happiness -= 1;
    pet_info.weight    -= 2;
    showNotification(getRandomComment('exercise'));
    checkAndUpdatePetInfoInHtml();
}

// Sleep (new button): Rex rests — gains energy and some happiness, gains a little weight
function clickedSleepButton() {
    pet_info.energy    += 5;
    pet_info.happiness += 2;
    pet_info.weight    += 1;
    showNotification(getRandomComment('sleep'));
    checkAndUpdatePetInfoInHtml();
}

// --- Core update helpers ---

function checkAndUpdatePetInfoInHtml() {
    checkWeightAndHappinessBeforeUpdating();
    updatePetInfoInHtml();
}

// Bug fix: prevent weight, happiness, and energy from dropping below zero
function checkWeightAndHappinessBeforeUpdating() {
    if (pet_info.weight    < 0) { pet_info.weight    = 0; }
    if (pet_info.happiness < 0) { pet_info.happiness = 0; }
    if (pet_info.energy    < 0) { pet_info.energy    = 0; }
}

// Writes current pet_info values into the HTML spans and updates the pet image
function updatePetInfoInHtml() {
    $('.name').text(pet_info.name);
    $('.weight').text(pet_info.weight);
    $('.happiness').text(pet_info.happiness);
    $('.energy').text(pet_info.energy);
    updatePetImage();
}

// Swaps the pet image based on happiness level
function updatePetImage() {
    var $img = $('#pet-image');
    if (pet_info.happiness === 0) {
        // Show sad dog when happiness hits zero
        $img.attr('src', 'images/sad-dog.jpg');
    } else {
        // Show normal dog when happiness is above zero
        $img.attr('src', 'images/dog.png');
    }
}

// --- jQuery unique method #3: .fadeIn() and .fadeOut() ---
//
// showNotification displays a pet comment inside the #notification div.
//
// .fadeIn(duration, callback)
//   Animates the element's opacity from 0 → 1 over the given duration (ms),
//   making it smoothly visible. The optional callback fires when the fade ends.
//
// .fadeOut(duration)
//   Animates the element's opacity from 1 → 0 over the given duration,
//   then sets display:none so it takes up no space.
//
// Together these create a visible-then-disappearing notification without
// using console.log() or alert(). Neither method appears in the starter code.
function showNotification(message) {
    var $notif = $('#notification');

    // Set the message text, then fade the box in over 400 ms
    $notif.text(message).fadeIn(400, function() {
        // Once fully visible, wait 1.5 seconds then fade back out over 600 ms
        setTimeout(function() {
            $notif.fadeOut(600);
        }, 1500);
    });
}

