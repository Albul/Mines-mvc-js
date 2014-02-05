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
define('app', function (app) {

    var self = this,
        model;

    // Set the initial value
    var records = JSON.parse(localStorage.getItem('Mines.records'))
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

    // Pages --------------------------------------------- */
    var pMainMenu = document.getElementById('page-menu'),
        pChooseGame = document.getElementById('page-choose-game'),
        pGame = document.getElementById('page-game'),
        pCustom = document.getElementById('page-custom'),
        pResults = document.getElementById('page-results'),
        pRecords = document.getElementById('page-records'),
        pAbout = document.getElementById('page-about');

    // Private methods --------------------------------------------- */
    var addClass = function (el, clas) {
            el.className += ' '+clas;
        },
        removeClass = function (el, clas){
            var elClass = ' '+el.className+' ';
            while(elClass.indexOf(' '+clas+' ') != -1)
                elClass = elClass.replace(' '+clas+' ', '');
            el.className = elClass;
        },
        activatePage = function (element) {
            deactivePage();
            addClass(element, 'ui-page-active');
            self.activePage = element;
        },
        deactivePage = function () {
            if (self.activePage) {
                removeClass(self.activePage, 'ui-page-active');
            }
        };

    var showGame = function (rows, cols, mine) {
            activatePage(pGame);

            model = new app.model.Model(parseInt(rows), parseInt(cols), parseInt(mine));
            var view = new app.view.View(model);
            var controller = new app.controller.Controller(model, view);

            var onEndGame = function () {
                setTimeout(function() {window.location.href = "#/results";}, 2000);
                model.removeEventListener('lostGame', onEndGame);
                model.removeEventListener('wonGame', onEndGame);
            };
            model.addEventListener('lostGame', onEndGame);
            model.addEventListener('wonGame', onEndGame);

            console.log("New Game with mines: " + mine.toString());
        },
        showMainMenu = function () {
            activatePage(pMainMenu);

            audio.play();

            var title = pMainMenu.getElementsByClassName('title');
            title[0].style.opacity = 0;
            TweenLite.to(title[0], 1, {css:{opacity:1}});

            var delay = 0.05;
            var factorDelay = 0;

            var buttons = pMainMenu.getElementsByClassName('button');
            var startMarginLeft = window.innerWidth + 'px';
            for (var i = 0, max = buttons.length; i < max; i++) {
                buttons[i].style.marginLeft = startMarginLeft;
                TweenLite.to(buttons[i], 0.5, {css:{marginLeft:'0px'},
                    delay:factorDelay++ * delay,
                    ease:Back.easeOut});
            }
        },
        showChooseGame = function () {
            activatePage(pChooseGame);

            audio.play();

            var title = pChooseGame.getElementsByClassName('title');
            title[0].style.opacity = 0;
            TweenLite.to(title[0], 1, {css:{opacity:1}});

            var delay = 0.05;
            var factorDelay = 0;

            var buttons = pChooseGame.getElementsByClassName('button');
            var startMarginLeft = window.innerWidth + 'px';
            for (var i = 0, max = buttons.length; i < max; i++) {
                buttons[i].style.marginLeft = startMarginLeft;
                TweenLite.to(buttons[i], 0.5, {css:{marginLeft:'0px'},
                    delay:factorDelay++ * delay,
                    ease:Back.easeOut});
            }
        },
        showCustom = function () {
            activatePage(pCustom);

            audio.play();

            var title = pCustom.getElementsByClassName('title');
            title[0].style.opacity = 0;
            TweenLite.to(title[0], 1, {css:{opacity:1}});

            var delay = 0.05;
            var factorDelay = 0;

            var startMarginLeft = window.innerWidth + 'px';
            var spinners = pCustom.getElementsByTagName('table');
            var buttons = pCustom.getElementsByClassName('button');

            for (var i = 0, max = spinners.length; i < max; i++) {
                spinners[i].style.marginLeft = startMarginLeft;
                TweenLite.to(spinners[i], 0.5, {css:{marginLeft:'0px'},
                    delay:factorDelay++ * delay,
                    ease:Back.easeOut});
            }

            for (var i = 0, max = buttons.length; i < max; i++) {
                buttons[i].style.marginLeft = startMarginLeft;
                TweenLite.to(buttons[i], 0.5, {css:{marginLeft:'0px'},
                    delay:factorDelay++ * delay,
                    ease:Back.easeOut});
            }
        },
        createGame = function () {
            var horiz = document.getElementById('horiz').value;
            var vert = document.getElementById('vert').value;
            var mines = document.getElementById('mines').value;

            window.location.href = "#/page-game/" + horiz + "/" + vert + "/" + mines;
        },
        showResults = function () {
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
        },
        showRecords = function () {
            activatePage(pRecords);
            var tableRecords = document.getElementById('table-records');

            for(var i = tableRecords.rows.length - 1; i > 1; i--) {
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
        },
        replay = function () {
            window.location.href = "#/page-game/" + model.getCols() + "/" + model.getRows() + "/" + model.getMines();
        },
        showAbout = function() {
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

    // Initialization --------------------------------------------- */
    var audio = new Audio();
    var url = "../asset/slide.wav";
    audio.setAttribute("src", url);
    audio.load(); // Required for 'older' browsers

    var router = new Router(routes);
    router.init();

    window.location.href = "#/";

    return app;
});