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
    'cells',
    ['constants', 'utils'],
    function(constants, utils) {

        var Cells = function (rows, cols, mines) {

            var
                // Матрица содержимого ячеек (каждая ячейка может содержать значения: MINE == мина, ZERO == ячейка в
                // которой нет по соседству мин, OTHER - ячейка в которой есть по соседству мины)
                matrixContent = utils.matrix.create(rows, cols, constants.ZERO),

                // Матрица состояний ячеек (может содержать: CLOSED_STATE - ячейка закрыта,
                // и !CLOSED_STATE - ячейка открыта
                matrixState = utils.matrix.create(rows, cols, constants.CLOSED_STATE),

                // Количество закрытых клеток
                numberClosed = rows * cols,

                /**
                 * Расчитать соседство мин для каждой ячейки поля
                 */
                 calculateCells = function () {
                    var i = rows,
                        j = cols;

                    while (i--) {
                        while (j--) {
                            if (this.notMine(i, j)) {
                                matrixContent[i][j] = calculateCell.call(this, i, j);
                            }
                        }
                        j = cols;
                    }
                 },

                /**
                 * Рассчитать количество мин из которыми соседствует ячейка
                 */
                 calculateCell = function (i, j) {
                    var count = 0;

                    // Проверяем соседние клетки
                    if (this.isMine(i - 1, j)) count++;
                    if (this.isMine(i + 1, j)) count++;
                    if (this.isMine(i, j - 1)) count++;
                    if (this.isMine(i, j + 1)) count++;

                    // Проверяем диагональные клетки
                    if (this.isMine(i - 1, j - 1)) count++;
                    if (this.isMine(i - 1, j + 1)) count++;
                    if (this.isMine(i + 1, j - 1)) count++;
                    if (this.isMine(i + 1, j + 1)) count++;

                    return count;
                 },

                /**
                 * Вычисляет допустимость индексов ячейки
                 */
                 isValid = function (i, j) {
                    if (i >= 0 && i < rows && j >= 0 && j < cols) {
                        return true;
                    } else {
                        return false;
                    }
                 };

//-------------------------------------------------------------------------------------------------
//
//      Public methods
//
//-------------------------------------------------------------------------------------------------

            /**
             * Открыть ячейку
             */
            this.open = function (i, j) {
                if (this.isClosed(i, j)) {
                    numberClosed--;
                    matrixState[i][j] = !constants.CLOSED_STATE;
                }
            };

            /**
             * Возвращает количество закрытых ячеек
             */
            this.getNumberClosed = function () {
                return numberClosed;
            };

            this.isOpened = function (i, j) {
                if (!isValid(i, j)) return constants.OVERFLOW;
                return matrixState[i][j] != constants.CLOSED_STATE;
            };

            this.isClosed = function (i, j) {
                if (!isValid(i, j)) return constants.OVERFLOW;
                return matrixState[i][j] == constants.CLOSED_STATE;
            };

            this.isMine = function (i, j) {
                if (!isValid(i, j)) return constants.OVERFLOW;
                return matrixContent[i][j] == constants.MINE;
            };

            this.notMine = function (i, j) {
                if (!isValid(i, j)) return constants.OVERFLOW;
                return matrixContent[i][j] != constants.MINE;
            };

            this.isZero = function (i, j) {
                if (!isValid(i, j)) return constants.OVERFLOW;
                return matrixContent[i][j] == constants.ZERO;
            };

            this.isOther = function (i, j) {
                if (!isValid(i, j)) return constants.OVERFLOW;
                return matrixContent[i][j] != constants.ZERO && matrixContent[i][j] != constants.MINE;
            };

            this.getContentCell = function(i, j) {
                if (!isValid(i, j)) return constants.OVERFLOW;
                return matrixContent[i][j];
            };

            /**
             * Получить состояние ячейки
             */
            this.getStateCell = function(i, j) {
                if (!isValid(i, j)) return constants.OVERFLOW;
                return matrixState[i][j];
            }

            /* Инициализация */
            utils.matrix.fillRandom(matrixContent, mines, constants.MINE);
            calculateCells.call(this);
        };

        return Cells;
    }
);