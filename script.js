
//=========================================//UI controller===========================================================

var UIController = (function() {

    var DOMstring = {
        rollDiceBtn: '.btn--roll',
        diceImg: '.dice',
        current__0: '#current--0',
        current__1: '#current--1',
        player__0: '.player--0',
        player__1: '.player--1',
        holdDiceBtn: '.btn--hold',
        score__0: '#score--0',
        score__1: '#score--1',
        playerName__0: '#name--0',
        playerName__1: '#name--1',
        newGameBtn: '.btn--new'
    }

 
    return{

        displayRollDice: function(randomSRC) {

            document.querySelector(DOMstring.diceImg).src = 'dice-' + randomSRC + '.png';
        },

        nextPlayer: function(resetScr, active) {

            //reset the current score
            document.querySelector(DOMstring['current__' + active]).textContent = resetScr;

            // toggle player classes
            document.querySelector(DOMstring.player__0).classList.toggle('player--active')
            document.querySelector(DOMstring.player__1).classList.toggle('player--active')

        
            //hide the dice
            document.querySelector(DOMstring.diceImg).style.display = 'none';

        },

        displayCurrScore: function(totalScr, active) {

            //update the curr score
            document.querySelector(DOMstring['current__' + active]).textContent = totalScr;

            //show the dice
            document.querySelector(DOMstring.diceImg).style.display = 'block';
        },

        displayGlobalScore: function(total, active) {
            var fields;

            // fields selection
            fields = document.querySelector(DOMstring['score__' + active])
            fields.textContent = total[active];

        },

        winnerPlayer: function(resetScr, active) {

            //toggle winner and active classes
            document.querySelector(DOMstring['player__' + active]).classList.remove('player--active');
            document.querySelector(DOMstring['player__' + active]).classList.add('player--winner');

             //hide the dice
             document.querySelector(DOMstring.diceImg).style.display = 'none';

             //text content === 0
            document.querySelector(DOMstring.current__0).textContent = resetScr;
            document.querySelector(DOMstring.current__1).textContent = resetScr;

            //player win
            document.querySelector(DOMstring['playerName__' + active ]).textContent = 'Winner!'

        },

        newGame: function(curresetScr, gblresetScr, active) {

            //toggle winner and active classes
            document.querySelector(DOMstring['player__' + active]).classList.add('player--active');
            document.querySelector(DOMstring['player__' + active]).classList.remove('player--winner');

            //text content === 0
            document.querySelector(DOMstring.current__0).textContent = curresetScr;
            document.querySelector(DOMstring.current__1).textContent = curresetScr;
            document.querySelector(DOMstring.score__0).textContent = gblresetScr[0];
            document.querySelector(DOMstring.score__1).textContent = gblresetScr[1];

            //hide the dice
            document.querySelector(DOMstring.diceImg).style.display = 'none';

            // change text content
            document.querySelector(DOMstring.playerName__0).textContent = 'PLAYER 1'
            document.querySelector(DOMstring.playerName__1).textContent = 'PLAYER 2'

        },

        getDOMstring: function() {
            return DOMstring;
        }
    }

})();


//=========================================//data controller===========================================================

var dataController = (function() {

    //global data structure
     var data = {
        activeScore: {
            sum: 0,
        },
        globalScore: {
            totalScore: [0, 0] 
        } 
     }

    // generate randome number
    var randomNumber = function() {

        var random = Math.floor(Math.random() * 6) + 1;
        return random;

    };


    return{

        currentScore: function(randomNum) {

            var sum = data.activeScore.sum += randomNum;
             return sum;

        },

        globalScore: function(active) {
            
            data.globalScore.totalScore[active] += data.activeScore.sum;
            return data.globalScore.totalScore;

        },

        resetCurrScr: function() {
           return data.activeScore.sum = 0;
        },

        resetGlobalScr: function() {
            return data.globalScore.totalScore = [0, 0]
        },

         getRandom: function() {
             return randomNumber();
         },

         test: function() {
             return data
         }

    }

})();



//===================================//GlobalController=================================================================

var controller = (function(datactrl, UIctrl) {
    var active, isPlaying;
    
    isPlaying = true;
    active = 0;


    
        
    var DOM = UIctrl.getDOMstring();
    //function1: for eventListner
    var setupEventListener = function() {
      
        document.querySelector(DOM.rollDiceBtn).addEventListener('click', rollCurrentDice); 
        document.querySelector(DOM.holdDiceBtn).addEventListener('click', holdGlobalScore);
        document.querySelector(DOM.newGameBtn).addEventListener('click', initialize);

    }

    //function3: nextPlayer term
    var switchPlayer = function() {

        //1. Reset the current player score in datactrl
        var resetScore = datactrl.resetCurrScr();

        //2. update the UI by
          // current score //hide the dice //switch classes
          UIctrl.nextPlayer(resetScore, active);

            // toggle object property
            active === 0 ? active = 1 : active = 0;

    } 
    //function4: for rollDice btn
    var rollCurrentDice = function() {
        if(isPlaying){
            
        var randomNumber, currScr;
        //1. generate random number in datactrl
        randomNumber = datactrl.getRandom();

        //2. update the dice UI
        UIctrl.displayRollDice(randomNumber);

        if(randomNumber !== 1) {
        //1. plus the randomScore in datactrl
        currScr = datactrl.currentScore(randomNumber);

        //2. update the currScr in UI
        UIctrl.displayCurrScore(currScr, active);

        }else{
            
            //toggle to nextPlayer
            switchPlayer()
        }
        
        }
    };

    //function5: holdGlobalScore for holdBtn
    var holdGlobalScore = function() {

        if(isPlaying){
            //add current score tor global score
        var total = datactrl.globalScore(active);

        //update globalScore to the UI
        UIctrl.displayGlobalScore(total, active);

        if(total[active] >= 30) {

            isPlaying = false;
            
            //reset current score
            var resetScr = datactrl.resetCurrScr();

             //class toggled remove = content of currScr = 0 //winner class added
            UIctrl.winnerPlayer(resetScr, active)

            //state variable active
            

        }else{
            switchPlayer();
        }
        
        }

        
    };
    
   
        //funcion6: Initializing function
        var initialize = function() {

            isPlaying = true;
            
            var currResetScr = datactrl.resetCurrScr();
            var globalResetScr = datactrl.resetGlobalScr();

            //change text conent in UI
            UIctrl.newGame(currResetScr, globalResetScr, active);
        }

    return{
        init: function() {
            console.log("Application has started");
            initialize();
            setupEventListener();
        }
    };


})(dataController, UIController);


controller.init();