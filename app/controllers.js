
app.controller("IndexController", function($scope, $location, $log) {
    $log.debug("IndexController start");
    
    $scope.onHomeScreen = function() {
        $log.debug("onHomeScreen() start with $location.path() == " + $location.path() );
        var path = $location.path();
        return (path == "/" || path == "/index.htm");
    }

});


app.controller("HomeController", function($scope, $location, $log, AnimalFactory) {
    $scope.animals = AnimalFactory.animals;
    $scope.currentAnimal = $scope.animals[0]; //"Froggy"
    $log.debug("HomeController start");
    
    $scope.start = function() {
        $location.hash("0");
    }

});


app.controller("MainController", function($scope, $location, $timeout, $log, AnimalFactory) {
    $scope.settings = {};
    $scope.settings.numActions = 3;
    $scope.actSelected = "";
    $log.debug("MainController() start");
    $scope.addGrassCss = false;
    $timeout( function() {
        $scope.addGrassCss = true;
    }, 100)
    
    var turn, autoplayTimeout;

    var availActions = AnimalFactory.actions;
    
    var animals = AnimalFactory.animals;
    
    $scope.animals = animals;
    $scope.radioModelSpeed = '3000';
    
    initGame();
    
    
    $scope.next = function(eventObj) {
        //$log.debug("next() argument is: ");
        //$log.debug(eventObj);
        $log.debug("next() start");
        if (eventObj) {
            $log.debug("next() eventObj.target.value == " + eventObj.target.value);
            $scope.actSelected = eventObj.target.value;
            $scope.inTransition = "fromNew";
        } else {
            $scope.inTransition = "fromRepeat";
        }
        recordPreviousTurn();
        turn++;
        $timeout(startNextTurn, 500); 
    }
    
    $scope.reset = function() {
        $log.debug("reset() start");
        initGame();
        $location.hash("0");
    }
    
    $scope.check = function() {
        $log.debug("check() start");
        $scope.checkingAnswer = true;
        $scope.pause();
    }
    
    $scope.play = function() {
        $log.debug("play() start");
        $scope.autoplay = true;
        autoPlayLoop();
    }
    
    $scope.pause = function() {
        $log.debug("pause() start");
        if (autoplayTimeout) {
            $timeout.cancel(autoplayTimeout);
        }
        $scope.autoplay = false;
    }
    
    $scope.numActionsChanged = function() {
        $log.debug("numActionsChanged() start");
        $scope.actions = AnimalFactory.getActions($scope.currentAnimal.primary, $scope.settings.numActions);
    }
    
    function autoPlayLoop() {
        $log.debug("autoPlayLoop() start");
        $scope.next();
        if ($scope.autoplay == true) {
            autoplayTimeout = $timeout(autoPlayLoop, $scope.radioModelSpeed);
        }
    }
    
    function startNextTurn() {
        $log.debug("startNextTurn() start");

        //get ready for the next turn! //debug +1
        $scope.currentAnimal = AnimalFactory.getRandomAnimal( $scope.answers );
        if ( isNewAnimal($scope.currentAnimal.name) ) {
            $scope.pause();
            $scope.actions = AnimalFactory.getActions($scope.currentAnimal.primary, $scope.settings.numActions);
        }
        
        //reset state
        $scope.checkingAnswer = false;
        $location.hash(turn);
        
        $timeout(function() {
            $log.debug("startNextTurn() setting $scope.actSelected to ''");
            $scope.actSelected = "";
            $scope.inTransition = false;
            setFocus();
        }, 100); //adding just a little delay to give image time to switch
    }
    
    function recordPreviousTurn() {
        $log.debug("recordPreviousTurn() start with $scope.actSelected == " + $scope.actSelected);
        var currentAnimal = $scope.currentAnimal.name
        var currentAnimalImage = AnimalFactory.getImageFor(currentAnimal);
        if ( isNewAnimal(currentAnimal) ) {
            $scope.answers[currentAnimal] = $scope.actSelected;
        }
        $scope.turns.push({
            "animal": currentAnimal,
            "action": $scope.actSelected,
            "image": currentAnimalImage
        });
        $log.debug("recordPreviousTurn() end");
    }
    
    function isNewAnimal(animalName) {
        return !$scope.answers[animalName];
    }
    
    function setFocus() {
        //because getting autofocus attribute to re-apply is even hacky-er
        $log.debug("setFocus() start");
        if ($scope.answers[$scope.currentAnimal.name]) {
            document.getElementById("nextButton").focus();
            $log.debug("setFocus() put #nextButton in focus");
        } else {
            //$log.debug("document.getElementById('action0').innerText == " + document.getElementById("action0").innerText );
            document.getElementById("action0").focus();
            $log.debug("setFocus() put #action0 in focus");
        }
    }
    
    function initGame() {
        turn = 0;
        $scope.currentAnimal = animals[0]; //"Froggy"
        $scope.actions = ["Hop", "Spin", "Flap"];    
        $scope.turns = [];
        $scope.answers = {};
        $scope.actSelected = "";
        $scope.recapToggle = false; /* close recap pane if it's open */
    }
    
});