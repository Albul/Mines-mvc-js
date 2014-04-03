/**
 * Copyright (c) 2011-2012 Alexandr Albul
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function()
{
    //--------------------------------------------------------------------------
    //  Private members
    //--------------------------------------------------------------------------

    var self = this,
        model, router,
        records, audio, url;

    // Pages
    var pMainMenu = document.getElementById('page-menu'),
        pChooseGame = document.getElementById('page-choose-game'),
        pGame = document.getElementById('page-game'),
        pCustom = document.getElementById('page-custom'),
        pResults = document.getElementById('page-results'),
        pRecords = document.getElementById('page-records'),
        pAbout = document.getElementById('page-about');

    //--------------------------------------------------------------------------
    //  Private methods
    //--------------------------------------------------------------------------

    var addClass = function (el, clas) {
        el.className += ' '+clas;
    };

    var removeClass = function (el, clas){
        var elClass = ' '+el.className+' ';
        while (elClass.indexOf(' '+clas+' ') != -1)
            elClass = elClass.replace(' '+clas+' ', '');
        el.className = elClass;
    };

    var activatePage = function (element) {
        deactivePage();
        addClass(element, 'ui-page-active');
        self.activePage = element;
    };

    var hasClass = function (element, clas) {
        return (' ' + element.className + ' ').indexOf(' ' + clas + ' ') > -1;
    };

    var deactivePage = function () {
        if (self.activePage) {
            removeClass(self.activePage, 'ui-page-active');
        }
    };

    var showGame = function (rows, cols, mine) {
        activatePage(pGame);

        model = new mines.Model(parseInt(rows), parseInt(cols), parseInt(mine));
        var view = new mines.View(model);
        var controller = new mines.Controller(model, view);

        var onEndGame = function () {
            setTimeout(function() {window.location.href = "#/results";}, 2000);
            model.removeEventListener('lostGame', onEndGame);
            model.removeEventListener('wonGame', onEndGame);
        };
        model.addEventListener('lostGame', onEndGame);
        model.addEventListener('wonGame', onEndGame);

        console.log("New Game with mines: " + mine.toString());
    };

    var showMainMenu = function () {
        activatePage(pMainMenu);

        audio.play();

        var title = pMainMenu.getElementsByClassName('title');
        if (!hasClass(title, 'anim')) {
            addClass(title[0], 'anim');
        }

        var buttons = pMainMenu.getElementsByClassName('button');
        if (!hasClass(buttons[0], 'anim')) {
            for (var i = 0, max = buttons.length; i < max; i++) {
                addClass(buttons[i], 'anim');
            }
        }
    };

    var showChooseGame = function () {
        activatePage(pChooseGame);

        audio.play();

        var title = pChooseGame.getElementsByClassName('title');
        if (!hasClass(title, 'anim')) {
            addClass(title[0], 'anim');
        }

        var buttons = pChooseGame.getElementsByClassName('button');
        if (!hasClass(buttons[0], 'anim')) {
            for (var i = 0, max = buttons.length; i < max; i++) {
                addClass(buttons[i], 'anim');
            }
        }
    };

    var showCustom = function () {
        activatePage(pCustom);

        audio.play();

        var title = pCustom.getElementsByClassName('title');
        if (!hasClass(title, 'anim')) {
            addClass(title[0], 'anim');
        }

        var spinners = pCustom.getElementsByTagName('table');
        if (!hasClass(spinners[0], 'anim')) {
            for (var i = 0, max = buttons.length; i < max; i++) {
                addClass(spinners[i], 'anim');
            }
        }

        var buttons = pCustom.getElementsByClassName('button');
        if (!hasClass(buttons[0], 'anim')) {
            for (var i = 0, max = buttons.length; i < max; i++) {
                addClass(buttons[i], 'anim');
            }
        }
    };

    var createGame = function () {
        var horiz = document.getElementById('horiz').value;
        var vert = document.getElementById('vert').value;
        var mines = document.getElementById('mines').value;

        window.location.href = "#/page-game/" + horiz + "/" + vert + "/" + mines;
    };

    var showResults = function () {
        activatePage(pResults);

        var labelResult = document.getElementById('label-result');
        var m = model.getMines(),
            k = model.getRows() * model.getCols(),
            t = model.getTime(),
            factor = m / (k * t);

        var addNewRecord = function() {
            var name = prompt("Введите ваше имя для рекордной таблицы:");
            records.splice(i, 0, {
                'name': name,
                'rows': model.getRows(),
                'cols': model.getCols(),
                'mines': model.getMines(),
                'time': model.getTime(),
                'factor': factor
            });
            while (records.length > 10) {
                records.pop();
            }
            localStorage.setItem('Mines.records', JSON.stringify(records));
        };

        document.getElementById('label-time').innerHTML = "Затрачено времени: "
            + Math.floor(t / 60) + " мин " + Math.floor(t) + " сек";

        if (model.isWon()) {
            labelResult.innerHTML = "Вы выиграли ;)";
            removeClass(labelResult, 'title-lost');
            addClass(labelResult, 'title-won');

            for (var i = 0, length = records.length; i < length; i++) {
                if (factor > records[i].factor) {
                    addNewRecord();
                    break;
                }
            }
            if (i == length && i < 10) {
                addNewRecord();
            }
        } else {
            labelResult.innerHTML = "Вы проиграли :(";
            removeClass(labelResult, 'title-won');
            addClass(labelResult, 'title-lost');
        }

        var buttons = pResults.getElementsByClassName('button');
        if (!hasClass(buttons[0], 'anim')) {
            for (var i = 0, max = buttons.length; i < max; i++) {
                addClass(buttons[i], 'anim');
            }
        }
    };

    var showRecords = function () {
        activatePage(pRecords);
        var tableRecords = document.getElementById('table-records');

        for(var i = tableRecords.rows.length - 1; i > 0; i--) {
            tableRecords.deleteRow(i);
        }

        for (var i = 0; i < records.length; i++) {
            var newTr = document.createElement('TR');

            var tdName = document.createElement('TD');
            tdName.innerHTML = records[i].name;
            tdName.align = "left";
            newTr.appendChild(tdName);

            var tdCells = document.createElement('TD');
            tdCells.innerHTML = records[i].rows + "/" + records[i].cols;
            newTr.appendChild(tdCells);

            var tdMines = document.createElement('TD');
            tdMines.innerHTML = records[i].mines.toString() + "     ";
            newTr.appendChild(tdMines);

            var tdTime = document.createElement('TD');
            tdTime.innerHTML = records[i].time.toString();
            newTr.appendChild(tdTime);

            tableRecords.appendChild(newTr);
        }
    };

    var replay = function () {
        window.location.href = "#/page-game/" + model.getCols() + "/" + model.getRows() + "/" + model.getMines();
    };

    var showAbout = function() {
        activatePage(pAbout);
    };

    var routes = {
        '#/': showMainMenu,
        '/page-choose-game': showChooseGame,
        '/page-game/:rows/:cols/:mines': showGame,
        '/page-custom': showCustom,
        '/create-game': createGame,
        '/page-records': showRecords,
        '/page-about': showAbout,
        '/results': showResults,
        '/replay': replay,
        '/exit': function () {console.log('Exit');}
    };

    // Initialization ----------------------------------------------

    // Set the initial value
    records = JSON.parse(localStorage.getItem('Mines.records'))
        || (function () {
        var records = [
            {
                'name': 'Atari',
                'rows': 16,
                'cols': 16,
                'mines': 40,
                'time': 8,
                'factor': 1.25
            },
            {
                'name': 'Abdula',
                'rows': 8,
                'cols': 8,
                'mines': 10,
                'time': 4,
                'factor': 0.625
            }
        ];
        localStorage.setItem('Mines.records', JSON.stringify(records));
        return records;
    }());

    audio = new Audio();
    url = "../asset/slide.wav";
    audio.setAttribute("src", url);
    audio.load(); // Required for 'older' browsers

    router = new Router(routes);
    router.init();

    window.location.href = "#/";
})();