var model = {   // Объект "Модель" - содержит логику, связанную с изменениями состояния игры
    boardSize: 7,   // размер сетки игрового поля.
    numShips: 3,    // количество кораблей в игре.
    shipLength: 3,  // длина каждого корабля (в клетках)
    shipsSunk: 0,   // количество потопленных кораблей.
    ships: [
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] },
        { locations: [0, 0, 0], hits: ["", "", ""] }
    ],
    // тестовые позиции кораблей
    // ships: [{locations: ["06", "16", "26"], hits: ["", "", ""] },  // Переменная ships(корабли) ссылается на объект с массивом, внутри которого три объекта представляющих корабль №1, 2 и 3. 
    //         { locations: ["24", "34", "44"], hits: ["", "", ""] },  // Каждый объект(корабль) содержит в себе массив locations(координаты) и массив hits(попадания) с тремя элементами внутри. 
    //         { locations: ["10", "11", "12"], hits: ["", "", ""] }],   // Объект с индексом 2(карабль №3)

    fire: function(guess) {     // Метод получает координаты выстрела
        for (var i = 0; i < this.numShips; i++) {   // перебираем массив ships, последовательно проверяя каждый корабль. This указывает что свойство numShip относится именно к этому объекту - model. 
            var ship = this.ships[i];   // Получаем объект корабля с индексом из свойства ships
            var index = ship.locations.indexOf(guess);   // Метод indexOf ищет в массиве указанное значение и возвращает его индекс (или -1, если значение отсутствует в массиве).
            if (index >= 0) {   // Если полученный индекс из массива locations  больше либо равен нулю, то...
                ship.hits[index] = "hit";   // Индексу из массива hits присваивается значение "hit" 
                view.displayHit(guess);     // Сообщаем объекту view что в клетке guess следует вывести маркер попадания "hit"
                view.displayMessage("Попадание в цель!");    // Приказываем объекту view вывести сообщение с помощью метода displayMessage
                if (this.isSunk(ship)) {    // Если метод isSunk(ship) возвращает true, то есть корабль потоплен, то...
                    view.displayMessage("Вы потопили мой корабль!");   // Приказываем объекту view вывести сообщение с помощью метода displayMessage
                    this.shipsSunk++;   // Увеличиваем кол-во потопленных кораблей на один
                }
                return true;    // Возвращает true, если индекс больше либо равен нулю 
            }
        }
        view.displayMiss(guess);    // Сообщаем объекту view что в клетке guess следует вывести маркер промаха "miss"
        view.displayMessage("Вы промахнулись"); // // Приказываем объекту view вывести сообщение с помощью метода displayMessage
        return false;   //Если после перебора всех кораблей попадание не обнаружено, метод возвращает false
    },

    isSunk: function(ship) {    // Метод получает объект корабля(ship) и возвращает true, если корабль потоплен, или false, если он еще держится на плаву.
        for (var i = 0; i < this.shipLength; i++) { // перебераем объект корабля до тех пор пока не закончится его длина(3 клетки)
            if (ship.hits[i] !== "hit") {   // проверяет, помечены ли все его клетки маркером "hit", если есть хотя бы одна клетка, в которую еще не попал игрок, то корабль еще жив и...
                return false;   //  метод возвращает false.
            }
        }
        return true;    // если нет — корабль потоплен! 
    },

    generateShipLocations: function() { // Метод создает массив ships с количеством кораблей, определяемым свойством numShips
        var locations;  // массив позиций нового корабля, который мы собираемся разместить на игровом поле.
        for (var i = 0; i < this.numShips; i++) { // цикл перебора для каждого корабля
            do {
                locations = this.generateShip(); // Генерируем новый набор позиций...
            } while (this.collision(locations));    // ...и проверяем, перекрываются ли эти позиции с существующими кораблями на доске. Если есть перекрытия, нужна еще одна попытка.
                this.ships[i].locations = locations;    // Полученные позиции без перекрытий сохраняются в свойстве locations объекта корабля в массиве model.ships
        }
    },

    generateShip: function() {  // Метод создает массив со случайными позициями корабля
        var direction = Math.floor(Math.random() * 2);  // Math.random мы генерируем число от 0 до 1 и умножаем результат на 2, чтобы получить число в диапазоне от 0 до 2 (не включая 2). Затем Math.floor преобразует результат в 0 или 1.
        var row, col;
        if (direction === 1) {  // Если значение direction равно 1, создается горизонтальный корабль...
                row = Math.floor(Math.random() * this.boardSize);   // генерируется начальная позиция (первая), а остальные позиции будут просто находиться в двух соседних столбцах (при горизонтальном расположении) или строках (при вертикальном расположении).
                col = Math.floor(Math.random() * (this.boardSize - this.shipLength));   // уменьшаем размер доски (boardSize) на (shipLength), чтобы начальный столбец всегда лежал в диапазоне от 0 до 4
            } else {    // Если значение direction равно 0, создается вертикальный корабль...
                row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
                col = Math.floor(Math.random() * this.boardSize);
            }
        var newShipLocations = [];   // Набор позиций нового корабля начинается с пустого массива, в который последовательно добавляются элементы.
        for (var i = 0; i < this.shipLength; i++) { 
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));    // добавляем(push) в массив горизонтальный корабль. При первой итерации i равно 0, и сумма обозначает начальный столбец. При второй итерации происходит переход к следующему столбцу, а при третьей — к следующему за ним. Так в массиве генерируются серии элементов “01”, “02”, “03”.
            } else {
                newShipLocations.push((row + i) + "" + col);    // увеличивается строка — при каждой итерации цикла к ней прибавляется i.
            }
        }
        return newShipLocations;    // Когда все позиции сгенерированы, метод возвращает массив
    },

    collision: function(locations) {    // Метод получает данные корабля и проверяет, перекрывается ли хотя бы одна клетка с клетками других кораблей, уже находящихся на поле.
        for (var i = 0; i < this.numShips; i++) {  
            var ship = model.ships[i];   // Для каждого корабля, уже находящегося на поле...
            for (var j = 0; j < locations.length; j++) {    //...проверить, встречается ли какая-либо из позиций массива locations нового корабля в массиве locations существующих кораблей.
                if (ship.locations.indexOf(locations[j]) >= 0) {    // если полученный индекс больше либо равен 0, мы знаем, что клетка уже занята, поэтому метод возвращает true (перекрытие обнаружено)
            return true;
                }
            }
        }
        return false;   // Если выполнение дошло до этой точки, значит, ни одна из позиций не была обнаружена в других массивах, поэтому функция возвращает false (перекрытия отсутствуют)
    }

};


var view = {    // Объект "Представление" - отвечает за визуальный вид игры: выводит сообщения для пользователя, отмечает маркерами попадания и промахи
    displayMessage: function(msg) {     // Метод displayMessage выводит сообщение для пользователя. Получает аргумент msg(текст сообщения).
        var messageArea = document.getElementById("messageArea");   // Получаю элемент <div id="messageArea"> из DOM и присваиваю его переменной var messageArea.
        messageArea.innerHTML = msg;    // Изменяю значение элемента messageArea, через его свойство innerHTML, на значение текстового сообщения msg.
    },
    displayHit: function(location) {    // Метод displayHit принимает аргумент(координаты выстрела введенные пользователем),который образуется из строки и столбца и совпадает с идентификатором элемента <td>(ячейка в таблице).
        var cell = document.getElementById(location);   // Получаю ссылку на элемент, которому соответсвует аргумент(координаты выстрела введенные пользователем), то есть на элемент <td> с идентификатором соответсвующиму введенным пользователем координатам
        cell.setAttribute("class", "hit");  // Метод setAttribute назначает класс "hit"(прописан в CSS) элементу cell, то есть элементу <td> с идентификатором соответсвующиму введенным пользователем координатам.
    },
    displayMiss: function(location) {   // Метод displayHit принимает аргумент(координаты выстрела введенные пользователем),то есть на элемент <td> с идентификатором соответсвующиму введенным пользователем координатам
        var cell = document.getElementById(location);   // Получаю ссылку на элемент, которому соответсвует аргумент(координаты выстрела введенные пользователем) 
        cell.setAttribute("class", "miss");    // Метод setAttribute назначает класс "miss"(прописан в CSS) элементу cell, то есть элементу <td> с идентификатором соответсвующиму введенным пользователем координатам)
    }
};
// // тестовая проверка для view:
// view.displayMiss("00"); // Методу displayMiss объекта view передается аргумент(координаты выстрела введенные пользователем) в параметр (location), который соответсвует id(идентификатору) элемента <td>(ячейка в таблице).
// view.displayHit("34");
// view.displayMessage("Хорошо, все идет по плану!");  // Методу displayMessage объекта view передается аргумент(текст сообщения) в параметр msg. 


var controller = {  // Объект "Контроллер" - связывает все компоненты, получая координаты выстрела guess, обрабатывая их и передавая модели
    guesses: 0,     // колличество выстрелов произведенных пользователем
    processGuess: function(guess) {     // метод processGuess получает координаты выстрела в формате “A0"
        var location = parseGuess(guess);   // проверка введенных данных методом parseGuess
        if (location){      // если метод parseGuess вернул true, то...
            this.guesses++;     // увеличиваем кол-во выстрелов, из объекта controller, на единицу
            var hit = model.fire(location);     // координаты выстрела от игрока (строки и столбца) передается методу fire.
            if (hit && model.shipsSunk === model.numShips) {    // Если выстрел попал в цель, а количество потопленных кораблей равно количеству кораблей в игре, то
                view.displayMessage("Вы потопили все корабли, за " + this.guesses + " выстрелов");

            }   
        }
    }
}

// Вспомогательные функции:

function parseGuess(guess) {    // Получаем координаты выстрела от игрока(A0) и проверяем их на действительность
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];     // массив с буквами которые могут присутствовать в действительных координатах.
    if (guess === null || guess.length !== 2) {     // Проверяем данные на null и убеждаемся, что в строке два символа
        alert("Ошибка! Введите заглавную букву и цифру");
    } else {
        firstChar = guess.charAt(0);    // Извлекаем первый символ строки из координат выстрела от игрока(A0) при помощи метода charAt
        var row = alphabet.indexOf(firstChar);  // При помощи метода indexOf получаем цифру соответствующую извлеченному символу(букве).
        var column = guess.charAt(1);   // Получаем второй символ из строки(координаты выстрела A0,B1) представляющий столбец игрового поля
        if (isNaN(row) || isNaN(column)) {  //Функция isNaN выявляет строки и столбцы, которые не являются цифрами
            alert("Ошибка! Введите корректные данные");
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {  // Проверка. Цифры лежат в диапазоне от 0 до 6 и не выходят за размеры игрового поля
            alert("Ошибка! Введите корректные данные");
        } else {
            return row + column;    // row — число, а column — строка, поэтому результат преобразуется в строку(конкатенация).
        }
    }
    return null;    // если какая-то проверка не прошла, то метод возвращает null.
}

function handleFireButton() {   // функция будет вызываться при каждом нажатии кнопки Fire
    var guessInput = document.getElementById("guessInput"); // получаем ссылку на элемент формы по идентификатору элемента, “guessInput”
    var guess = guessInput.value;   // извлекаем данные, введенные пользователем. Координаты хранятся в свойстве value элемента input
    controller.processGuess(guess); // передаем данные введенные пользователем контроллеру, точнее его методу processGuess 
    guessInput.value = "";  // команда просто удаляет содержимое элемента input формы, заменяя его пустой строкой. Это делается для того, чтобы приходилось многократно выделять текст и удалять его перед вводом следующего выстрела.
}

function handleKeyPress(e) {    // Обработчик нажатий клавиш вызывается при каждом нажатии клавиши в поле input страницы.
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {     // Если нажата клавиша Enter, то  кнопка Fire должна сработать так, словно игрок щелкнул на ней.
    fireButton.click();
    return false;
    }
}

window.onload = init;   // браузер должен выполнять init при полной загрузке страницы.

function init() {      
    // Связывает обработчик событий с кнопкой Fire
    var fireButton = document.getElementById("fireButton"); 
    fireButton.onclick = handleFireButton;  //назначаем обработчик события нажатия — вызываем функцию handleFireButton нажатием на кнопку Fire
   
    // Связываем обработчик событий с нажатием клавиши Enter в поле input
    var guessInput = document.getElementById("guessInput"); 
    guessInput.onkeypress = handleKeyPress; //Добавляем новый обработчик событий нажатия клавиш в поле ввода HTML.
   
    model.generateShipLocations(); // При таком вызове, позиции всех кораблей будут определены к моменту начала игры.
}
