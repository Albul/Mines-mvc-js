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
define('Game', function (app) {

    var Game = function (rows, cols, mines) {

        // Задействование нужных модулей
        var math = app.utils.math,
            matrix =  app.utils.matrix,
            collision = app.utils.collision,
            dom = app.utils.dom,
            constants = app.constants,
            Cell = app.components.Cell;

        var canvas = document.getElementById("canvas"),
            cells;

        /**
         * Создание матрицы клеток
         * @param rows Количество рядков
         * @param cols Количество столбцов
         * @return {*} Матрица клеток
         */
        var createCells = function (rows, cols) {
            var cell,
                cells = matrix.create(rows, cols);

            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < cols; j++) {
                    cell = new Cell(i, j);
                    cell.draw();
                    cells[i][j] = cell;
                }
            }
            return cells;
        };

        /**
         * Заполнение клеток минами
         * @param cells Матрица клеток
         * @param mines Количество мин
         */
        var	fillMines = function (cells, mines) {
            var maxI = cells.length - 1,
                maxJ = cells[0].length - 1,
                i,
                j;

            while (mines) {
                i = math.getRandomInt(0, maxI);
                j = math.getRandomInt(0, maxJ);
                while (cells[i][j].isMine()) {
                    i = math.getRandomInt(0, maxI);
                    j = math.getRandomInt(0, maxJ);
                }
                cells[i][j].content = constants.MINE;
                mines--;
            }
        };

        /**
         * Вычисляет допустимость индексов ячейки
         * @param i Индекс рядка
         * @param j Индекс столбца
         * @return {Boolean} true если ячейка существует, false иначе
         */
        var	isValid = function (i, j) {
            if (i >= 0 && i < rows && j >= 0 && j < cols) {
                return true;
            } else {
                return false;
            }
        };

        var getCell = function (i, j) {
            if (isValid(i, j)) {
                return cells[i][j];
            } else {
                return null;
            }
        }

        /**
         * Расчитать соседство мин для каждой клетки поля
         * @param cells Матрица клеток
         */
        var calculateCells = function (cells) {
            var i = rows,
                j = cols;

            while (i--) {
                while (j--) {
                    if (!cells[i][j].isMine()) {
                        cells[i][j].content = calculateCell.call(this, cells[i][j]);
                    }
                }
                j = cols;
            }
        };

        /**
         * Рассчитать количество мин из которыми соседствует клетка
         * @param cell Клетка минного поля
         * @return {Number} Количество мин с которыми соседствует клетка
         */
        var calculateCell = function (cell) {
            var count = 0,
                i = cell.i,
                j = cell.j;

            // Проверяем соседние клетки
            if (isValid(i - 1, j) && cells[i - 1][j].isMine()) count++;
            if (isValid(i + 1, j) && cells[i + 1][j].isMine()) count++;
            if (isValid(i, j - 1) && cells[i][j - 1].isMine()) count++;
            if (isValid(i, j + 1) && cells[i][j + 1].isMine()) count++;

            // Проверяем диагональные клетки
            if (isValid(i - 1, j - 1) && cells[i - 1][j - 1].isMine()) count++;
            if (isValid(i - 1, j + 1) && cells[i - 1][j + 1].isMine()) count++;
            if (isValid(i + 1, j - 1) && cells[i + 1][j - 1].isMine()) count++;
            if (isValid(i + 1, j + 1) && cells[i + 1][j + 1].isMine()) count++;

            return count;
        };

        /**
         * Получить клетку которая находиться под курсором
         * @param mouseX Х координата мышки
         * @param mouseY Y координата мышки
         * @return {*} Клетка под курсором мышки
         */
        var getCellAtMouse = function (mouseX, mouseY) {
            var cell,
                i = rows,
                j = cols;

            while (i--) {
                while (j--) {
                    cell = cells[i][j];
                    if (collision.hitTestPoint(cell, mouseX, mouseY)) {
                        return cell;
                    }
                }
                j = cols;
            }
            return cell;
        };

        /**
         * Отрисовать все мины
         */
        var drawAllMines = function () {
            var i = rows,
                j = cols,
                cell;

            while (i--) {
                while (j--) {
                    cell = cells[i][j];
                    if (cell.isMarked()) {
                        if (!cell.isMine()) {
                            cell.drawStrike();
                        }
                    } else if (cell.isMine()) {
                        cell.drawMine();
                    }
                }
                j = cols;
            }
        };

        /**
         * Открыть ячейку
         * @param cell Ячейка
         */
        var openCell = function (cell) {
            if (cell.isClosed()) {

                cell.open();

                if (cell.isMine()) {
                    canvas.removeEventListener('click', onClick);
                    canvas.removeEventListener('mousedown', onMouseDown);
                    canvas.removeEventListener('mouseup', onMouseUp);
                    drawAllMines();
                    alert('Игра окончена');
                } else if (cell.isZero()) { // Если кликнули на нулевой ячейке, открываем всю пустую область
                    searchEmpty(cell);
                }
            }
        };

        /**
         * Поиск и открытие свободных клеток,
         * поиск делаеться рекурсивно до тех пор пока встречаються нулевые клетки
         * @param cell Клетка для открытия
         */
        var searchEmpty = function (cell) {
            cell.open();
            if (cell.isOther()) return;

            var nextCell,
                i = cell.i,
                j = cell.j;

            // Проверяем соседние клетки
            nextCell = getCell(i - 1, j);
            if (nextCell && !nextCell.isMine() && !nextCell.isOpened()) searchEmpty(nextCell);

            nextCell = getCell(i + 1, j);
            if (nextCell && !nextCell.isMine() && !nextCell.isOpened()) searchEmpty(nextCell);

            nextCell = getCell(i, j - 1);
            if (nextCell && !nextCell.isMine() && !nextCell.isOpened()) searchEmpty(nextCell);

            nextCell = getCell(i, j + 1);
            if (nextCell && !nextCell.isMine() && !nextCell.isOpened()) searchEmpty(nextCell);

            // Проверяем диагональные клетки
            nextCell = getCell(i - 1, j - 1);
            if (nextCell && !nextCell.isMine() && !nextCell.isOpened()) searchEmpty(nextCell);

            nextCell = getCell(i - 1, j + 1);
            if (nextCell && !nextCell.isMine() && !nextCell.isOpened()) searchEmpty(nextCell);

            nextCell = getCell(i + 1, j - 1);
            if (nextCell && !nextCell.isMine() && !nextCell.isOpened()) searchEmpty(nextCell);

            nextCell = getCell(i + 1, j + 1);
            if (nextCell && !nextCell.isMine() && !nextCell.isOpened()) searchEmpty(nextCell);
        };

        function getMousePos(canvas, e) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }

        var onClick = function (e) {
            if (e.which == 1) {
                var pos = getMousePos(canvas, e),
                    cell = getCellAtMouse(pos.x, pos.y);
                openCell(cell);
            }
        };

        /**
         * Блокировка контекстного меню на канвасе
         */
        var onMouseDown = function (e) {
            if (e.which == 3) {
                this.oncontextmenu = function () {
                    return false;
                };
            }
        };

        /**
         * Установка и снятие флага из клетки, при правом клике
         */
        var onMouseUp = function (e) {
            if (e.which == 3) { // Отлавливаем правый клик
                var pos = getMousePos(canvas, e),
                    cell = getCellAtMouse(pos.x, pos.y);

                if (cell.isClosed()) {  // Если клетка закрыта, пометить клетку
                    cell.mark();
                } else if (cell.isMarked()) {   // Если клетка помечена, убрать пометку
                    cell.unMark();
                }
            }
        };

        /* Инициализация */
        canvas.addEventListener('click', onClick);
        canvas.addEventListener('mousedown', onMouseDown);
        canvas.addEventListener('mouseup', onMouseUp);

        canvas.width = Cell.SIZE * cols + 20;
        canvas.height = Cell.SIZE * rows + 20;

        var context = canvas.getContext('2d');

        cells = createCells(rows, cols);
        fillMines(cells, mines);

        calculateCells(cells);

        this.destroy = function () {
            cells = null;
            canvas.removeEventListener('click', onClick);
            canvas.removeEventListener('mousedown', onMouseDown);
            canvas.removeEventListener('mouseup', onMouseUp);
        };

    };

    return Game;
});