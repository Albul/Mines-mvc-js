/*
 * Copyright 2012 Alexandr Albul
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
define(
    'model',
    ['events', 'utils', 'cells'],
    function(events, utils, Cells) {


        var Model = function (cols, rows, mines) {

            var
                cells = new Cells(cols, rows, mines), // Матрица клеток

                /**
                 * Поиск и открытие свободных клеток,
                 * поиск делаеться рекурсивно до тех пор пока встречаються нулевые клетки
                 */
                searchEmpty = function (i, j, arrChanges) {
                    cells.open(i, j);
                    arrChanges.push({'i':i, 'j': j});
                    if (cells.isOther(i, j)) return;

                    // Проверяем соседние клетки
                    if (cells.notMine(i - 1, j) && cells.isClosed(i - 1, j)) {
                        searchEmpty(i - 1, j, arrChanges);
                    }
                    if (cells.notMine(i + 1, j) && cells.isClosed(i + 1, j)) {
                        searchEmpty(i + 1, j, arrChanges);
                    }
                    if (cells.notMine(i, j - 1) && cells.isClosed(i, j - 1)) {
                        searchEmpty(i, j - 1, arrChanges);
                    }
                    if (cells.notMine(i, j + 1) && cells.isClosed(i, j + 1)) {
                        searchEmpty(i, j + 1, arrChanges);
                    }

                    // Проверяем диагональные клетки
                    if (cells.notMine(i - 1, j - 1) && cells.isClosed(i - 1, j - 1)) {
                        searchEmpty(i - 1, j - 1, arrChanges);
                    }
                    if (cells.notMine(i - 1, j + 1) && cells.isClosed(i - 1, j + 1)) {
                        searchEmpty(i - 1, j + 1, arrChanges);
                    }
                    if (cells.notMine(i + 1, j - 1) && cells.isClosed(i + 1, j - 1)) {
                        searchEmpty(i + 1, j - 1, arrChanges);
                    }
                    if (cells.notMine(i + 1, j + 1) && cells.isClosed(i + 1, j + 1)) {
                        searchEmpty(i + 1, j + 1, arrChanges);
                    }
                };

            /**
             * Открыть ячейку
             */
            this.openCell = function (i, j) {
                if (cells.isClosed(i, j)) {
                    var arrChanges = [];
                    cells.open(i, j);
                    arrChanges.push({'i':i, 'j': j});

                    if (cells.isMine(i, j)) {
                        this.dispatchEvent('lostGame');
                        alert('Игра окончена');
                    } else if (cells.isZero(i, j)) { // Если кликнули на нулевой ячейке, откроем всю пустую область
                        searchEmpty(i, j, arrChanges);
                    } else {
                        arrChanges.push({'i':i, 'j': j});
                    }
                    this.dispatchEvent('changed', arrChanges);

                    if (cells.getNumberClosed() == mines) {
                        this.dispatchEvent('wonGame');
                        alert('Вы выграли');
                    }
                }
            };

            /**
             * Получить содержимое ячейки
             */
            this.getContentCell = function (i, j) {
                return cells.getContentCell(i, j);
            };

            /**
             * Проверить ячейку на открытость
             */
            this.isOpened = function (i, j) {
                return cells.isOpened(i, j);
            };

            /**
             * Проверить ячейку на на содержание мины
             */
            this.isMine = function (i, j) {
                return cells.isMine(i, j);
            };

            /**
             * Вовращает количество рядков
             */
            this.getRows = function () {
                return rows;
            }

            /**
             * Вовращает количество столбцов
             */
            this.getCols = function () {
                return cols;
            }
        };

        // Наследуемся от диспетчера событий (чтобы уведомлять подпищиков об изменениях в модели)
        Model.prototype = new events.EventDispatcher();

        return Model;
    }
); 