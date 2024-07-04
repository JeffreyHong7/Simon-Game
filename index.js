/*************************{Important Variables}********************************/
// Variables to Store extracted DOM Elements
var greenPiece = $(".tl");
var redPiece = $(".tr");
var yellowPiece = $(".bl");
var bluePiece = $(".br");
var greenText = $(".green");
var redText = $(".red");
var yellowText = $(".yellow");
var blueText = $(".blue");
var best = $("#best");
var score = $("#score");
var button = $("button");
var body = $("body");

// Variables representing Audio Elements
var greenSound = new Audio("./assets/sounds/green.mp3");
var redSound = new Audio("./assets/sounds/red.mp3");
var yellowSound = new Audio("./assets/sounds/yellow.mp3");
var blueSound = new Audio("./assets/sounds/blue.mp3");
var startSound = new Audio("./assets/sounds/start.mp3");
var misclickSound = new Audio("./assets/sounds/misclick.mp3");
var levelUpSound = new Audio("./assets/sounds/level-up.mp3");

// Additional Variables
var bestLevel = 0;

/*************************{Function for Animation}*****************************/
function startAnimation() {
  setTimeout(() => {
    greenSound.play();
    greenText.addClass("green-lit");
    greenPiece.addClass("tl-lit");
  }, 750);
  setTimeout(() => {
    redSound.play();
    redText.addClass("red-lit");
    redPiece.addClass("tr-lit");
  }, 1500);
  setTimeout(() => {
    yellowSound.play();
    yellowText.addClass("yellow-lit");
    yellowPiece.addClass("bl-lit");
  }, 2250);
  setTimeout(() => {
    blueSound.play();
    blueText.addClass("blue-lit");
    bluePiece.addClass("br-lit");
  }, 3000);
  function toggleText() {
    greenText.toggleClass("green-lit");
    redText.toggleClass("red-lit");
    yellowText.toggleClass("yellow-lit");
    blueText.toggleClass("blue-lit");
  }
  function togglePieces() {
    greenPiece.toggleClass("tl-lit");
    redPiece.toggleClass("tr-lit");
    yellowPiece.toggleClass("bl-lit");
    bluePiece.toggleClass("br-lit");
  }
  for (var i = 0; i <= 2000; i += 250) {
    setTimeout(() => {
      toggleText();
      togglePieces();
    }, 3750 + i);
  }
  setTimeout(toggleText, 6500);
  // do not display start button until initial animation is complete
  setTimeout(() => {
    best.show();
    button.show();
  }, 7250);
}

/*************************{Functions for Game}*********************************/
// Game Starting Sequence
function startGame() {
  startSound.play();
  button.hide();
  button.addClass("pressed");
  button.text("Continue");
  best.hide();
  score.text("Level: 1");
  score.show();
}

// helper function for playGame to flash green piece
function greenFlash() {
  greenPiece.addClass("tl-lit");
  setTimeout(() => {
    greenPiece.removeClass("tl-lit");
  }, 200);
}

// helper function for playGame to flash red piece
function redFlash() {
  redPiece.addClass("tr-lit");
  setTimeout(() => {
    redPiece.removeClass("tr-lit");
  }, 200);
}

// helper function for playGame to flash yellow piece
function yellowFlash() {
  yellowPiece.addClass("bl-lit");
  setTimeout(() => {
    yellowPiece.removeClass("bl-lit");
  }, 200);
}

// function function for playGame to flash blue piece
function blueFlash() {
  blueSound.play();
  bluePiece.addClass("br-lit");
  setTimeout(() => {
    bluePiece.removeClass("br-lit");
  }, 200);
}

// helper function for playGame to display color sequence
function playSequence(seq) {
  // play the random sequence in intervals of 750 ms
  for (var i = 0; i < seq.length; i++) {
    var pieceToPlay;
    switch (seq[i]) {
      case 0:
        pieceToPlay = () => {
          greenSound.play();
          greenFlash();
        };
        break;
      case 1:
        pieceToPlay = () => {
          redSound.play();
          redFlash();
        };
        break;
      case 2:
        pieceToPlay = () => {
          yellowSound.play();
          yellowFlash();
        };
        break;
      case 3:
        pieceToPlay = () => {
          blueSound.play();
          blueFlash();
        };
        break;
      default:
        pieceToPlay = () => {
          alert(seq[i]);
        };
    }
    setTimeout(pieceToPlay, i * 500);
  }
}

// helper function for playGame to initiate the ending sequence
function gameEnd(currentLevel) {
  misclickSound.play();
  body.addClass("white");
  setTimeout(() => {
    body.removeClass("white");
  }, 200);
  greenPiece.off();
  redPiece.off();
  yellowPiece.off();
  bluePiece.off();
  // reset button back to default settings
  button.removeClass("pressed");
  button.text("Start");
  button.click(() => {
    button.off("click");
    startGame();
    var seq = [Math.floor(Math.random() * 4)];
    setTimeout(playGame, 2000, seq, 1);
  });
  bestLevel = Math.max(bestLevel, currentLevel);
  best.text("Best: " + bestLevel);
  setTimeout(() => {
    score.hide();
    button.show();
    best.show();
  }, 1000);
}

// helper function for playGame to intiate the level-up sequence
function levelUp(seq, currentLevel) {
  levelUpSound.play();
  greenPiece.off();
  redPiece.off();
  yellowPiece.off();
  bluePiece.off();
  score.slideUp(500);
  currentLevel++;
  button.click(() => {
    button.off("click");
    startSound.play();
    seq.push(Math.floor(Math.random() * 4));
    button.hide();
    setTimeout(playGame, 2000, seq, currentLevel);
  });
  setTimeout(() => {
    score.text("Level: " + currentLevel);
    score.slideDown(500);
    button.show();
  }, 1000);
}

/* recursive function to simulate gameplay, terminates when player misclicks.
Each iteration represents a level. */
function playGame(seq, currentLevel) {
  playSequence(seq);
  // playerSeq is a local var as player needs to recreate entire seq each level
  var playerSeq = [];
  setTimeout(() => {
    greenPiece.click(() => {
      greenFlash();
      playerSeq.push(0);
      if (seq[playerSeq.length - 1] !== 0) {
        gameEnd(currentLevel);
      } else {
        if (playerSeq.length === seq.length) {
          levelUp(seq, currentLevel);
        } else {
          greenSound.play();
        }
      }
    });
    redPiece.click(() => {
      redFlash();
      playerSeq.push(1);
      if (seq[playerSeq.length - 1] !== 1) {
        gameEnd(currentLevel);
      } else {
        if (playerSeq.length === seq.length) {
          levelUp(seq, currentLevel);
        } else {
          redSound.play();
        }
      }
    });
    yellowPiece.click(() => {
      yellowFlash();
      playerSeq.push(2);
      if (seq[playerSeq.length - 1] !== 2) {
        gameEnd(currentLevel);
      } else {
        if (playerSeq.length === seq.length) {
          levelUp(seq, currentLevel);
        } else {
          yellowSound.play();
        }
      }
    });
    bluePiece.click(() => {
      blueFlash();
      playerSeq.push(3);
      if (seq[playerSeq.length - 1] !== 3) {
        gameEnd(currentLevel);
      } else {
        if (playerSeq.length === seq.length) {
          levelUp(seq, currentLevel);
        } else {
          blueSound.play();
        }
      }
    });
  }, 750 * seq.length - 600);
}

/*************************{JS Program to Execute}******************************/
/* purpose of Noty is for users to interact with the website to enable the sound f
rom the animation (auto-play blocked on Chrome) */
new Noty({
  text: "<div style='text-align:center;'>For each level, attempt to recreate the sequence of lights you are shown. The sequence for each level is a continuation of the previous level's sequence. Click me to begin!</div>",
  type: "info",
  layout: "bottomCenter",
  theme: "relax", // Choose a theme that supports text alignment
  timeout: false, // Auto-close after 3 seconds
  closeWith: ["click"],
  callbacks: {
    onClose: startAnimation,
  },
}).show();
button.click(() => {
  button.off("click");
  startGame();
  // seq is a global var because we want to use the same seq array each level
  var seq = [Math.floor(Math.random() * 4)];
  // start gameplay 3s after initial sequence
  setTimeout(playGame, 2000, seq, 1);
});
