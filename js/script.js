// объявление переменных
let randomLoc = Math.floor(Math.random() * 5), // функция Math.random() создает сулчайное число от 0 до 0.999. Умножение на 5 создает число от 0 до 4.999. Math.floor - округляет число в меньшую сторону - 4.999 будет 4
    location1 = randomLoc, // позиции №1 присваивается случайная позиция
    location2 = location1 + 1, // позиции №2 присваивается значение позиции №1 увеличенной на единицу
    location3 = location2 + 1, // позиции №3 присваивается значение позиции №2 увеличенной на единицу
    guess, // значение выстрела пользователя изначально undefined
    hits = 0, //  колличество попаданий
    guesses = 0, // количество попыток
    isSunk = false; // корабль потоплен - ложь


while (isSunk == false) { // Цикл while с условием, если переменная isSunk равна false выполнится потому что isSunk = false
    guess = prompt("Ваш выстрел! (введите число от 0 до 6)");
    if (guess < 0 || guess > 6) {
        alert("Введите правильное значение (0-6)");
        } else {
                guesses = guesses + 1; // увеличивает колличесвто попыток на один

        if (guess == location1 || guess == location2 || guess == location3) {
            alert("Попадание в цель!");
            hits = hits + 1; // увеличивает кол-во попаданий на один

        if (hits == 3) {
            isSunk = true; // переменная становится true если кол-во попаданий равняется трем
            alert("Вы потопили мой корабль!");
         }
    } else {
        alert("Мимо!");
      }
    }
}

let stats = "Вы сипользовали " + guesses + " попыток, что бы потопить корабль. " +
"Ваша точность составляет: " + (300/guesses).toFixed() + "%";
alert(stats);


// function whatShallIWear(temp, wind) {
//     if (temp < 10 && wind > 10) {
//         console.log("Wear a jacket");
//     } else if (temp > 10 && temp < 20 && wind < 10 && wind > 5 ) {
//         console.log("Wear a sweater");
//     } else {
//         console.log("Wear a t-shirt");
//     }
// }
// whatShallIWear(5, 12);
// whatShallIWear(15, 6);
// whatShallIWear(25, 2);



