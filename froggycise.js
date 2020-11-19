
var app = angular.module('froggyApp', ['ui.bootstrap', 'ngRoute']);

app.config(function($locationProvider, $routeProvider, $logProvider) {
    
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    
    $logProvider.debugEnabled(false);
    
    $routeProvider
        .when('/froggycise',
            {
                controller: 'MainController',
                templateUrl: 'homeView.htm'
            })
        .when('/froggycise/index.htm',
            {
                controller: 'MainController',
                templateUrl: 'homeView.htm'
            })
        .when('/froggycise/play',
            {
                controller: 'MainController',
                templateUrl: 'playView.htm',
                reloadOnSearch: false
            })
        .otherwise({ redirectTo: '/froggycise' });
        
});

app.factory('AnimalFactory', function($log) {
    $log.debug("AnimalFactory start");
    var factory = {};
    factory.animals = [
    {"name":"Froggy", "image": "Bagou_Froggy_cartoon_04.svg", "primary":"Hop"},
    {"name":"Donkey", "image": "Donkey_cartoon_04.svg", "primary":"Stomp"},
    {"name":"Bull", "image": "Bull_cartoon_04.svg", "primary":"Squat"},
    {"name":"Goat", "image": "Goat_cartoon_04.svg", "primary":"Tip-toes"},
    {"name":"Sheep", "image": "Sheep_cartoon_04.svg", "primary":"Touch toes"},
    {"name":"Rooster", "image": "Rooster_cartoon_04.svg", "primary":"Stretch"},
    {"name":"Goose", "image": "Goose_cartoon_04.svg", "primary":"Jumping-jack"},
    {"name":"Pig", "image": "Pig_cartoon_04.svg", "primary":"Squat"},
    {"name":"Chicks", "image": "Hen_and_chicks_cartoon_04.svg", "primary":"Spin"},
    {"name":"Cow", "image": "Cow_cartoon_04.svg", "primary":"Kick"},
    {"name":"Chicken", "image": "Chicken_cartoon_04.svg", "primary":"Flap"}
    ];
    factory.actions = [
        "Hop",
        "Spin",
        "Run",
        "Kick",
        "Stretch",
        "Flap",
        "Stomp",
        "Squat",
        "Tip-toes",
        "Touch toes",
        "Jumping-jack"
    ];
    /* parameter:
        animal (required) -- string -- name of animal
    returns:
        string -- file name of svg image file for that animal */
    factory.getImageFor = function(animal) {
        $log.debug("AnimalFactory getImageFor() start with animal == " + animal);
        var animalImage;
        for (var i=0; i<factory.animals.length; i++) {
            if (factory.animals[i].name == animal) {
                animalImage = factory.animals[i].image;
            }
        }
        $log.debug("AnimalFactory getImageFor() is returning: " + animalImage);
        return animalImage;
    }
    /* parameter:
        animalName (required) -- string of name of animal (e.g. "Froggy", "Cow")
    returns:
        object -- animal object that has requested name property (along with image src path, primary action, etc.) */
    factory.getAnimalObjectByName = function (animalName) {
        var animalMatch;
        for (var i = 0, animalsLen = factory.animals.length; i<animalsLen; i++) {
            if (factory.animals[i].name == animalName) {
                animalMatch = factory.animals[i];
            }
        }
        return animalMatch;
    }
    /* parameter:
        animalsLikelyArray (optional) 
            -- array of strings -- names of animals that will be more likely to come up (at least 50% of the time)
        OR  -- object with properties that are the names of animals...
     returns:
        object -- reference to 1 animal object (which includes name, image src, etc) */
    factory.getRandomAnimal = function (animalsLikelyArray) {
        $log.debug("AnimalFactory getRandomAnimal() start");
        //$log.debug(animalsLikelyArray);
        var animalStr,
            animalObj,
            tempArray = [];
            
        /* if parameter isn't an array, then make it one */
        if ( animalsLikelyArray && !angular.isArray(animalsLikelyArray) ) {
            angular.forEach(animalsLikelyArray, function(value, key) {
                tempArray.push(key);
            });
            animalsLikelyArray = tempArray;
        }
        
        if ( animalsLikelyArray && (Math.random() > .5) ) {
            animalStr = animalsLikelyArray[Math.floor(Math.random() * animalsLikelyArray.length)];
            animalObj = factory.getAnimalObjectByName(animalStr);
        } else {
            animalObj = factory.animals[Math.floor(Math.random() * factory.animals.length)];
        }
        return animalObj;
    }
    /* paraemters:
        none
    returns:
        string -- 1 action randomly chosen from all in AnimalFactory */
    factory.getRandomAction = function () {
        $log.debug("AnimalFactory getRandomAction() start");
        return factory.actions[Math.floor(Math.random() * factory.actions.length)];
    }
    /* parameters:
        include (optional? should be, but haven't tested that way) -- one action that should be included 1st in return array
        howMany (required, though could make optional with default like 3) -- number of actions to return in array
    returns:
        array -- of actions (strings), with 'include' one on top */
    factory.getActions = function (include, howMany) {
        $log.debug("AnimalFactory getActions() start");
        var actArray = [include];
        var tempAct;
        while (actArray.length < howMany) {
            tempAct = factory.getRandomAction();
            if (actArray.toString().indexOf(tempAct) == -1) {
                actArray.push(tempAct);
            }
        }
        $log.debug("AnimalFactory getActions() end");
        return actArray;
    }
    return factory;
})
