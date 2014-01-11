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
define('model.Model', function (app) {

        var Model = function (cols, rows, mines) {
            // Modules --------------------------------------------- */
            var
                constants = app.constants,
                matrix = app.utils.matrix;

            // Private members --------------------------------------------- */
            var
            // Matrix contains the number of mines in the neighborhood
                matrixContent = matrix.create(rows, cols, constants.ZERO),
            // Matrix states of the cells
                matrixState = matrix.create(rows, cols, constants.CLOSED_STATE),
                numberClosed = rows * cols; // The number of closed cells

            // Private methods --------------------------------------------- */
            var
            // Calculate neighborhood mines for each cell of the field
                calculateCells = function () {
                    var i = rows,
                        j = cols;
                    while (i--) {
                        while (j--) {
                            if (notMine(i, j)) {
                                matrixContent[i][j] = calculateCell(i, j);
                            }
                        }
                        j = cols;
                    }
                },
            // Calculate the number of mines that the cell is bordered
                calculateCell = function (i, j) {
                    var count = 0;

                    // Check the neighboring cells
                    if (isMine(i - 1, j)) count++;
                    if (isMine(i + 1, j)) count++;
                    if (isMine(i, j - 1)) count++;
                    if (isMine(i, j + 1)) count++;

                    // Check the diagonal cells
                    if (isMine(i - 1, j - 1)) count++;
                    if (isMine(i - 1, j + 1)) count++;
                    if (isMine(i + 1, j - 1)) count++;
                    if (isMine(i + 1, j + 1)) count++;

                    return count;
                },
            // Checks the availability of cell index
                isValid = function (i, j) {
                    if (i >= 0 && i < rows && j >= 0 && j < cols) {
                        return true;
                    } else {
                        return false;
                    }
                },
                isOpened = function (i, j) {
                    if (!isValid(i, j)) return constants.OVERFLOW;
                    return matrixState[i][j] == constants.OPENED_STATE;
                },
                isClosed = function (i, j) {
                    if (!isValid(i, j)) return constants.OVERFLOW;
                    return matrixState[i][j] == constants.CLOSED_STATE;
                },
                isMine = function (i, j) {
                    if (!isValid(i, j)) return constants.OVERFLOW;
                    return matrixContent[i][j] == constants.MINE;
                },
                notMine = function (i, j) {
                    if (!isValid(i, j)) return constants.OVERFLOW;
                    return matrixContent[i][j] != constants.MINE;
                },
                isZero = function (i, j) {
                    if (!isValid(i, j)) return constants.OVERFLOW;
                    return matrixContent[i][j] == constants.ZERO;
                },
                isOther = function (i, j) {
                    if (!isValid(i, j)) return constants.OVERFLOW;
                    return matrixContent[i][j] != constants.ZERO && matrixContent[i][j] != constants.MINE;
                },
                isMarked = function (i, j) {
                    if (!isValid(i, j)) return constants.OVERFLOW;
                    return matrixState[i][j] == constants.MARKED_STATE;
                },
                openCell = function (i, j) {
                    if (isClosed(i, j)) {
                        numberClosed--;
                        matrixState[i][j] = constants.OPENED_STATE;
                    }
                },
                markCell = function (i, j) {
                    if (!isOpened(i, j)) {
                        if (isMarked(i, j)) {
                            matrixState[i][j] = constants.CLOSED_STATE;
                        } else {
                            matrixState[i][j] = constants.MARKED_STATE;
                        }
                        return true;
                    }
                    return false;
                },
            // Search and opening empty cells
                searchEmpty = function (i, j, arrChanges) {
                    openCell(i, j);
                    arrChanges.push({'i':i, 'j': j});
                    if (isOther(i, j)) return;

                    if (notMine(i - 1, j) && isClosed(i - 1, j)) {
                        searchEmpty(i - 1, j, arrChanges);
                    }
                    if (notMine(i + 1, j) && isClosed(i + 1, j)) {
                        searchEmpty(i + 1, j, arrChanges);
                    }
                    if (notMine(i, j - 1) && isClosed(i, j - 1)) {
                        searchEmpty(i, j - 1, arrChanges);
                    }
                    if (notMine(i, j + 1) && isClosed(i, j + 1)) {
                        searchEmpty(i, j + 1, arrChanges);
                    }

                    if (notMine(i - 1, j - 1) && isClosed(i - 1, j - 1)) {
                        searchEmpty(i - 1, j - 1, arrChanges);
                    }
                    if (notMine(i - 1, j + 1) && isClosed(i - 1, j + 1)) {
                        searchEmpty(i - 1, j + 1, arrChanges);
                    }
                    if (notMine(i + 1, j - 1) && isClosed(i + 1, j - 1)) {
                        searchEmpty(i + 1, j - 1, arrChanges);
                    }
                    if (notMine(i + 1, j + 1) && isClosed(i + 1, j + 1)) {
                        searchEmpty(i + 1, j + 1, arrChanges);
                    }
                };

            // Public methods --------------------------------------------- */
            this.tryOpenCell = function (i, j) {
                if (isOpened(i, j) || isMarked(i, j)) return;

                openCell(i, j);
                var arrChanges = [];
                arrChanges.push({'i':i, 'j': j});
                if (isZero(i, j)) {
                    searchEmpty(i, j, arrChanges);
                };

                this.dispatchEvent('changed', arrChanges);

                if (isMine(i, j)) {
                    this.dispatchEvent('lostGame');
                };
                if (numberClosed == mines) {
                    this.dispatchEvent('wonGame');
                };
            };

            this.tryMarkCell = function (i, j) {
                if (markCell(i, j)) {
                    var arrChanges = [];
                    arrChanges.push({'i':i, 'j': j});
                    this.dispatchEvent('changed', arrChanges);
                }
            };

            this.getContentCell = function(i, j) {
                if (!isValid(i, j)) return constants.OVERFLOW;
                return matrixContent[i][j];
            };

            this.isMine = isMine;
            this.isOpened = isOpened;
            this.isClosed = isClosed;
            this.isMarked = isMarked;

            this.getRows = function () {
                return rows;
            };

            this.getCols = function () {
                return cols;
            };

            // Initialization --------------------------------------------- */
            matrix.fillRandom(matrixContent, mines, constants.MINE);
            calculateCells();
        };

        // Inherit from event dispatcher
        Model.prototype = new app.utils.events.EventDispatcher();

        return Model;
    }
); 