mytimeshforid("ppp6565");

function mytimeshforid(wheretoshow) {
    var show_time = document.getElementById(wheretoshow);
    var current_date = new Date();
    var pretty_time = `${String(current_date.getHours()).padStart(2, "0")}:${String(current_date.getMinutes()).padStart(2, "0")}`
    show_time.innerHTML = show_time.innerHTML + pretty_time;
}
/* for (let uuu = 0 ; uuu< 50 ; uuu++){
    console.log((3+Math.floor((Math.floor(Math.random()*2))+4))% 4);
}
 */
// list of buttons event listeners
var operationButtons = document.getElementsByClassName("operation-buttons");
// access to inout fields on web page
var input1 = document.getElementById("input1");
var input2 = document.getElementById("input2");
// bodies of functions listeners
for (let i = 0; i < operationButtons.length; i++) {
    operationButtons[i].addEventListener("click", onButtonclick);
}
// functions to perform manipulations
function onButtonclick(eventObject) {
    var clickdElement = eventObject.currentTarget;
    var whatoperation = clickdElement.innerHTML;
    gameControls(whatoperation);
}
function gameControls(operation) {

    switch (operation) {
        case "Start": that.gameStart(); break;
        case "Pause": that.gamover = !that.gamover; break;
        case "Play": that.continiousgame(); break;
        case "Step": that.move(); break;
    }
    //    document.getElementById("rezultPlace").innerHTML = rezult;
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
        } while (that.isFood(x, y) || that.isSnake(x, y)|| that.isPoison());
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

SnakeObject = function (snlength, snheadX, snheadY, snDir, colorofsnakehead, cellBodysize) {
    this.headColor = colorofsnakehead;
    this.headX = snheadX;
    this.headY = snheadY;
    this.snakeDirection = snDir;
    this.snakeBody = [];
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
                    let eyevalueforcalculation = that.eyevalues[ii];
                    xn1 = (x1 - that.step * j + 1 + that.gameWidth) % that.gameWidth;
                    yn1 = (y1 + that.step * i + that.gameHeight) % that.gameHeight;
                    if (that.isEnemy(xn1, yn1, numofsntocalcdir)) {
                        Snaketocalkdir.leftEyevalue += eyevalueforcalculation * that.fight * that.othersnakevalue;
                    };
                    if (that.isSnakeItself(xn1, yn1, numofsntocalcdir)) {
                        Snaketocalkdir.leftEyevalue += eyevalueforcalculation * that.bodyvalue;
                    };
                    if (that.isFood(xn1, yn1)) {
                        Snaketocalkdir.leftEyevalue += eyevalueforcalculation * that.foodvalue;
                    };
                    if (that.isPoison(xn1, yn1)) {
                        Snaketocalkdir.leftEyevalue += eyevalueforcalculation * that.poisonvalue;
                    };
                    ii++;
                }
            }
            //calculating eyevalues - front eye for left direction
            ii = 0;
            for (let i = 1; i < that.eyeDepth; i++) {
                for (let j = -i; j <= i; j++) {
                    let eyevalueforcalculation = that.eyevalues[ii];
                    xn1 = (x1 - that.step * i + that.gameWidth) % that.gameWidth;
                    yn1 = (y1 - that.step * j + that.gameHeight) % that.gameHeight;
                    if (that.isEnemy(xn1, yn1, numofsntocalcdir)) {
                        Snaketocalkdir.frontEyevalue += eyevalueforcalculation * that.fight * that.othersnakevalue;
                    };
                    if (that.isSnakeItself(xn1, yn1, numofsntocalcdir)) {
                        Snaketocalkdir.frontEyevalue += eyevalueforcalculation * that.bodyvalue;
                    };
                    if (that.isFood(xn1, yn1)) {
                        Snaketocalkdir.frontEyevalue += eyevalueforcalculation * that.foodvalue;
                    };
                    if (that.isPoison(xn1, yn1)) {
                        Snaketocalkdir.frontEyevalue += eyevalueforcalculation * that.poisonvalue;
                    };
                    ii++;
                }
            }
            //calculating eyevalues - right eye for left direction
            ii = 0;
            for (let i = 1; i < that.eyeDepth; i++) {
                for (let j = -i; j <= i; j++) {
                    let eyevalueforcalculation = that.eyevalues[ii];
                    xn1 = (x1 + that.step * j + 1 + that.gameWidth) % that.gameWidth;
                    yn1 = (y1 - that.step * i + that.gameHeight) % that.gameHeight;
                    if (that.isEnemy(xn1, yn1, numofsntocalcdir)) {
                        Snaketocalkdir.rightEyevalue += eyevalueforcalculation * that.fight * that.othersnakevalue;
                    };
                    if (that.isSnakeItself(xn1, yn1, numofsntocalcdir)) {
                        Snaketocalkdir.rightEyevalue += eyevalueforcalculation * that.bodyvalue;
                    };
                    if (that.isFood(xn1, yn1)) {
                        Snaketocalkdir.rightEyevalue += eyevalueforcalculation * that.foodvalue;
                    };
                    if (that.isPoison(xn1, yn1)) {
                        Snaketocalkdir.rightEyevalue += eyevalueforcalculation * that.poisonvalue;
                    };
                    ii++;
                }
            }
            let lYV = Snaketocalkdir.leftEyevalue;
            let fYV = Snaketocalkdir.frontEyevalue;
            let rYV = Snaketocalkdir.rightEyevalue;
            if (lYV === 0 && fYV === 0 && rYV === 0) {
                Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection + (Math.floor(Math.random() * 3) - 1) + 4) % 4;
            }
            if (lYV > fYV && lYV === rYV) {
                let variationofturn = Math.floor(Math.random() * 2);
                if (variationofturn === 0) {
                    Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection - 1 + 4) % 4;
                } else {
                    Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection + 1 + 4) % 4;
                }
            }
            if (fYV > lYV && fYV == rYV) {
                Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection + Math.floor(Math.random() * 2) + 4) % 4;
            }
            if (fYV > rYV && fYV == lYV) {
                Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection - Math.floor(Math.random() * 2) + 4) % 4;
            }
            if (fYV > lYV && fYV > rYV) {
                // without any changes -----------
            }
            if (lYV > fYV && lYV > rYV) {
                Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection - 1 + 4) % 4;
            }
            if (rYV > fYV && rYV > lYV) {
                Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection + 1 + 4) % 4;
            }
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
                    let eyevalueforcalculation = that.eyevalues[ii];
                    xn1 = (x1 - that.step * i + that.gameWidth) % that.gameWidth;
                    yn1 = (y1 - that.step * j + 1 + that.gameHeight) % that.gameHeight;
                    if (that.isEnemy(xn1, yn1, numofsntocalcdir)) {
                        Snaketocalkdir.leftEyevalue += eyevalueforcalculation * that.fight * that.othersnakevalue;
                    };
                    if (that.isSnakeItself(xn1, yn1, numofsntocalcdir)) {
                        Snaketocalkdir.leftEyevalue += eyevalueforcalculation * that.bodyvalue;
                    };
                    if (that.isFood(xn1, yn1)) {
                        Snaketocalkdir.leftEyevalue += eyevalueforcalculation * that.foodvalue;
                    };
                    if (that.isPoison(xn1, yn1)) {
                        Snaketocalkdir.leftEyevalue += eyevalueforcalculation * that.poisonvalue;
                    };
                    ii++;
                }
            }
            //calculating eyevalues - front eye for up direction
            ii = 0;
            for (let i = 1; i < that.eyeDepth; i++) {
                for (let j = -i; j <= i; j++) {
                    let eyevalueforcalculation = that.eyevalues[ii];
                    xn1 = (x1 + that.step * j + that.gameWidth) % that.gameWidth;
                    yn1 = (y1 - that.step * i + that.gameHeight) % that.gameHeight;
                    if (that.isEnemy(xn1, yn1, numofsntocalcdir)) {
                        Snaketocalkdir.frontEyevalue += eyevalueforcalculation * that.fight * that.othersnakevalue;
                    };
                    if (that.isSnakeItself(xn1, yn1, numofsntocalcdir)) {
                        Snaketocalkdir.frontEyevalue += eyevalueforcalculation * that.bodyvalue;
                    };
                    if (that.isFood(xn1, yn1)) {
                        Snaketocalkdir.frontEyevalue += eyevalueforcalculation * that.foodvalue;
                    };
                    if (that.isPoison(xn1, yn1)) {
                        Snaketocalkdir.frontEyevalue += eyevalueforcalculation * that.poisonvalue;
                    };
                    ii++;
                }
            }
            //calculating eyevalues - right eye for up direction
            ii = 0;
            for (let i = 1; i < that.eyeDepth; i++) {
                for (let j = -i; j <= i; j++) {
                    let eyevalueforcalculation = that.eyevalues[ii];
                    xn1 = (x1 + that.step * i + that.gameWidth) % that.gameWidth;
                    yn1 = (y1 + that.step * j + 1 + that.gameHeight) % that.gameHeight;
                    if (that.isEnemy(xn1, yn1, numofsntocalcdir)) {
                        Snaketocalkdir.rightEyevalue += eyevalueforcalculation * that.fight * that.othersnakevalue;
                    };
                    if (that.isSnakeItself(xn1, yn1, numofsntocalcdir)) {
                        Snaketocalkdir.rightEyevalue += eyevalueforcalculation * that.bodyvalue;
                    };
                    if (that.isFood(xn1, yn1)) {
                        Snaketocalkdir.rightEyevalue += eyevalueforcalculation * that.foodvalue;
                    };
                    if (that.isPoison(xn1, yn1)) {
                        Snaketocalkdir.rightEyevalue += eyevalueforcalculation * that.poisonvalue;
                    };
                    ii++;
                }
            }
            let lYV = Snaketocalkdir.leftEyevalue;
            let fYV = Snaketocalkdir.frontEyevalue;
            let rYV = Snaketocalkdir.rightEyevalue;
            if (lYV === 0 && fYV === 0 && rYV === 0) {
                Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection + (Math.floor(Math.random() * 3) - 1) + 4) % 4;
            }
            if (lYV > fYV && lYV === rYV) {
                let variationofturn = Math.floor(Math.random() * 2);
                if (variationofturn === 0) {
                    Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection - 1 + 4) % 4;
                } else {
                    Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection + 1 + 4) % 4;
                }
            }
            if (fYV > lYV && fYV == rYV) {
                Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection + Math.floor(Math.random() * 2) + 4) % 4;
            }
            if (fYV > rYV && fYV == lYV) {
                Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection - Math.floor(Math.random() * 2) + 4) % 4;
            }
            if (fYV > lYV && fYV > rYV) {
                // without any changes -----------
            }
            if (lYV > fYV && lYV > rYV) {
                Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection - 1 + 4) % 4;
            }
            if (rYV > fYV && rYV > lYV) {
                Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection + 1 + 4) % 4;
            }
            if (that.showmessages) {
                console.log("Snake: " + numofsntocalcdir + " Left Eye: " + Snaketocalkdir.leftEyevalue + " Front Eye: " + Snaketocalkdir.frontEyevalue + " Right Eye: " + Snaketocalkdir.rightEyevalue + " Direction: " + Snaketocalkdir.snakeDirection);
            }
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
                    let eyevalueforcalculation = that.eyevalues[ii];
                    xn1 = (x1 + that.step * j - 1 + that.gameWidth) % that.gameWidth;
                    yn1 = (y1 - that.step * i + that.gameHeight) % that.gameHeight;
                    if (that.isEnemy(xn1, yn1, numofsntocalcdir)) {
                        Snaketocalkdir.leftEyevalue += eyevalueforcalculation * that.fight * that.othersnakevalue;
                    };
                    if (that.isSnakeItself(xn1, yn1, numofsntocalcdir)) {
                        Snaketocalkdir.leftEyevalue += eyevalueforcalculation * that.bodyvalue;
                    };
                    if (that.isFood(xn1, yn1)) {
                        Snaketocalkdir.leftEyevalue += eyevalueforcalculation * that.foodvalue;
                    };
                    if (that.isPoison(xn1, yn1)) {
                        Snaketocalkdir.leftEyevalue += eyevalueforcalculation * that.poisonvalue;
                    };
                    ii++;
                }
            }
            //calculating eyevalues - front eye for right direction
            ii = 0;
            for (let i = 1; i < that.eyeDepth; i++) {
                for (let j = -i; j <= i; j++) {
                    let eyevalueforcalculation = that.eyevalues[ii];
                    xn1 = (x1 + that.step * i + that.gameWidth) % that.gameWidth;
                    yn1 = (y1 + that.step * j + that.gameHeight) % that.gameHeight;
                    if (that.isEnemy(xn1, yn1, numofsntocalcdir)) {
                        Snaketocalkdir.frontEyevalue += eyevalueforcalculation * that.fight * that.othersnakevalue;
                    };
                    if (that.isSnakeItself(xn1, yn1, numofsntocalcdir)) {
                        Snaketocalkdir.frontEyevalue += eyevalueforcalculation * that.bodyvalue;
                    };
                    if (that.isFood(xn1, yn1)) {
                        Snaketocalkdir.frontEyevalue += eyevalueforcalculation * that.foodvalue;
                    };
                    if (that.isPoison(xn1, yn1)) {
                        Snaketocalkdir.frontEyevalue += eyevalueforcalculation * that.poisonvalue;
                    };
                    ii++;
                }
            }
            //calculating eyevalues - right eye for right direction
            ii = 0;
            for (let i = 1; i < that.eyeDepth; i++) {
                for (let j = -i; j <= i; j++) {
                    let eyevalueforcalculation = that.eyevalues[ii];
                    xn1 = (x1 - that.step * j - 1 + that.gameWidth) % that.gameWidth;
                    yn1 = (y1 + that.step * i + that.gameHeight) % that.gameHeight;
                    if (that.isEnemy(xn1, yn1, numofsntocalcdir)) {
                        Snaketocalkdir.rightEyevalue += eyevalueforcalculation * that.fight * that.othersnakevalue;
                    };
                    if (that.isSnakeItself(xn1, yn1, numofsntocalcdir)) {
                        Snaketocalkdir.rightEyevalue += eyevalueforcalculation * that.bodyvalue;
                    };
                    if (that.isFood(xn1, yn1)) {
                        Snaketocalkdir.rightEyevalue += eyevalueforcalculation * that.foodvalue;
                    };
                    if (that.isPoison(xn1, yn1)) {
                        Snaketocalkdir.rightEyevalue += eyevalueforcalculation * that.poisonvalue;
                    };
                    ii++;
                }
            }
            let lYV = Snaketocalkdir.leftEyevalue;
            let fYV = Snaketocalkdir.frontEyevalue;
            let rYV = Snaketocalkdir.rightEyevalue;
            if (lYV === 0 && fYV === 0 && rYV === 0) {
                Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection + (Math.floor(Math.random() * 3) - 1) + 4) % 4;
            }
            if (lYV > fYV && lYV === rYV) {
                let variationofturn = Math.floor(Math.random() * 2);
                if (variationofturn === 0) {
                    Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection - 1 + 4) % 4;
                } else {
                    Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection + 1 + 4) % 4;
                }
            }
            if (fYV > lYV && fYV == rYV) {
                Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection + Math.floor(Math.random() * 2) + 4) % 4;
            }
            if (fYV > rYV && fYV == lYV) {
                Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection - Math.floor(Math.random() * 2) + 4) % 4;
            }
            if (fYV > lYV && fYV > rYV) {
                // without any changes -----------
            }
            if (lYV > fYV && lYV > rYV) {
                Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection - 1 + 4) % 4;
            }
            if (rYV > fYV && rYV > lYV) {
                Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection + 1 + 4) % 4;
            }
            if (that.showmessages) {
                console.log("Snake: " + numofsntocalcdir + " Left Eye: " + Snaketocalkdir.leftEyevalue + " Front Eye: " + Snaketocalkdir.frontEyevalue + " Right Eye: " + Snaketocalkdir.rightEyevalue + " Direction: " + Snaketocalkdir.snakeDirection);
            }
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
                    let eyevalueforcalculation = that.eyevalues[ii];
                    xn1 = (x1 + that.step * i + that.gameWidth) % that.gameWidth;
                    yn1 = (y1 + that.step * j - 1 + that.gameHeight) % that.gameHeight;
                    if (that.isEnemy(xn1, yn1, numofsntocalcdir)) {
                        Snaketocalkdir.leftEyevalue += eyevalueforcalculation * that.fight * that.othersnakevalue;
                    };
                    if (that.isSnakeItself(xn1, yn1, numofsntocalcdir)) {
                        Snaketocalkdir.leftEyevalue += eyevalueforcalculation * that.bodyvalue;
                    };
                    if (that.isFood(xn1, yn1)) {
                        Snaketocalkdir.leftEyevalue += eyevalueforcalculation * that.foodvalue;
                    };
                    if (that.isPoison(xn1, yn1)) {
                        Snaketocalkdir.leftEyevalue += eyevalueforcalculation * that.poisonvalue;
                    };
                    ii++;
                }
            }
            //calculating eyevalues - front eye for down direction
            ii = 0;
            for (let i = 1; i < that.eyeDepth; i++) {
                for (let j = -i; j <= i; j++) {
                    let eyevalueforcalculation = that.eyevalues[ii];
                    xn1 = (x1 - that.step * j + that.gameWidth) % that.gameWidth;
                    yn1 = (y1 + that.step * i + that.gameHeight) % that.gameHeight;
                    if (that.isEnemy(xn1, yn1, numofsntocalcdir)) {
                        Snaketocalkdir.frontEyevalue += eyevalueforcalculation * that.fight * that.othersnakevalue;
                    };
                    if (that.isSnakeItself(xn1, yn1, numofsntocalcdir)) {
                        Snaketocalkdir.frontEyevalue += eyevalueforcalculation * that.bodyvalue;
                    };
                    if (that.isFood(xn1, yn1)) {
                        Snaketocalkdir.frontEyevalue += eyevalueforcalculation * that.foodvalue;
                    };
                    if (that.isPoison(xn1, yn1)) {
                        Snaketocalkdir.frontEyevalue += eyevalueforcalculation * that.poisonvalue;
                    };
                    ii++;
                }
            }
            //calculating eyevalues - right eye for down direction
            ii = 0;
            for (let i = 1; i < that.eyeDepth; i++) {
                for (let j = -i; j <= i; j++) {
                    let eyevalueforcalculation = that.eyevalues[ii];
                    xn1 = (x1 - that.step * i + that.gameWidth) % that.gameWidth;
                    yn1 = (y1 - that.step * j - 1 + that.gameHeight) % that.gameHeight;
                    if (that.isEnemy(xn1, yn1, numofsntocalcdir)) {
                        Snaketocalkdir.rightEyevalue += eyevalueforcalculation * that.fight * that.othersnakevalue;
                    };
                    if (that.isSnakeItself(xn1, yn1, numofsntocalcdir)) {
                        Snaketocalkdir.rightEyevalue += eyevalueforcalculation * that.bodyvalue;
                    };
                    if (that.isFood(xn1, yn1)) {
                        Snaketocalkdir.rightEyevalue += eyevalueforcalculation * that.foodvalue;
                    };
                    if (that.isPoison(xn1, yn1)) {
                        Snaketocalkdir.rightEyevalue += eyevalueforcalculation * that.poisonvalue;
                    };
                    ii++;
                }
            }
            let lYV = Snaketocalkdir.leftEyevalue;
            let fYV = Snaketocalkdir.frontEyevalue;
            let rYV = Snaketocalkdir.rightEyevalue;
            if (lYV === 0 && fYV === 0 && rYV === 0) {
                Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection + (Math.floor(Math.random() * 3) - 1) + 4) % 4;
            }
            if (lYV > fYV && lYV === rYV) {
                let variationofturn = Math.floor(Math.random() * 2);
                if (variationofturn === 0) {
                    Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection - 1 + 4) % 4;
                } else {
                    Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection + 1 + 4) % 4;
                }
            }
            if (fYV > lYV && fYV == rYV) {
                Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection + Math.floor(Math.random() * 2) + 4) % 4;
            }
            if (fYV > rYV && fYV == lYV) {
                Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection - Math.floor(Math.random() * 2) + 4) % 4;
            }
            if (fYV > lYV && fYV > rYV) {
                // without any changes -----------
            }
            if (lYV > fYV && lYV > rYV) {
                Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection - 1 + 4) % 4;
            }
            if (rYV > fYV && rYV > lYV) {
                Snaketocalkdir.snakeDirection = (Snaketocalkdir.snakeDirection + 1 + 4) % 4;
            }
            if (that.showmessages) {
                console.log("Snake: " + numofsntocalcdir + " Left Eye: " + Snaketocalkdir.leftEyevalue + " Front Eye: " + Snaketocalkdir.frontEyevalue + " Right Eye: " + Snaketocalkdir.rightEyevalue + " Direction: " + Snaketocalkdir.snakeDirection);
            }
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
    this.showmessages = false;
    this.gamover = false;
    this.step = 1;
    this.eaten = 0;
    this.foodvalue = 100;
    this.poisonvalue = -100;
    this.bodyvalue = -100;
    this.gamepause = 100;
    this.snakefighterlength = 19;
    this.foodstartvolume = 100;
    this.poisonstartvolume = 10;
    this.othersnakevalue = - 100;
    this.fight = 1;
    this.startDirection = 2;
    this.startHeadColor = "rgb(100,100,100)";
    this.startQuantityOfSnakes = 10;
    this.snakesonfield = [];
    this.eyevalues = [0.707, 1.0, 0.707, 0.353, 0.447, 0.5, 0.447, 0.353, 0.235, 0.277, 0.316, 0.333, 0.316, 0.277, 0.235, 0.176, 0.2, 0.223, 0.242, 0.25, 0.242, 0.223, 0.2, 0.176, 0.141, 0.156, 0.171, 0.185, 0.196, 0.2, 0.196, 0.185, 0.171, 0.156, 0.141, 0.117, 0.128, 0.138, 0.149, 0.158, 0.164, 0.166, 0.164, 0.158, 0.149, 0.138, 0.128, 0.117, 0.101, 0.108, 0.116, 0.124, 0.131, 0.137, 0.141, 0.142, 0.141, 0.137, 0.131, 0.124, 0.116, 0.108, 0.101, 0.088, 0.094, 0.1, 0.105, 0.111, 0.117, 0.121, 0.124, 0.125, 0.124, 0.121, 0.117, 0.111, 0.105, 0.1, 0.094, 0.088, 0.078, 0.083, 0.087, 0.092, 0.097, 0.101, 0.105, 0.108, 0.11, 0.111, 0.11, 0.108, 0.105, 0.101, 0.097, 0.092, 0.087, 0.083, 0.078, 0.07, 0.074, 0.078, 0.081, 0.085, 0.089, 0.092, 0.095, 0.098, 0.099, 0.1, 0.099, 0.098, 0.095, 0.092, 0.089, 0.085, 0.081, 0.078, 0.074, 0.07, 0.064, 0.067, 0.07, 0.073, 0.076, 0.079, 0.082, 0.085, 0.087, 0.089, 0.09, 0.09, 0.09, 0.089, 0.087, 0.085, 0.082, 0.079, 0.076, 0.073, 0.07, 0.067, 0.064, 0.058, 0.061, 0.064, 0.066, 0.069, 0.071, 0.074, 0.076, 0.079, 0.08, 0.082, 0.083, 0.083, 0.083, 0.082, 0.08, 0.079, 0.076, 0.074, 0.071, 0.069, 0.066, 0.064, 0.061, 0.058, 0.054, 0.056, 0.058, 0.06, 0.063, 0.065, 0.067, 0.069, 0.071, 0.073, 0.074, 0.076, 0.076, 0.076, 0.076, 0.076, 0.074, 0.073, 0.071, 0.069, 0.067, 0.065, 0.063, 0.06, 0.058, 0.056, 0.054, 0.05, 0.052, 0.054, 0.056, 0.058, 0.06, 0.062, 0.063, 0.065, 0.067, 0.068, 0.069, 0.07, 0.071, 0.071, 0.071, 0.07, 0.069, 0.068, 0.067, 0.065, 0.063, 0.062, 0.06, 0.058, 0.056, 0.054, 0.052, 0.05, 0.047, 0.048, 0.05, 0.052, 0.053, 0.055, 0.057, 0.058, 0.06, 0.061, 0.063, 0.064, 0.065, 0.066, 0.066, 0.066, 0.066, 0.066, 0.065, 0.064, 0.063, 0.061, 0.06, 0.058, 0.057, 0.055, 0.053, 0.052, 0.05, 0.048, 0.047];

    this.gameStart = function () {
        let fillColor = null;
        let x1 = this.startX;
        let y1 = this.startY;
        document.getElementById('rezultPlace').innerHTML = "0 <br> Peace"
        this.startQuantityOfSnakes = Number(document.getElementById('input1').value);
        this.gamepause = (Math.floor(10000 / Number(document.getElementById('input2').value)) < 20) ? 20 : Math.floor(10000 / Number(document.getElementById('input2').value));
        this.food = new food();
        this.poison = new poison();
        this.food.foodvolume=[];
        this.poison.poisonvolume=[];
        this.checkandaddsnakes();
        this.checkandaddconsumables();
        this.renderpicture();
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
                my_gradient = ctx.createRadialGradient(x1, y1, 1, x1, y1, radiusofSnakebodysegment)
                my_gradient.addColorStop(0, this.snakesonfield[ii].headColor);
                my_gradient.addColorStop(1, "white");
                ctx.fillStyle = my_gradient;
                ctx.beginPath();
                ctx.arc(x1, y1, radiusofSnakebodysegment, 0, 2 * Math.PI, true);
                ctx.fill();
            }
        }
        //food
        for (let i = 0; i < this.food.foodvolume.length; i++) {
            let x1 = this.food.foodvolume[i].getX() * this.food.radiusoffoodportion;
            let y1 = this.food.foodvolume[i].getY() * this.food.radiusoffoodportion;
            let radiusoffoodsegment = Math.floor((this.food.radiusoffoodportion - 2) / 2);
            let my_gradient = null;
            my_gradient = ctx.createRadialGradient(x1, y1, 1, x1, y1, radiusoffoodsegment)
            my_gradient.addColorStop(0, this.food.foodcolor);
            my_gradient.addColorStop(1, "white");
            ctx.fillStyle = my_gradient;
            ctx.beginPath();
            ctx.arc(x1, y1, radiusoffoodsegment, 0, 2 * Math.PI, true);
            ctx.fill();
        };
        //poison
        for (let i = 0; i < this.poison.poisonvolume.length; i++) {
            let x1 = this.poison.poisonvolume[i].getX() * this.poison.radiusofpoisonportion;
            let y1 = this.poison.poisonvolume[i].getY() * this.poison.radiusofpoisonportion;
            let radiusofpoisonsegment = Math.floor((this.poison.radiusofpoisonportion - 2) / 2);
            let my_gradient = null;
            my_gradient = ctx.createRadialGradient(x1, y1, 1, x1, y1, radiusofpoisonsegment)
            my_gradient.addColorStop(0, this.poison.poisonColor);
            my_gradient.addColorStop(1, "white");
            ctx.fillStyle = my_gradient;
            ctx.beginPath();
            ctx.arc(x1, y1, radiusofpoisonsegment, 0, 2 * Math.PI, true);
            ctx.fill();
        };
        //game subtotals and other results on web page
        document.getElementById('rezultPlace').innerHTML = "" + this.eaten + ((this.fight === 1) ? "<br>Peace" : "<br>Fight");
    };

    this.continiousgame = function () {
        setInterval(() => {
            this.move();
        }, this.gamepause);
    };
    
    this.checkandaddsnakes = function () {
        while (this.snakesonfield.length < this.startQuantityOfSnakes) {
            let fillColor = 'rgb(' + (1+Math.floor(Math.random() * 255)) + ',' + (1+Math.floor(Math.random() * 255)) + ',' + (1+Math.floor(Math.random() * 255)) + ')';
//            let fillColor = 'rgb(' + 1 + ',' + 200 + ',' + 1 + ')';

            let x = 0;
            let y = 0;
            do {
                x = Math.floor(Math.random() * that.gameWidth);
                y = Math.floor(Math.random() * that.gameHeight);
            } while (that.isFood(x, y) || that.isSnake(x, y) || that.isPoison(x, y));
            this.snakesonfield.push(new SnakeObject(this.startSnakeLength, x, y, this.startDirection, fillColor, this.cellsize));
            this.snakesonfield[(this.snakesonfield.length - 1)].generateBody();
        };
    }

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
                    if (x === x1 && y === y1) return true;
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
        if (!this.gamover) {
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
            this.checkandaddsnakes();
            if (this.startfight()) {
                this.fight = -1;
            } else this.fight = 1;
            this.renderpicture()
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

let NewSnakeGame = new gameManager();
