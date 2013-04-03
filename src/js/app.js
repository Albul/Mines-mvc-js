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
window[APP_NAME] = (function (app) {

    window.location.href = "#/";

    var self = this;

    var addClass = function (el, clas) {
        el.className += ' '+clas;
    };

    var removeClass = function (el, clas){
        var elClass = ' '+el.className+' ';
        while(elClass.indexOf(' '+clas+' ') != -1)
            elClass = elClass.replace(' '+clas+' ', '');
        el.className = elClass;
    };

    var activatePage = function (element) {
        deactivePage();
        addClass(element, 'ui-page-active');
        self.activePage = element;
    };

    var deactivePage = function () {
        removeClass(self.activePage, 'ui-page-active');
    };

    this.canvas = document.getElementById("canvas");

    var pMainMenu = document.getElementById('page-menu'),
        pChooseGame = document.getElementById('page-choose-game'),
        pGame = document.getElementById('page-game'),
        pCustom = document.getElementById('page-custom');

    self.activePage = pMainMenu;
    activatePage(pMainMenu);

    var game;

    var audio = new Audio();
    var url = "../asset/slide.wav";
    audio.setAttribute("src", url);
    audio.load(); // Required for 'older' browsers

    var showGame = function (rows, cols, mine) {
            activatePage(pGame);
            if (game) game.destroy();
            game = new app.Game(parseInt(rows), parseInt(cols), parseInt(mine));
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
        showRecords = function () {
            console.log("Records");
        },
        showAbout = function() {
            console.log("showAbout: bookId is populated: ");
        };

    var routes = {
        '#/': showMainMenu,
        '/page-choose-game': showChooseGame,
        '/page-game/:rows/:cols/:mines': showGame,
        '/page-custom': showCustom,
        '/create-game': createGame,
        '/records': showRecords,
        '/about': showAbout,
        '/exit': function () {console.log('Exit');}
    };

    var router = new Router(routes);
    router.init();

    return app;
}(window[APP_NAME] || {}));