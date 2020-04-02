var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	
	ships: [
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] },
		{ locations: [0, 0, 0], hits: ["", "", ""] }
	],

// original hard-coded values for ship locations
/*
	ships: [
		{ locations: ["06", "16", "26"], hits: ["", "", ""] },
		{ locations: ["24", "34", "44"], hits: ["", "", ""] },
		{ locations: ["10", "11", "12"], hits: ["", "", ""] }
	],
*/

	fire: function(guess) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);

			// here's an improvement! Check to see if the ship
			// has already been hit, message the user, and return true.
			if (ship.hits[index] === "hit") {
				view.displayMessage("Oops, you already hit that location!");
				return true;
			} else if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("HIT!");

				if (this.isSunk(ship)) {
					view.displayMessage("You sank my battleship!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("You missed.");
		return false;
	},

	isSunk: function(ship) {
		for (var i = 0; i < this.shipLength; i++)  {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
	    return true;
	},

	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
		console.log("Ships array: ");
		console.log(this.ships);
	},

	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;

		if (direction === 1) { // horizontal
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
		} else { // vertical
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},

	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
	
}; 


var view = {
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},

	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},

	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}

}; 

var controller = {
	guesses: 0,

	processGuess: function(guess) {
		var location = parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
					view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses");
			}
		}
	}
}


// helper function to parse a guess from the user

function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	if (guess === null || guess.length !== 2) {
		alert("Oops, please enter a letter and a number on the board.");
	} else {
		var firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);
		
		if (isNaN(row) || isNaN(column)) {
			alert("Oops, that isn't on the board.");
		} else if (row < 0 || row >= model.boardSize ||
		           column < 0 || column >= model.boardSize) {
			alert("Oops, that's off the board!");
		} else {
			return row + column;
		}
	}
	return null;
}


// event handlers

function handleFireButton() {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value.toUpperCase();

	controller.processGuess(guess);

	guessInput.value = "";
}

function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");

	// in IE9 and earlier, the event object doesn't get passed
	// to the event handler correctly, so we use window.event instead.
	e = e || window.event;

	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}


// init - called when the page has completed loading

window.onload = init;

function init() {
	// Fire! button onclick handler
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;

	// handle "return" key press
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	// place the ships on the game board
	model.generateShipLocations();
}





// // // объявление переменных
// // let randomLoc = Math.floor(Math.random() * 5), // функция Math.random() создает сулчайное число от 0 до 0.999. Умножение на 5 создает число от 0 до 4.999. Math.floor - округляет число в меньшую сторону - 4.999 будет 4
// //     location1 = randomLoc, // позиции №1 присваивается случайная позиция
// //     location2 = location1 + 1, // позиции №2 присваивается значение позиции №1 увеличенной на единицу
// //     location3 = location2 + 1, // позиции №3 присваивается значение позиции №2 увеличенной на единицу
// //     guess, // значение выстрела пользователя изначально undefined
// //     hits = 0, //  колличество попаданий
// //     guesses = 0, // количество попыток
// //     isSunk = false; // корабль потоплен - ложь


// // while (isSunk == false) { // Цикл while с условием, если переменная isSunk равна false выполнится потому что isSunk = false
// //     guess = prompt("Ваш выстрел! (введите число от 0 до 6)");
// //     if (guess < 0 || guess > 6) {
// //         alert("Введите правильное значение (0-6)");
// //         } else {
// //                 guesses = guesses + 1; // увеличивает колличесвто попыток на один

// //         if (guess == location1 || guess == location2 || guess == location3) {
// //             alert("Попадание в цель!");
// //             hits = hits + 1; // увеличивает кол-во попаданий на один

// //         if (hits == 3) {
// //             isSunk = true; // переменная становится true если кол-во попаданий равняется трем
// //             alert("Вы потопили мой корабль!");
// //          }
// //     } else {
// //         alert("Мимо!");
// //       }
// //     }
// // }

// // let stats = "Вы сипользовали " + guesses + " попыток, что бы потопить корабль. " +
// // "Ваша точность составляет: " + (300/guesses).toFixed() + "%";
// // alert(stats);





// var view = {
//     displayMessage: function (msg) {
//         var messageArea = document.getElementById("messageArea");
//         messageArea.innerHTML = msg;
//     },
//     displayHit: function (location) {
//         var cell = document.getElementById(location);
//         cell.setAttribute("class", "hit");

//     },
//     displayMiss: function (location) {
//         var cell = document.getElementById(location);
//         cell.setAttribute("class", "miss");
//     }
// };

// var model = {       // глобальный объект 
//     boardSize: 7,   // свойство размер игровой доски со значением 7 клеток
//     numShips: 3,    // свойство колл-во кораблей со значение 3 корабля
//     shipLength: 3,  // свойство длина корабля со значением 3 клетки
//     shipsSunk: 0,   // свойство потопленных кораблей, изначально 0
//     ships: [ { locations: [0, 0, 0], hits: ["", "", ""] },
//             { locations: [0, 0, 0], hits: ["", "", ""] },
//             { locations: [0, 0, 0], hits: ["", "", ""] } ],     // объект с индексом 2
//     fire: function(guess) {                         // Метод получает координаты выстрела.
//         for (var i = 0; i < this.numShips; i++) {   // перебераю массив принадлежащий свойству ships до тех пор пока индекс(номер) значения массива меньше значения numShips=3  
//             var ship = this.ships[i];               // получаю объект ship(корабль) из массива принадлежащего свойству ships. Сначала получаю объект под индексом 0 затем 1 и 2       
//             var index = ship.locations.indexOf(guess);   // Метод indexOf ищет в массиве указанное значение и возвращает его индекс (или -1, если значение отсутствует в массиве).
//             if (index >= 0) {
//                 ship.hits[index] = "hit";           // Ставим отметку в массиве hits по тому же индексу
//                 view.displayHit(guess);
//                 view.displayMessage("Попадание!");
//                 if (this.isSunk(ship)) {            // Если isSunk = true
//                     view.displayMessage("Вы потопили мой корабль!");
//                     this.shipsSunk++;
//                     }
//                 return true;                        // Если попадание то вернуть true
//             }
//         }
//         view.displayMiss(guess);
//         view.displayMessage("Вы промахнулись");
//         return false;   // если промах, то вернуть false        
//     },
    
//     isSunk: function(ship) {    // Свойство - потоплен ли корабль
//         for (var i = 0; i < this.shipLength; i++) {     // перебераю массив свойства hits корабля до тех пор пока индекс меньше длинный корабля 
//             if (ship.hits[i] !== "hit") {   // если индекс в массиве hits не имеет значения "hit" , то вернуть false 
//             return false;
//             }
//         }
//         return true;    // возвращаю тру в метод fire(guess)
//     },
// generateShipLocations: function() {
//     var locations;
//     for (var i = 0; i < this.numShips; i++) {
//     do {
//     locations = this.generateShip();
//     } while (this.collision(locations));
//     this.ships[i].locations = locations;
//     }
//     },
// generateShip: function() {
//     var direction = Math.floor(Math.random() * 2);
//     var row, col;
//     if (direction === 1) {
//         row = Math.floor(Math.random() * this.boardSize);
//         col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
//         } else {
//         row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
//         col = Math.floor(Math.random() * this.boardSize);
//         }
//     var newShipLocations = [];
//     for (var i = 0; i < this.shipLength; i++) {
//     if (direction === 1) {
//         newShipLocations.push(row + "" + (col + i));
//     } else {
//         newShipLocations.push((row + i) + "" + col);
//     }
//     }
//     return newShipLocations;
//     },
// collision: function(locations) {
//     for (var i = 0; i < this.numShips; i++) {
//     var ship = model.ships[i];
//     for (var j = 0; j < locations.length; j++) {
//     if (ship.locations.indexOf(locations[j]) >= 0) {
//     return true;
//     }
//     }
//     }
//     return false;
//     }  
// };

// var controller = {
//     guesses: 0,
//     processGuess: function(guess) {
//         var location = parseGuess(guess);
//         if (location) {
//             this.guesses++;
//             var hit = model.fire(location);
//             if (hit && model.shipsSunk === model.numShips) {
//                 view.displayMessage("You sank all my battleships, in " +
//                 this.guesses + " guesses");
//     }
//     }
// }
// };


// function parseGuess(guess) {
//     var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
//     if (guess === null || guess.length !== 2) {
//     alert("Oops, please enter a letter and a number on the board.");
//     } else {
//     firstChar = guess.charAt(0);
//     var row = alphabet.indexOf(firstChar);
//     var column = guess.charAt(1);
//     if (isNaN(row) || isNaN(column)) {
//         console.log("Oops, that isn't on the board.");
//     } else if (row < 0 || row >= model.boardSize ||
//     column < 0 || column >= model.boardSize) {
//         alert("Oops, that's off the board!");
//     } else {
//     return row + column;
//     }
//     }
//     return null;
//     }


// function init() {
//     var fireButton = document.getElementById("fireButton");
//     fireButton.onclick = handleFireButton;
//     }
//     function handleFireButton() {
//         model.generateShipLocations();
//     }
//     window.onload = init;


// function handleFireButton() {
//     var guessInput = document.getElementById("guessInput");
//     var guess = guessInput.value;
//     controller.processGuess(guess);
//     guessInput.value = "";
//     }

