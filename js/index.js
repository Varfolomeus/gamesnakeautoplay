mytimeshforid("ppp6565");

function mytimeshforid(wheretoshow) {
    var show_time = document.getElementById(wheretoshow);
    var current_date = new Date();
    var pretty_time = `${String(current_date.getDate()).padStart(2, "0")}.${String(current_date.getMonth()+1).padStart(2, "0")}.${String(current_date.getFullYear())}-${String(current_date.getHours()).padStart(2, "0")}.${String(current_date.getMinutes()).padStart(2, "0")}`
    show_time.innerHTML = show_time.innerHTML + pretty_time;
}
/* for (let uuu = 0 ; uuu< 50 ; uuu++){
    console.log((3+Math.floor((Math.floor(Math.random()*2))+4))% 4);
}
 */
var loadedJSONoject=null;
var isloadedJSONoject=false;
// list of buttons event listeners
var operationButtons = document.getElementsByClassName("operation-buttons");
// access to inout fields on web page
var input1 = document.getElementById("input1");
var input2 = document.getElementById("input2");
var inputGenes = document.getElementById('filewithgenes');
// bodies of functions listeners
for (let i = 0; i < operationButtons.length; i++) {
    operationButtons[i].addEventListener("click", onButtonclick);
}
// functions to perform manipulations
function onButtonclick(eventObject) {
    var clickdElement = eventObject.currentTarget;
    var whatoperation = clickdElement.id;
    gameControls(whatoperation);
}
function gameControls(operation) {

    switch (operation) {
        case "buttonPlus": let NewSnakeGame = new gameManager(); that.gameStart(); break;
        case "buttonMinus": that.gameover = !that.gameover; break;
        case "buttonMultiply": that.continiousgame(); break;
        case "buttonDivide": that.move(); break;
        case "readfile": readingFileWithGenes(); break;
    }
    //    document.getElementById("rezultPlace").innerHTML = rezult;
}

if (localStorage.hasOwnProperty("genestotransfer")) {
    let transferdata = JSON.parse(localStorage.getItem("genestotransfer"));
    if (transferdata.hasOwnProperty("input1")) {
        input1.value = transferdata.input1;
    };
    if (transferdata.hasOwnProperty("input2")) {
        input2.value = transferdata.input2;
    };
};

function readingFileWithGenes() {
    var file, fr;

    if (typeof window.FileReader !== 'function') {
        alert("The file API isn't supported on this browser yet.");
        return;
    }
    if (!inputGenes) {
        alert("Um, couldn't find the fileinput element.");
    }
    else if (!inputGenes.files) {
        alert("This browser doesn't seem to support the 'files' property of file inputs.");
    }
    else if (!inputGenes.files[0]) {
        alert("Please select a file before clicking 'Load'");
    }
    else {
        file = inputGenes.files[0];
        fr = new FileReader();
        fr.onload = receivedText;
        fr.readAsText(file);
    }

    function receivedText(e) {
        let lines = e.target.result;
        loadedJSONoject = JSON.parse(lines);
        if (loadedJSONoject.hasOwnProperty("input1")) {
            input1.value = loadedJSONoject.input1;
        };
        if (loadedJSONoject.hasOwnProperty("input2")) {
            input2.value = loadedJSONoject.input2;
        }
        isloadedJSONoject = true;
    }
}
//-----------canvas-------------------
var canvas = document.getElementById("c1");
var ctx = canvas.getContext('2d');


//------------Snake-------------------
let that = null;
PointOfField = function (xcc, ycc, colorofpointfield) {
    this.xCoord = xcc;
    this.yCoord = ycc;
    this.pointColor = colorofpointfield;
    this.getX = function () {
        return this.xCoord;
    }
    this.getY = function () {
        return this.yCoord;
    }
    this.setXY = function (x, y) {
        this.xCoord = x;
        this.yCoord = y;
    }
    this.setColor = function (color) {
        this.pointColor = color;
    }
};

food = function () {
    this.foodcolor = "#EB3F8F";
    this.foodvolume = [];
    this.radiusoffoodportion = that.cellsize;
    this.foodEaten = false;
    this.addFood = function () {
        let x = 0;
        let y = 0;
        do {
            x = Math.floor(Math.random() * that.gameWidth);
            y = Math.floor(Math.random() * that.gameHeight);
            var tempfood = new PointOfField(x, y, this.foodcolor);
        } while (that.isFood(x, y) || that.isSnake(x, y) || that.isPoison());
        this.foodvolume.push(tempfood);
    };
};

poison = function () {
    this.poisonColor = "#2CDC20";
    this.poisonvolume = [];
    this.radiusofpoisonportion = that.cellsize;
    this.poisonEaten = false;
    this.addPoison = function () {
        let x = 0;
        let y = 0;
        do {
            x = Math.floor(Math.random() * that.gameWidth);
            y = Math.floor(Math.random() * that.gameHeight);
            var temppoison = new PointOfField(x, y, this.poisonColor);
        } while (that.isFood(x, y) || that.isSnake(x, y) || that.isPoison(x, y));
        this.poisonvolume.push(temppoison);
    };
};

SnakeObject = function (snlength, snheadX, snheadY, snDir, colorofsnakehead, cellBodysize, givedGenes, mutations) {
    this.headColor = colorofsnakehead;
    this.headX = snheadX;
    this.headY = snheadY;
    this.mutations = mutations;
    this.snakeDirection = snDir;
    this.snakeBody = [];
    this.snakeEyeValues = givedGenes;
    this.leftEyevalue = null;
    this.frontEyevalue = null;
    this.rightEyevalue = null;
    this.cellBodysize = cellBodysize;
    this.startSnakeLength = snlength;
    this.generateBody = function () {
        this.snakeBody = [];
        for (let i = 0; i < this.startSnakeLength; i++) {
            this.snakeBody.push(new PointOfField(this.headX - i, this.headY, this.headColor));
        }
    };
    this.calculateDirection = function (Snaketocalkdir, numofsntocalcdir) {
        let x1 = Snaketocalkdir.headX;
        let y1 = Snaketocalkdir.headY;
        let xn1 = 0;
        let yn1 = 0;
        if (Snaketocalkdir.snakeDirection === 0) {
            //calculating eyevalues - left eye for left direction
            let ii = 0;
            for (let i = 1; i < that.eyeDepth; i++) {
                for (let j = -i; j <= i; j++) {
                    let eyevalueforcalculation = Snaketocalkdir.snakeEyeValues[ii];
                    xn1 = (x1 - that.step * j + 1 + that.gameWidth) % that.gameWidth;
                    yn1 = (y1 + that.step * i + that.gameHeight) % that.gameHeight;
                    Snaketocalkdir.leftEyevalue += eyevalueforcalculation * that.checkeyevalue(xn1, yn1, numofsntocalcdir);
                    ii++;
                }
            }
            //calculating eyevalues - front eye for left direction
            ii = 0;
            for (let i = 1; i < that.eyeDepth; i++) {
                for (let j = -i; j <= i; j++) {
                    let eyevalueforcalculation = Snaketocalkdir.snakeEyeValues[ii];
                    xn1 = (x1 - that.step * i + that.gameWidth) % that.gameWidth;
                    yn1 = (y1 - that.step * j + that.gameHeight) % that.gameHeight;
                    Snaketocalkdir.frontEyevalue += eyevalueforcalculation * that.checkeyevalue(xn1, yn1, numofsntocalcdir);
                    ii++;
                }
            }
            //calculating eyevalues - right eye for left direction
            ii = 0;
            for (let i = 1; i < that.eyeDepth; i++) {
                for (let j = -i; j <= i; j++) {
                    let eyevalueforcalculation = Snaketocalkdir.snakeEyeValues[ii];
                    xn1 = (x1 + that.step * j + 1 + that.gameWidth) % that.gameWidth;
                    yn1 = (y1 - that.step * i + that.gameHeight) % that.gameHeight;
                    Snaketocalkdir.rightEyevalue += eyevalueforcalculation * that.checkeyevalue(xn1, yn1, numofsntocalcdir);
                    ii++;
                }
            }
            Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection + that.changedirection(Snaketocalkdir.leftEyevalue, Snaketocalkdir.frontEyevalue, Snaketocalkdir.rightEyevalue) + 4) % 4;
            if (that.showmessages) {
                console.log("Snake: " + numofsntocalcdir + " Left Eye: " + Snaketocalkdir.leftEyevalue + " Front Eye: " + Snaketocalkdir.frontEyevalue + " Right Eye: " + Snaketocalkdir.rightEyevalue + " Direction: " + Snaketocalkdir.snakeDirection);
            }
            Snaketocalkdir.leftEyevalue = 0;
            Snaketocalkdir.frontEyevalue = 0;
            Snaketocalkdir.rightEyevalue = 0;
            return Snaketocalkdir.snakeDirection;
        };
        if (Snaketocalkdir.snakeDirection === 1) {
            //calculating eyevalues - left eye for up direction
            let ii = 0;
            for (let i = 1; i < that.eyeDepth; i++) {
                for (let j = -i; j <= i; j++) {
                    let eyevalueforcalculation = Snaketocalkdir.snakeEyeValues[ii];
                    xn1 = (x1 - that.step * i + that.gameWidth) % that.gameWidth;
                    yn1 = (y1 - that.step * j + 1 + that.gameHeight) % that.gameHeight;
                    Snaketocalkdir.leftEyevalue += eyevalueforcalculation * that.checkeyevalue(xn1, yn1, numofsntocalcdir);
                    ii++;
                }
            }
            //calculating eyevalues - front eye for up direction
            ii = 0;
            for (let i = 1; i < that.eyeDepth; i++) {
                for (let j = -i; j <= i; j++) {
                    let eyevalueforcalculation = Snaketocalkdir.snakeEyeValues[ii];
                    xn1 = (x1 + that.step * j + that.gameWidth) % that.gameWidth;
                    yn1 = (y1 - that.step * i + that.gameHeight) % that.gameHeight;
                    Snaketocalkdir.frontEyevalue += eyevalueforcalculation * that.checkeyevalue(xn1, yn1, numofsntocalcdir);
                    ii++;
                };
            };
            //calculating eyevalues - right eye for up direction
            ii = 0;
            for (let i = 1; i < that.eyeDepth; i++) {
                for (let j = -i; j <= i; j++) {
                    let eyevalueforcalculation = Snaketocalkdir.snakeEyeValues[ii];
                    xn1 = (x1 + that.step * i + that.gameWidth) % that.gameWidth;
                    yn1 = (y1 + that.step * j + 1 + that.gameHeight) % that.gameHeight;
                    Snaketocalkdir.rightEyevalue += eyevalueforcalculation * that.checkeyevalue(xn1, yn1, numofsntocalcdir);
                    ii++;
                };
            };
            Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection + that.changedirection(Snaketocalkdir.leftEyevalue, Snaketocalkdir.frontEyevalue, Snaketocalkdir.rightEyevalue) + 4) % 4;
            if (that.showmessages) {
                console.log("Snake: " + numofsntocalcdir + " Left Eye: " + Snaketocalkdir.leftEyevalue + " Front Eye: " + Snaketocalkdir.frontEyevalue + " Right Eye: " + Snaketocalkdir.rightEyevalue + " Direction: " + Snaketocalkdir.snakeDirection);
            };
            Snaketocalkdir.leftEyevalue = 0;
            Snaketocalkdir.frontEyevalue = 0;
            Snaketocalkdir.rightEyevalue = 0;
            return Snaketocalkdir.snakeDirection;
        };
        if (Snaketocalkdir.snakeDirection === 2) {
            //calculating eyevalues - left eye for right direction
            let ii = 0;
            for (let i = 1; i < that.eyeDepth; i++) {
                for (let j = -i; j <= i; j++) {
                    let eyevalueforcalculation = Snaketocalkdir.snakeEyeValues[ii];
                    xn1 = (x1 + that.step * j - 1 + that.gameWidth) % that.gameWidth;
                    yn1 = (y1 - that.step * i + that.gameHeight) % that.gameHeight;
                    Snaketocalkdir.leftEyevalue += eyevalueforcalculation * that.checkeyevalue(xn1, yn1, numofsntocalcdir);
                    ii++;
                };
            };
            //calculating eyevalues - front eye for right direction
            ii = 0;
            for (let i = 1; i < that.eyeDepth; i++) {
                for (let j = -i; j <= i; j++) {
                    let eyevalueforcalculation = Snaketocalkdir.snakeEyeValues[ii];
                    xn1 = (x1 + that.step * i + that.gameWidth) % that.gameWidth;
                    yn1 = (y1 + that.step * j + that.gameHeight) % that.gameHeight;
                    Snaketocalkdir.frontEyevalue += eyevalueforcalculation * that.checkeyevalue(xn1, yn1, numofsntocalcdir);

                    ii++;
                };
            };
            //calculating eyevalues - right eye for right direction
            ii = 0;
            for (let i = 1; i < that.eyeDepth; i++) {
                for (let j = -i; j <= i; j++) {
                    let eyevalueforcalculation = Snaketocalkdir.snakeEyeValues[ii];
                    xn1 = (x1 - that.step * j - 1 + that.gameWidth) % that.gameWidth;
                    yn1 = (y1 + that.step * i + that.gameHeight) % that.gameHeight;
                    Snaketocalkdir.rightEyevalue += eyevalueforcalculation * that.checkeyevalue(xn1, yn1, numofsntocalcdir);
                    ii++;
                };
            };
            Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection + that.changedirection(Snaketocalkdir.leftEyevalue, Snaketocalkdir.frontEyevalue, Snaketocalkdir.rightEyevalue) + 4) % 4;
            if (that.showmessages) {
                console.log("Snake: " + numofsntocalcdir + " Left Eye: " + Snaketocalkdir.leftEyevalue + " Front Eye: " + Snaketocalkdir.frontEyevalue + " Right Eye: " + Snaketocalkdir.rightEyevalue + " Direction: " + Snaketocalkdir.snakeDirection);
            };
            Snaketocalkdir.leftEyevalue = 0;
            Snaketocalkdir.frontEyevalue = 0;
            Snaketocalkdir.rightEyevalue = 0;
            return Snaketocalkdir.snakeDirection;
        };
        if (Snaketocalkdir.snakeDirection === 3) {
            //calculating eyevalues - left eye for down direction
            let ii = 0;
            for (let i = 1; i < that.eyeDepth; i++) {
                for (let j = -i; j <= i; j++) {
                    let eyevalueforcalculation = Snaketocalkdir.snakeEyeValues[ii];
                    xn1 = (x1 + that.step * i + that.gameWidth) % that.gameWidth;
                    yn1 = (y1 + that.step * j - 1 + that.gameHeight) % that.gameHeight;
                    Snaketocalkdir.leftEyevalue += eyevalueforcalculation * that.checkeyevalue(xn1, yn1, numofsntocalcdir);
                    ii++;
                };
            };
            //calculating eyevalues - front eye for down direction
            ii = 0;
            for (let i = 1; i < that.eyeDepth; i++) {
                for (let j = -i; j <= i; j++) {
                    let eyevalueforcalculation = Snaketocalkdir.snakeEyeValues[ii];
                    xn1 = (x1 - that.step * j + that.gameWidth) % that.gameWidth;
                    yn1 = (y1 + that.step * i + that.gameHeight) % that.gameHeight;
                    Snaketocalkdir.frontEyevalue += eyevalueforcalculation * that.checkeyevalue(xn1, yn1, numofsntocalcdir);
                    ii++;
                };
            };
            //calculating eyevalues - right eye for down direction
            ii = 0;
            for (let i = 1; i < that.eyeDepth; i++) {
                for (let j = -i; j <= i; j++) {
                    let eyevalueforcalculation = Snaketocalkdir.snakeEyeValues[ii];
                    xn1 = (x1 - that.step * i + that.gameWidth) % that.gameWidth;
                    yn1 = (y1 - that.step * j - 1 + that.gameHeight) % that.gameHeight;
                    Snaketocalkdir.rightEyevalue += eyevalueforcalculation * that.checkeyevalue(xn1, yn1, numofsntocalcdir);
                    ii++;
                };
            };
            Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection + that.changedirection(Snaketocalkdir.leftEyevalue, Snaketocalkdir.frontEyevalue, Snaketocalkdir.rightEyevalue) + 4) % 4;
            if (that.showmessages) {
                console.log("Snake: " + numofsntocalcdir + " Left Eye: " + Snaketocalkdir.leftEyevalue + " Front Eye: " + Snaketocalkdir.frontEyevalue + " Right Eye: " + Snaketocalkdir.rightEyevalue + " Direction: " + Snaketocalkdir.snakeDirection);
            };
            Snaketocalkdir.leftEyevalue = 0;
            Snaketocalkdir.frontEyevalue = 0;
            Snaketocalkdir.rightEyevalue = 0;
            return Snaketocalkdir.snakeDirection;
        };
    };
};

gameManager = function () {
    this.startSnakeLength = 6;
    this.maxSnakeLength = 12;
    this.startSnakeNumber = 0;
    this.maxsSnakeNumber = 40;
    this.startX = 4;
    this.cellsize = 10;
    this.gameWidth = canvas.width / this.cellsize;
    this.gameHeight = canvas.height / this.cellsize;
    this.startY = 10;
    this.Leftdir = 0;
    this.Updir = 1;
    this.Rightdir = 2;
    this.Downdir = 3;
    this.eyeDepth = 5;
    this.mutationsonstart = 0;
    this.showmessages = false;
    this.gameover = false;
    this.step = 1;
    this.eaten = 0;
    this.mutationsOn = true;
    this.foodvalue = 100;
    this.poisonvalue = -100;
    this.bodyvalue = -100;
    this.gamepause = 100;
    this.eyeDeltaWidth = 2;
    this.savegenes = 5;
    this.readfromFile = false;
    this.stepEvolution = 0.02;
    this.foodimageurl = "./images/food.png";
    this.poisonimageurl = "./images/poison.png";
    this.foodimage = new Image();
    this.foodimage.src = this.foodimageurl;
    this.poisonimage = new Image();
    this.poisonimage.src = this.poisonimageurl;
    this.startwidthofeye = 3;
    this.genesfromtramsfer = [];
    this.genestotransfer = [];
    this.mutationstotransfer = [];
    this.snakefighterlength = 10;
    this.foodstartvolume = 100;
    this.poisonstartvolume = 10;
    this.othersnakevalue = - 100;
    this.fight = 1;
    this.startDirection = 2;
    this.startHeadColor = "rgb(100,100,100)";
    this.startQuantityOfSnakes = 10;
    this.snakesonfield = [];
    this.eyevalues = [[0.707, 1.0, 0.707, 0.353, 0.447, 0.5, 0.447, 0.353, 0.235, 0.277, 0.316, 0.333, 0.316, 0.277, 0.235, 0.176, 0.2, 0.223, 0.242, 0.25, 0.242, 0.223, 0.2, 0.176, 0.141, 0.156, 0.171, 0.185, 0.196, 0.2, 0.196, 0.185, 0.171, 0.156, 0.141, 0.117, 0.128, 0.138, 0.149, 0.158, 0.164, 0.166, 0.164, 0.158, 0.149, 0.138, 0.128, 0.117, 0.101, 0.108, 0.116, 0.124, 0.131, 0.137, 0.141, 0.142, 0.141, 0.137, 0.131, 0.124, 0.116, 0.108, 0.101, 0.088, 0.094, 0.1, 0.105, 0.111, 0.117, 0.121, 0.124, 0.125, 0.124, 0.121, 0.117, 0.111, 0.105, 0.1, 0.094, 0.088, 0.078, 0.083, 0.087, 0.092, 0.097, 0.101, 0.105, 0.108, 0.11, 0.111, 0.11, 0.108, 0.105, 0.101, 0.097, 0.092, 0.087, 0.083, 0.078, 0.07, 0.074, 0.078, 0.081, 0.085, 0.089, 0.092, 0.095, 0.098, 0.099, 0.1, 0.099, 0.098, 0.095, 0.092, 0.089, 0.085, 0.081, 0.078, 0.074, 0.07, 0.064, 0.067, 0.07, 0.073, 0.076, 0.079, 0.082, 0.085, 0.087, 0.089, 0.09, 0.09, 0.09, 0.089, 0.087, 0.085, 0.082, 0.079, 0.076, 0.073, 0.07, 0.067, 0.064, 0.058, 0.061, 0.064, 0.066, 0.069, 0.071, 0.074, 0.076, 0.079, 0.08, 0.082, 0.083, 0.083, 0.083, 0.082, 0.08, 0.079, 0.076, 0.074, 0.071, 0.069, 0.066, 0.064, 0.061, 0.058, 0.054, 0.056, 0.058, 0.06, 0.063, 0.065, 0.067, 0.069, 0.071, 0.073, 0.074, 0.076, 0.076, 0.076, 0.076, 0.076, 0.074, 0.073, 0.071, 0.069, 0.067, 0.065, 0.063, 0.06, 0.058, 0.056, 0.054, 0.05, 0.052, 0.054, 0.056, 0.058, 0.06, 0.062, 0.063, 0.065, 0.067, 0.068, 0.069, 0.07, 0.071, 0.071, 0.071, 0.07, 0.069, 0.068, 0.067, 0.065, 0.063, 0.062, 0.06, 0.058, 0.056, 0.054, 0.052, 0.05, 0.047, 0.048, 0.05, 0.052, 0.053, 0.055, 0.057, 0.058, 0.06, 0.061, 0.063, 0.064, 0.065, 0.066, 0.066, 0.066, 0.066, 0.066, 0.065, 0.064, 0.063, 0.061, 0.06, 0.058, 0.057, 0.055, 0.053, 0.052, 0.05, 0.048, 0.047],
    [0.707, 1.0, 0.707, 0.353, 0.447, 0.5, 0.447, 0.353, 0.235, 0.277, 0.316, 0.333, 0.316, 0.277, 0.235, 0.176, 0.2, 0.223, 0.242, 0.25, 0.242, 0.223, 0.2, 0.176, 0.141, 0.156, 0.171, 0.185, 0.196, 0.2, 0.196, 0.185, 0.171, 0.156, 0.141, 0.117, 0.128, 0.138, 0.149, 0.158, 0.164, 0.166, 0.164, 0.158, 0.149, 0.138, 0.128, 0.117, 0.101, 0.108, 0.116, 0.124, 0.131, 0.137, 0.141, 0.142, 0.141, 0.137, 0.131, 0.124, 0.116, 0.108, 0.101, 0.088, 0.094, 0.1, 0.105, 0.111, 0.117, 0.121, 0.124, 0.125, 0.124, 0.121, 0.117, 0.111, 0.105, 0.1, 0.094, 0.088, 0.078, 0.083, 0.087, 0.092, 0.097, 0.101, 0.105, 0.108, 0.11, 0.111, 0.11, 0.108, 0.105, 0.101, 0.097, 0.092, 0.087, 0.083, 0.078, 0.07, 0.074, 0.078, 0.081, 0.085, 0.089, 0.092, 0.095, 0.098, 0.099, 0.1, 0.099, 0.098, 0.095, 0.092, 0.089, 0.085, 0.081, 0.078, 0.074, 0.07, 0.064, 0.067, 0.07, 0.073, 0.076, 0.079, 0.082, 0.085, 0.087, 0.089, 0.09, 0.09, 0.09, 0.089, 0.087, 0.085, 0.082, 0.079, 0.076, 0.073, 0.07, 0.067, 0.064, 0.058, 0.061, 0.064, 0.066, 0.069, 0.071, 0.074, 0.076, 0.079, 0.08, 0.082, 0.083, 0.083, 0.083, 0.082, 0.08, 0.079, 0.076, 0.074, 0.071, 0.069, 0.066, 0.064, 0.061, 0.058, 0.054, 0.056, 0.058, 0.06, 0.063, 0.065, 0.067, 0.069, 0.071, 0.073, 0.074, 0.076, 0.076, 0.076, 0.076, 0.076, 0.074, 0.073, 0.071, 0.069, 0.067, 0.065, 0.063, 0.06, 0.058, 0.056, 0.054, 0.05, 0.052, 0.054, 0.056, 0.058, 0.06, 0.062, 0.063, 0.065, 0.067, 0.068, 0.069, 0.07, 0.071, 0.071, 0.071, 0.07, 0.069, 0.068, 0.067, 0.065, 0.063, 0.062, 0.06, 0.058, 0.056, 0.054, 0.052, 0.05, 0.047, 0.048, 0.05, 0.052, 0.053, 0.055, 0.057, 0.058, 0.06, 0.061, 0.063, 0.064, 0.065, 0.066, 0.066, 0.066, 0.066, 0.066, 0.065, 0.064, 0.063, 0.061, 0.06, 0.058, 0.057, 0.055, 0.053, 0.052, 0.05, 0.048, 0.047],
    [0.707, 1.0, 0.707, 0.353, 0.447, 0.5, 0.447, 0.353, 0.235, 0.277, 0.316, 0.333, 0.316, 0.277, 0.235, 0.176, 0.2, 0.223, 0.242, 0.25, 0.242, 0.223, 0.2, 0.176, 0.141, 0.156, 0.171, 0.185, 0.196, 0.2, 0.196, 0.185, 0.171, 0.156, 0.141, 0.117, 0.128, 0.138, 0.149, 0.158, 0.164, 0.166, 0.164, 0.158, 0.149, 0.138, 0.128, 0.117, 0.101, 0.108, 0.116, 0.124, 0.131, 0.137, 0.141, 0.142, 0.141, 0.137, 0.131, 0.124, 0.116, 0.108, 0.101, 0.088, 0.094, 0.1, 0.105, 0.111, 0.117, 0.121, 0.124, 0.125, 0.124, 0.121, 0.117, 0.111, 0.105, 0.1, 0.094, 0.088, 0.078, 0.083, 0.087, 0.092, 0.097, 0.101, 0.105, 0.108, 0.11, 0.111, 0.11, 0.108, 0.105, 0.101, 0.097, 0.092, 0.087, 0.083, 0.078, 0.07, 0.074, 0.078, 0.081, 0.085, 0.089, 0.092, 0.095, 0.098, 0.099, 0.1, 0.099, 0.098, 0.095, 0.092, 0.089, 0.085, 0.081, 0.078, 0.074, 0.07, 0.064, 0.067, 0.07, 0.073, 0.076, 0.079, 0.082, 0.085, 0.087, 0.089, 0.09, 0.09, 0.09, 0.089, 0.087, 0.085, 0.082, 0.079, 0.076, 0.073, 0.07, 0.067, 0.064, 0.058, 0.061, 0.064, 0.066, 0.069, 0.071, 0.074, 0.076, 0.079, 0.08, 0.082, 0.083, 0.083, 0.083, 0.082, 0.08, 0.079, 0.076, 0.074, 0.071, 0.069, 0.066, 0.064, 0.061, 0.058, 0.054, 0.056, 0.058, 0.06, 0.063, 0.065, 0.067, 0.069, 0.071, 0.073, 0.074, 0.076, 0.076, 0.076, 0.076, 0.076, 0.074, 0.073, 0.071, 0.069, 0.067, 0.065, 0.063, 0.06, 0.058, 0.056, 0.054, 0.05, 0.052, 0.054, 0.056, 0.058, 0.06, 0.062, 0.063, 0.065, 0.067, 0.068, 0.069, 0.07, 0.071, 0.071, 0.071, 0.07, 0.069, 0.068, 0.067, 0.065, 0.063, 0.062, 0.06, 0.058, 0.056, 0.054, 0.052, 0.05, 0.047, 0.048, 0.05, 0.052, 0.053, 0.055, 0.057, 0.058, 0.06, 0.061, 0.063, 0.064, 0.065, 0.066, 0.066, 0.066, 0.066, 0.066, 0.065, 0.064, 0.063, 0.061, 0.06, 0.058, 0.057, 0.055, 0.053, 0.052, 0.05, 0.048, 0.047]];

    this.gameStart = function () {
        if (isloadedJSONoject) {
            this.eyevalues = [];
            this.eyevalues = loadedJSONoject.genestotransfer;
            if (loadedJSONoject.hasOwnProperty("mutations")) {
                this.mutationstotransfer = loadedJSONoject.mutations;
            };
        } else if (localStorage.hasOwnProperty("genestotransfer")) {
            this.genesfromtramsfer = JSON.parse(localStorage.getItem("genestotransfer"));
            this.eyevalues = [];
            this.eyevalues = this.genesfromtramsfer.genestotransfer;
            if (this.genesfromtramsfer.hasOwnProperty("mutations")) {
                this.mutationstotransfer = this.genesfromtramsfer.mutations;
            };
        };
        document.getElementById('rezultPlace').innerHTML = "0 <br> Peace"
        this.startQuantityOfSnakes = Number(document.getElementById('input1').value);
        this.gamepause = (Math.floor(10000 / Number(document.getElementById('input2').value)) < 20) ? 20 : Math.floor(10000 / Number(document.getElementById('input2').value));
        this.food = new food();
        this.poison = new poison();
        this.food.foodvolume = [];
        this.poison.poisonvolume = [];
        this.checkandaddsnakes();
        this.checkandaddconsumables();
        this.renderpicture();
        document.querySelector("#buttonPlus").innerHTML = "Restart";
    };

    this.renderpicture = function () {
        // image render
        // clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //snakes
        for (let ii = 0; ii < this.snakesonfield.length; ii++) {
            for (let j = 0; j < this.snakesonfield[ii].snakeBody.length; j++) {
                let x1 = this.snakesonfield[ii].snakeBody[j].getX() * this.snakesonfield[ii].cellBodysize;
                let y1 = this.snakesonfield[ii].snakeBody[j].getY() * this.snakesonfield[ii].cellBodysize;
                let radiusofSnakebodysegment = Math.floor((this.snakesonfield[ii].cellBodysize - 2) / 2);
                let my_gradient = null;
                my_gradient = ctx.createRadialGradient(x1 + Math.floor(((Math.random() * 2) - 1) * (radiusofSnakebodysegment / 2)), y1 + Math.floor(((Math.random()) * 2 - 1) * (radiusofSnakebodysegment / 2)), 1, x1, y1, radiusofSnakebodysegment)
                my_gradient.addColorStop(1, this.snakesonfield[ii].headColor);
                my_gradient.addColorStop(0, "white");
                ctx.fillStyle = my_gradient;
                ctx.beginPath();
                ctx.arc(x1, y1, radiusofSnakebodysegment, 0, 2 * Math.PI, true);
                ctx.fill();
            };
        };
        //food
        for (let i = 0; i < this.food.foodvolume.length; i++) {
            let x1 = this.food.foodvolume[i].getX() * this.food.radiusoffoodportion;
            let y1 = this.food.foodvolume[i].getY() * this.food.radiusoffoodportion;
            ctx.drawImage(this.foodimage, x1 - this.food.radiusoffoodportion / 2, y1 - this.food.radiusoffoodportion / 2, Math.floor(this.food.radiusoffoodportion / 1.4), this.food.radiusoffoodportion);
        };
        //poison
        for (let i = 0; i < this.poison.poisonvolume.length; i++) {
            let x1 = this.poison.poisonvolume[i].getX() * this.poison.radiusofpoisonportion;
            let y1 = this.poison.poisonvolume[i].getY() * this.poison.radiusofpoisonportion;
            ctx.drawImage(this.poisonimage, x1 - this.poison.radiusofpoisonportion / 2, y1 - this.poison.radiusofpoisonportion / 2, this.food.radiusoffoodportion, this.food.radiusoffoodportion);
        };
        //game subtotals and other results on web page
        document.getElementById('rezultPlace').innerHTML = "" + this.eaten + ((this.fight === 1) ? "<br>Peace" : "<br>Fight");
    };

    this.continiousgame = function () {
        setInterval(() => {
            this.move();
        }, this.gamepause);
    };

    this.isgameover = function () {
        let countcolors = [];
        let flip = false;
        if (this.snakesonfield.length < 2) {
            return true;
        };
        for (let i = 0; i < this.snakesonfield.length; i++) {
            if (i < 1) {
                countcolors.push(this.snakesonfield[i].headColor);
            };
            for (j = 0; j < countcolors.length; j++) {
                if (countcolors[j] === this.snakesonfield[i].headColor) {
                    flip = true;
                };
            }
            if (!flip) {
                countcolors.push(this.snakesonfield[i].headColor);

            };
            flip = false;
        };
        if (this.snakesonfield.length > this.maxsSnakeNumber && countcolors.length < 2) {
            document.getElementById('rezultPlace').innerHTML = "Game Over<br>" + this.eaten + ((this.fight === 1) ? "<br>Peace" : "<br>Fight");
            this.mutationstotransfer=[];
            for (let i = 0; i < this.savegenes; i++) {
                this.genestotransfer.push(this.snakesonfield[this.snakesonfield.length - 1 - i].snakeEyeValues);
                this.mutationstotransfer.push(this.snakesonfield[this.snakesonfield.length - 1 - i].mutations);
            }
            //           document.getElementById('genes').innerText = this.genestotransfer;
            let objecttotransfer = {
                genestotransfer: this.genestotransfer,
                mutations: this.mutationstotransfer,
                input1: input1.value,
                input2: input2.value,
            };
            localStorage.clear("genestotransfer");
            localStorage.setItem("genestotransfer", JSON.stringify(objecttotransfer));
            let current_date = new Date();
            let filenametoexport = "genes "+`${String(current_date.getDate()).padStart(2, "0")}.${String(current_date.getMonth()+1).padStart(2, "0")}.${String(current_date.getFullYear())}-${String(current_date.getHours()).padStart(2, "0")}.${String(current_date.getMinutes()).padStart(2, "0")}`;
            this.downloadObjectAsJson(objecttotransfer, filenametoexport);
            let alerttext = `Game over! On game field ${this.snakesonfield.length} or maybe more snakes with one color, and no snakes with other color.`;
            alert(alerttext);
            return true;
        }
        return false;
    };
    this.downloadObjectAsJson = function (exportObj, exportName){
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        let downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".jenes");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }

    this.changedirection = function (lv, fv, rv) {
        if (lv === 0 && fv === 0 && rv === 0) {
            return (Math.floor(Math.random() * 3) - 1);
        } else if (lv > fv && lv === rv) {
            let variationofturn = Math.floor(Math.random() * 2);
            if (variationofturn === 0) {
                return - 1;
            } else {
                return 1;
            }
        } else
            if (fv > lv && fv == rv) {
                return Math.floor(Math.random() * 2);
            } else
                if (fv > rv && fv == lv) {
                    return -Math.floor(Math.random() * 2);
                } else
                    if (fv > lv && fv > rv) {
                        return 0;
                    } else
                        if (lv > fv && lv > rv) {
                            return - 1;
                        } else
                            if (rv > fv && rv > lv) {
                                return 1;
                            };
    };

    this.checkeyevalue = function (xc, yc, nc) {
        if (that.isFood(xc, yc)) {
            return that.foodvalue;
        } else if (that.isNotEnemy(xc, yc, nc)) {
            return that.othersnakevalue;
        } else if (that.isSnakeItself(xc, yc, nc)) {
            return that.bodyvalue;
        } else if (that.isEnemy(xc, yc, nc)) {
            return that.fight * that.othersnakevalue;
        } else if (that.isPoison(xc, yc)) {
            return that.poisonvalue;
        };
        return 0;
    };

    this.checkandaddsnakes = function () {
        while (this.snakesonfield.length < this.startQuantityOfSnakes) {
            let fillColor = 'rgb(' + (1 + Math.floor(Math.random() * 255)) + ',' + (1 + Math.floor(Math.random() * 255)) + ',' + (1 + Math.floor(Math.random() * 255)) + ')';
            //            let fillColor = 'rgb(' + 1 + ',' + 200 + ',' + 1 + ')';
            let x = 0;
            let y = 0;
            do {
                x = Math.floor(Math.random() * that.gameWidth);
                y = Math.floor(Math.random() * that.gameHeight);
            } while (that.isFood(x, y) || that.isSnake(x, y) || that.isPoison(x, y));
            this.snakesonfield.push(new SnakeObject(this.startSnakeLength, x, y, this.startDirection, fillColor, this.cellsize, this.eyevalues[this.snakesonfield.length % this.eyevalues.length], (this.mutationstotransfer.length < 1)? this.mutationsonstart:(this.mutationstotransfer[this.snakesonfield.length % this.mutationstotransfer.length])));
            this.snakesonfield[(this.snakesonfield.length - 1)].generateBody();
        };
    };

    this.isFood = function (x, y) {
        for (let i = 0; i < this.food.foodvolume.length; i++) {
            let x1 = this.food.foodvolume[i].getX();
            let y1 = this.food.foodvolume[i].getY();
            if (x === x1 && y === y1) return true;
        }; return false;
    };

    this.isSnakeItself = function (x, y, numofsnaketocompare) {
        for (let j = 0; j < this.snakesonfield[numofsnaketocompare].snakeBody.length; j++) {
            let x1 = this.snakesonfield[numofsnaketocompare].snakeBody[j].getX();
            let y1 = this.snakesonfield[numofsnaketocompare].snakeBody[j].getY();
            if (x === x1 && y === y1) return true;
        }; return false;
    };

    this.isEnemy = function (x, y, numofsnaketocompare) {
        for (let i = 0; i < this.snakesonfield.length; i++) {
            if (i != numofsnaketocompare) {
                for (let j = 0; j < this.snakesonfield[i].snakeBody.length; j++) {
                    let x1 = this.snakesonfield[i].snakeBody[j].getX();
                    let y1 = this.snakesonfield[i].snakeBody[j].getY();
                    if (x === x1 && y === y1 && this.snakesonfield[numofsnaketocompare].headColor != this.snakesonfield[i].headColor) return true;
                };
            };
        };
        return false;
    };

    this.isNotEnemy = function (x, y, numofsnaketocompare) {
        for (let i = 0; i < this.snakesonfield.length; i++) {
            if (i != numofsnaketocompare) {
                for (let j = 0; j < this.snakesonfield[i].snakeBody.length; j++) {
                    let x1 = this.snakesonfield[i].snakeBody[j].getX();
                    let y1 = this.snakesonfield[i].snakeBody[j].getY();
                    if (x === x1 && y === y1 && this.snakesonfield[numofsnaketocompare].headColor === this.snakesonfield[i].headColor) return true;
                };
            };
        };
        return false;
    };

    this.isSnake = function (x, y) {
        for (let i = 0; i < this.snakesonfield.length; i++) {
            for (let j = 0; j < this.snakesonfield[i].snakeBody.length; j++) {
                let x1 = this.snakesonfield[i].snakeBody[j].getX();
                let y1 = this.snakesonfield[i].snakeBody[j].getY();
                if (x === x1 && y === y1) return true;
            };
        };
        return false;
    };

    this.isPoison = function (x, y) {
        for (let i = 0; i < this.poison.poisonvolume.length; i++) {
            let x1 = this.poison.poisonvolume[i].getX();
            let y1 = this.poison.poisonvolume[i].getY();
            if (x === x1 && y === y1) return true;
        };
        return false;
    };

    this.killenemy = function (x, y, numofattackingsnake) {
        for (let i = 0; i < this.snakesonfield.length; i++) {
            if (i != numofattackingsnake) {
                for (let j = 0; j < this.snakesonfield[i].snakeBody.length; j++) {
                    let x1 = this.snakesonfield[i].snakeBody[j].getX();
                    let y1 = this.snakesonfield[i].snakeBody[j].getY();
                    if (x === x1 && y === y1) {
                        this.snakesonfield.splice(i, 1);
                        return;
                    };
                };
            };
        };
    };

    this.eatFood = function (x, y) {
        for (let i = 0; i < this.food.foodvolume.length; i++) {
            let x1 = this.food.foodvolume[i].getX();
            let y1 = this.food.foodvolume[i].getY();
            if (x === x1 && y === y1) {
                this.food.foodvolume.splice(i, 1);
                that.eaten++;
                return;
            };
        };
    };

    this.snakepregnantwillborn = function (pregnantsnake, numberofpregnantsnake) {
        let snaketemptobeborn = new SnakeObject(this.startSnakeLength, pregnantsnake.snakeBody[(pregnantsnake.snakeBody.length - 1)].getX(), pregnantsnake.snakeBody[(pregnantsnake.snakeBody.length - 1)].getY(), ((pregnantsnake.snakeDirection + 2 + 4) % 4), pregnantsnake.headColor, pregnantsnake.cellBodysize, pregnantsnake.snakeEyeValues, pregnantsnake.mutations);
        snaketemptobeborn.snakeBody = pregnantsnake.snakeBody.slice(pregnantsnake.snakeBody.length - this.startSnakeLength - 1, );
        snaketemptobeborn.snakeBody.reverse();
        //performing mutation------------------------------------------
        if (that.mutationsOn) {
            let snakeEyeValuesLength = ((2 * that.startwidthofeye + that.eyeDeltaWidth * (that.eyeDepth - 1)) / 2) * that.eyeDepth;
            let countOfMutations = Math.floor(Math.random() * snakeEyeValuesLength);
            for (let i = 0; i < countOfMutations; i++) {
                let pointofmutation = Math.floor(Math.random() * (snakeEyeValuesLength + 1));
                snaketemptobeborn.snakeEyeValues[pointofmutation] = Math.round((snaketemptobeborn.snakeEyeValues[pointofmutation] + snaketemptobeborn.snakeEyeValues[pointofmutation] * ((Math.floor(Math.random() * 5) - 2) / 100)) * 1000) / 1000;
            };
            snaketemptobeborn.mutations += countOfMutations;
        }
        //end mutation------------------------------------------------
        this.snakesonfield.push(snaketemptobeborn);
        pregnantsnake.snakeBody.splice(this.startSnakeLength, (pregnantsnake.snakeBody.length - this.startSnakeLength - 1));
    };

    this.startfight = function () {
        for (let i = 0; i < this.snakesonfield.length; i++) {
            if (this.snakesonfield[i].snakeBody.length >= this.snakefighterlength) {
                return true;
            };
        };
        return false;
    };

    this.eatPoison = function (x, y) {
        for (let i = 0; i < this.poison.poisonvolume.length; i++) {
            let x1 = this.poison.poisonvolume[i].getX();
            let y1 = this.poison.poisonvolume[i].getY();
            if (x === x1 && y === y1) {
                this.poison.poisonvolume.splice(i, 1);
                return;
            };
        };
    };

    this.checkandaddconsumables = function () {
        while (this.poison.poisonvolume.length < this.poisonstartvolume) {
            this.poison.addPoison();
        }
        while (this.food.foodvolume.length < this.foodstartvolume) {
            this.food.addFood();
        }
    };

    this.move = function () {
        if (!this.gameover) {
            for (let ii = 0; ii < this.snakesonfield.length; ii++) {
                let x1 = this.snakesonfield[ii].headX;
                let y1 = this.snakesonfield[ii].headY;
                let dir = this.snakesonfield[ii].calculateDirection(this.snakesonfield[ii], ii);
                if (dir === that.Updir) { y1 = (y1 - this.step + that.gameHeight) % that.gameHeight; };
                if (dir === that.Rightdir) { x1 = (x1 + this.step + that.gameWidth) % that.gameWidth; };
                if (dir === that.Downdir) { y1 = (y1 + this.step + that.gameHeight) % that.gameHeight; };
                if (dir === that.Leftdir) { x1 = (x1 - this.step + that.gameWidth) % that.gameWidth; };
                this.snakesonfield[ii].headX = x1;
                this.snakesonfield[ii].headY = y1;
                if (this.isSnakeItself(x1, y1, ii)) {
                    this.snakesonfield.splice(ii, 1);
                };
                //move snake
                this.snakesonfield[ii].snakeBody.unshift(new PointOfField(x1, y1, this.snakesonfield[ii].headColor));
                if (this.isFood(x1, y1)) {
                    this.eatFood(x1, y1);
                    if (this.snakesonfield[ii].snakeBody.length >= this.maxSnakeLength) {
                        this.snakesonfield[ii].snakeBody = this.snakesonfield[ii].snakeBody.slice(0, -1);
                        this.snakepregnantwillborn(this.snakesonfield[ii], ii);
                    };
                } else {
                    this.snakesonfield[ii].snakeBody = this.snakesonfield[ii].snakeBody.slice(0, -1);
                };
                if (this.isPoison(x1, y1)) {
                    this.eatPoison(x1, y1);
                    this.snakesonfield.splice(ii, 1);
                };
                if (this.isEnemy(x1, y1, ii)) {
                    this.killenemy(x1, y1, ii);
                };
            };
            this.checkandaddconsumables();
            if (this.startfight()) {
                this.fight = -1;
            } else this.fight = 1;
            this.renderpicture();
            this.gameover = this.isgameover();
        };
    };

    this.deepCloneObject = (obj) => {
        let cloneObject = {};
        Object.keys(obj).map(key => {
            if (typeof obj[key] === 'object') {
                cloneObject[key] = deepCloneObject(obj[key]);
            } else { cloneObject[key] = obj[key]; }
        });
        return cloneObject;
    };
    that = this;
};
