/*
 * conwaylife.js
 * Copyright (C) 2016  Jared M Ashcraft
 *
 * Distributed under terms of the MIT license.
 */

'use strict';

/**
 * Simulation of John Conway's Game of Life
 *
 */ 
var ConwayLife = function(n) {
    this.n = n;
    this.renderFlag = 0;
    this.incSpeed = 1000;
    this.maxSpeed = 2000;
    this.stamps = {
        Glider: [[0,1],[1,2],[2,0],[2,1],[2,2]],
        SmallExploder: [[0,1],[1,0],[1,1],[1,2],[2,0],[2,2],[3,1]],
        BigExploder: [[0,0],[0,2],[0,4],[1,0],[1,4],[2,0],[2,4],[3,0],[3,4],[4,0],[4,2],[4,4]],
        TenCellRow: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9]],
        LightSpaceShip: [[0,1],[0,2],[0,3],[0,4],[1,0],[1,4],[2,4],[3,0],[3,3]],
        Tumbler: [[0,1],[0,2],[0,4],[0,5],[1,1],[1,2],[1,4],[1,5],[2,2],[2,4],[3,0],[3,2],[3,4],[3,6],[4,0],[4,2],[4,4],[4,6],[5,0],[5,1],[5,5],[5,6]],
    };
    this.runFlag = false;
    this.timer = setInterval(this.run.bind(this), this.incSpeed);
    this.grid = (function() {
        var g = [];
        var gg = [];
        for (var i = 0; i < n; i++) {
            gg = [];
            for (var j = 0; j < n; j++) {
                gg.push(false);
            }
            g.push(gg);
        } 
        return g;
    })();
} 

/**
 * Sets the cell at board position (x, y) to Boolean value
 * true or false (to simulate alive/dead states).
 *
 * @param x - x coordinate of cell
 * @param y - y coordinate of cell
 * @param b - Boolean value to set cell
 */
ConwayLife.prototype.setCell = function(x, y, b) {
    this.grid[x][y] = b;  
    this.updateBoard();
}

/**
 * Toggles the cell at board position (x, y) to the opposite
 * of its current value.
 *
 * @param x - x coordinate of cell
 * @param y - y coordinate of cell
 */
ConwayLife.prototype.toggleCell = function(x, y) {
    if (this.grid[x][y]) {
        this.grid[x][y] = false;
    } else {
        this.grid[x][y] = true;
    }
    this.updateBoard();
}

/**
 * Stamps a pattern of cells onto the grid. The patterns are
 * kept in a two-dimensional array, with each inner array being
 * a pair of coordinates.
 *
 * @param x - the x coordinate of the stamp, located in the upper-left
 *            hand corner of the stamp's footprint.
 * @param y - the y coordinate of the stamp, located in the upper-left
 *            hand corner of the stamp's footprint.
 */
ConwayLife.prototype.stampCells = function(x, y) {
    var selected = document.getElementById("stampMenu");
    var coords = this.stamps[selected.options[selected.selectedIndex].value];
    for (var i = 0; i < coords.length; i++) {
        this.grid[x+coords[i][0]][y+coords[i][1]] = true; 
    } 
    this.updateBoard();
}

/**
 * Displays the grid to the console. This is the grid that the board
 * reads from in order to update. Useful for debugging purposes.
 */
ConwayLife.prototype.getGrid = function() {
    var gridStr = '\n';
    for (var i = 0; i < this.grid.length; i++) {
        for ( var j = 0; j < this.grid[i].length; j++) {
            if (this.grid[i][j]) gridStr += '[*]';
            else gridStr += '[ ]';
        }
        gridStr += '\n';
    }
    return gridStr;
}

/**
 * Randomizes the board's cells. Each cell has a 50/50 shot at being
 * either alive or dead. Can produce interesting patterns when run.
 */
ConwayLife.prototype.randomizeBoard = function() {
    for (var i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid[i].length; j++) {
            var rando = Math.floor(Math.random()*2);
            if (rando === 0) this.grid[i][j] = false;
            if (rando === 1) this.grid[i][j] = true;
        }
    }
    this.updateBoard();
}

/**
 * Initial rendering of the board. This function should only be
 * called ONCE in order to populate the DOM with the appropriate
 * elements. All other changes to the board should be handled
 * using other methods.
 */
ConwayLife.prototype.renderBoard = function() {
    var table = document.createElement("table");
    table.setAttribute("id", "lifeBoard");
    document.body.appendChild(table);
    for (var i = 0; i < this.grid.length; i++) {
        var tr = document.createElement("tr");
        tr.setAttribute("id", "r_" + i);
        for (var j = 0; j < this.grid[i].length; j++) {
            var td = document.createElement("td"); 
            td.setAttribute("id", i + "_" + j);
            var isDown = false;
            document.onmousedown = (function() { 
                isDown = true;
            });
            document.onmouseup = (function() {
                isDown = false;
            });
            td.onmousedown = (function(obj, i, j) {
                return function() {
                    var radioButtons = document.getElementsByName("fillOptions");
                    if (radioButtons[0].checked) { 
                            obj.setCell(i, j, true);
                    }
                    if (radioButtons[1].checked) {
                            obj.toggleCell(i, j);
                    }
                    if (radioButtons[2].checked) {
                            obj.setCell(i, j, false);
                    }
                    if (radioButtons[3].checked) {
                            obj.stampCells(i, j);
                    }
                }
            })(this, i, j);
            td.onmouseover = (function(obj, i, j) {
                return function() {
                    var radioButtons = document.getElementsByName("fillOptions");
                    if (radioButtons[0].checked) { 
                        if (isDown) {
                            obj.setCell(i, j, true);
                        }
                    }
                    if (radioButtons[1].checked) {
                        if (isDown) {
                            obj.toggleCell(i, j);
                        }
                    }
                    if (radioButtons[2].checked) {
                        if (isDown) {
                            obj.setCell(i, j, false);
                        }
                    }
                    if (radioButtons[3].checked) {
                        if (isDown) {
                            obj.stampCells(i, j);
                        }
                    }
                    console.log(i, j);
                } 
            })(this, i, j);
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    // Establish outer menu div
    var menuDiv = document.createElement("div");
    menuDiv.setAttribute("id", "menu");
    document.body.appendChild(menuDiv);
    // Establish inner div for buttons
    var buttonMenuDiv = document.createElement("div");
    buttonMenuDiv.setAttribute("id", "buttonMenu");
    menuDiv.appendChild(buttonMenuDiv);
    var runButton = document.createElement("button");
    runButton.setAttribute("id", "runButton");
    (this.runFlag) ? runButton.innerHTML = "Stop" : runButton.innerHTML = "Run";
    runButton.onclick = (function(obj) {
        return function() {
            var runButton = document.getElementById("runButton");
            (obj.runFlag) ? runButton.innerHTML = "Run" : runButton.innerHTML = "Stop";
            (obj.runFlag) ? runButton.style.background = "green" : runButton.style.background = "red";
            (!obj.runFlag) ? obj.runFlag = true : obj.runFlag = false;
            obj.run();
        } 
    })(this);
    buttonMenuDiv.appendChild(runButton);
    var nextButton = document.createElement("button");
    nextButton.setAttribute("id", "nextButton");
    nextButton.innerHTML = "Next";
    nextButton.onclick = (function(obj) {
        return function() {
            obj.next();
        } 
    })(this);
    buttonMenuDiv.appendChild(nextButton);
    var resetButton = document.createElement("button");
    resetButton.setAttribute("id", "resetButton");
    resetButton.innerHTML = "Reset";
    resetButton.onclick = (function(obj) {
        return function() {
            obj.resetBoard();
        }
    })(this);
    buttonMenuDiv.appendChild(resetButton);
    var randomizeButton = document.createElement("button");
    randomizeButton.setAttribute("id", "randomizeButton");
    randomizeButton.innerHTML = "Randomize";
    randomizeButton.onclick = (function(obj) {
        return function() {
            obj.randomizeBoard();
        } 
    })(this);
    buttonMenuDiv.appendChild(randomizeButton);
    // Establish inner div for brush options
    var brushMenu = document.createElement("div");
    brushMenu.setAttribute("id", "brushMenu");
    menuDiv.appendChild(brushMenu);
    var togglePaintInput = document.createElement("input");
    togglePaintInput.setAttribute("id", "togglePaint");
    togglePaintInput.setAttribute("type", "radio");
    togglePaintInput.setAttribute("name", "fillOptions");
    togglePaintInput.checked = true;
    brushMenu.appendChild(togglePaintInput);
    var togglePaintLabel = document.createElement("label");
    togglePaintLabel.setAttribute("for", "togglePaint");
    togglePaintLabel.innerHTML = "Paint";
    brushMenu.appendChild(togglePaintLabel);
    var toggleToggleInput = document.createElement("input");
    toggleToggleInput.setAttribute("id", "toggleToggle");
    toggleToggleInput.setAttribute("type", "radio");
    toggleToggleInput.setAttribute("name", "fillOptions");
    brushMenu.appendChild(toggleToggleInput);
    var toggleToggleLabel = document.createElement("label");
    toggleToggleLabel.setAttribute("for", "toggleToggle");
    toggleToggleLabel.innerHTML = "Toggle";
    brushMenu.appendChild(toggleToggleLabel);
    var toggleClearInput = document.createElement("input");
    toggleClearInput.setAttribute("id", "toggleClear");
    toggleClearInput.setAttribute("type", "radio");
    toggleClearInput.setAttribute("name", "fillOptions");
    brushMenu.appendChild(toggleClearInput);
    var toggleClearLabel = document.createElement("label");
    toggleClearLabel.setAttribute("for", "toggleClear");
    toggleClearLabel.innerHTML = "Clear";
    brushMenu.appendChild(toggleClearLabel);
    var toggleStampInput = document.createElement("input");
    toggleStampInput.setAttribute("id", "toggleStamp");
    toggleStampInput.setAttribute("type", "radio");
    toggleStampInput.setAttribute("name", "fillOptions");
    brushMenu.appendChild(toggleStampInput);
    var toggleStampLabel = document.createElement("label");
    toggleStampLabel.setAttribute("for", "toggleStamp");
    toggleStampLabel.innerHTML = "Stamp";
    brushMenu.appendChild(toggleStampLabel);
    var stampMenuSelect = document.createElement("select");
    stampMenuSelect.setAttribute("id", "stampMenu");
    stampMenuSelect.setAttribute("name", "stamps");
    stampMenuSelect.onchange = function() { toggleStampInput.checked = true; };
    for (var k in this.stamps) {
        var option = document.createElement("option");
        option.setAttribute("value", k);
        option.innerHTML = k;
        stampMenuSelect.appendChild(option);
    }
    brushMenu.appendChild(stampMenuSelect);
    var otherOptionsMenuDiv = document.createElement("div");
    otherOptionsMenuDiv.setAttribute("id", "otherOptionsMenu");
    menuDiv.appendChild(otherOptionsMenuDiv);
    var speedSliderLabel = document.createElement("label");
    speedSliderLabel.innerHTML = "Speed: ";
    speedSliderLabel.setAttribute("for", "speedSlider");
    otherOptionsMenuDiv.appendChild(speedSliderLabel);
    var speedSliderInput = document.createElement("input");
    speedSliderInput.setAttribute("id", "speedSlider");
    speedSliderInput.setAttribute("type", "range");
    speedSliderInput.setAttribute("min", "100");
    speedSliderInput.setAttribute("max", "2000");
    speedSliderInput.setAttribute("value", "1000");
    speedSliderInput.setAttribute("step", "100");
    otherOptionsMenuDiv.appendChild(speedSliderInput);
    speedSliderInput.onchange = (function(obj) {
        return function() {
            console.log("slider change occurred");
            var speedSlider = document.getElementById("speedSlider");
            obj.incSpeed = (obj.maxSpeed+100) - speedSlider.value; 
            obj.stop();
            obj.run();
        }
    })(this);
    this.renderFlag = 1;
}

/**
 * Reads from the grid array and changes the td class attributes to either "alive" or "dead"
 * and changes their color accordingly.
 */
ConwayLife.prototype.updateBoard = function() {
    if (this.renderFlag !== 1) return console.error("Error: Board has not been rendered yet.");
    for (var i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid.length; j++) {
            var cell = document.getElementById(i + "_" + j);
            if (this.grid[i][j]) cell.setAttribute("class", "alive");
            if (!this.grid[i][j]) cell.setAttribute("class", "dead");
        }
    } 
}

/**
 * Moves the board forward one iteration and updates the board.
 */
ConwayLife.prototype.next = function() {
    this.step();
    this.updateBoard();
}

/**
 * Checks to see if the simulation is running. If it isn't, calls the stop
 * method which clears the timer interval. Otherwise, the timer sets the 
 * interval back up again.
 */
ConwayLife.prototype.run = function() {
    if (!this.runFlag) {
        this.stop();
    } else {
        this.timer = setInterval(this.next.bind(this), this.incSpeed);
    }
}

/**
 * Stops the simulation by clearing the timer's interval id.
 */
ConwayLife.prototype.stop = function() {
    clearInterval(this.timer); 
}

/**
 * Resets all cells to false (dead). Mass extinction!
 */
ConwayLife.prototype.resetBoard = function() {
    for (var i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid.length; j++) {
            this.grid[i][j] = false;
        }
    }
    this.updateBoard();
}

/** 
 * Iterates the simulation one step forward. It's important to note
 * that any changes that take place to the grid have to be made to a
 * copy of the original grid, or else each individual change to the grid
 * will have a cascading effect throughout the rest of the algorithm. The
 * copy grid is fed back into the original grid at the end.
 */ 
ConwayLife.prototype.step = function() {
    var gridCpy = [];
    var gridCpyy = [];
    for (var i = 0; i < this.grid.length; i++) {
        gridCpyy = [];
        for (var j = 0; j < this.grid[i].length; j++) {
            gridCpyy.push(this.grid[i][j]); 
        }
        gridCpy.push(gridCpyy);
    }
    for (var i = 0; i < this.grid.length; i++) {
        for (var j = 0; j < this.grid[i].length; j++) {
            var count = 0;
            // top left
            if (!(i-1 < 0) && !(j-1 < 0)) {
                //console.log("this.grid["+ (i-1) + "][" + (j-1) + "]");
                if (this.grid[i-1][j-1]) count++; 
            }
            // top
            if (!(i-1 < 0)) {
                if (this.grid[i-1][j]) count++;
            }
            // top right
            if (!(i-1 < 0) && !(j+1 > this.grid[i].length-1)) {
                if (this.grid[i-1][j+1]) count++;
            }
            // left
            if (!(j-1 < 0)) {
                if (this.grid[i][j-1]) count++;
            }
            // right
            if (!(j+1 > this.grid[i].length-1)) {
                if (this.grid[i][j+1]) count++;
            }
            // bottom left
            if (!(i+1 > this.grid.length-1) && !(j-1 < 0)) {
                if (this.grid[i+1][j-1]) count++;
            }
            // bottom
            if (!(i+1 > this.grid.length-1)) {
                if (this.grid[i+1][j]) count++;
            }
            // bottom right
            if (!(i+1 > this.grid.length-1) && !(j+1 > this.grid[i].length-1)) {
                if (this.grid[i+1][j+1]) count++;
            }
            // Any live cell with fewer than two live neighbours dies, 
            // as if caused by under-population.
            if (this.grid[i][j]) {
                if (count < 2) {
                    gridCpy[i][j] = false; // cell dies
                    continue;
                }
            }
            // Any live cell with two or three live neighbours lives on 
            // to the next generation.
            if (this.grid[i][j]) {
                if ((count === 2) || (count === 3)) { continue; } // cell lives
            }
            // Any live cell with more than three live neighbours dies, 
            // as if by over-population.         
            if (this.grid[i][j]) {
                if (count > 3) {
                    gridCpy[i][j] = false; // cell dies
                    continue;
                }
            }
            // Any dead cell with exactly three live neighbours becomes 
            // a live cell, as if by reproduction.
            if (!this.grid[i][j]) {
                if (count === 3) {
                    gridCpy[i][j] = true; // cell revives
                    continue;
                }
            }
        }
    } 
    for (var i = 0; i < gridCpy.length; i++) {
        for (var j = 0; j < gridCpy[i].length; j++) {
            this.grid[i][j] = gridCpy[i][j];
        }
    }
    console.log(this.grid);
    console.log(gridCpy);
}

var c = new ConwayLife(30);
c.renderBoard();
c.setCell(0,1,true);
c.setCell(1,2,true);
c.setCell(2,0,true);
c.setCell(2,1,true);
c.setCell(2,2,true);
