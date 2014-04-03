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

/**
 * Model constants
 *
 * @namespace mines
 * @class mines.Constants
 */
mines.Constants =
{
    MINE: -1,
    ZERO: 0,
    CLOSED_STATE: 0,
    OPENED_STATE: 1,
    MARKED_STATE: 3,
    OVERFLOW: false,
    STATE_DURING: 0,
    STATE_WON: 1,
    STATE_LOST: 2
};


/**
 * Model of game class
 *
 * @namespace mines
 * @class mines.Model
 */
(function()
{
    mines.Model = function (cols, rows, numMines)
    {
        mines.Model.superclass.constructor.call(this);

        //--------------------------------------------------------------------------
        //  Modules
        //--------------------------------------------------------------------------

        var
            Constants = mines.Constants,
            Matrix = mines.utils.Matrix;

        //--------------------------------------------------------------------------
        //  Private members
        //--------------------------------------------------------------------------

        var
        // Matrix contains the number of mines in the neighborhood
            matrixContent = Matrix.create(rows, cols, Constants.ZERO),
        // Matrix states of the cells
            matrixState = Matrix.create(rows, cols, Constants.CLOSED_STATE),
            numberClosed = rows * cols, // The number of closed cells
            stateGame = Constants.STATE_DURING,
            startTime = new Date(),
            endTime;

        //--------------------------------------------------------------------------
        //  Private methods
        //--------------------------------------------------------------------------

        /**
         * Calculate neighborhood mines for each cell of the field
         */
        var calculateCells = function () {
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
        };

        /**
         * Calculate the number of mines that the cell is bordered
         * @param i
         * @param j
         * @returns {number}
         */
        var calculateCell = function (i, j) {
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
        };

        /**
         * Checks the availability of cell index
         * @param i
         * @param j
         * @returns {boolean}
         */
        var isValid = function (i, j) {
            if (i >= 0 && i < rows && j >= 0 && j < cols) {
                return true;
            } else {
                return false;
            }
        };

        var isOpened = function (i, j) {
            if (!isValid(i, j)) return Constants.OVERFLOW;
            return matrixState[i][j] == Constants.OPENED_STATE;
        };

        var isClosed = function (i, j) {
            if (!isValid(i, j)) return Constants.OVERFLOW;
            return matrixState[i][j] == Constants.CLOSED_STATE;
        };

        var isMine = function (i, j) {
            if (!isValid(i, j)) return Constants.OVERFLOW;
            return matrixContent[i][j] == Constants.MINE;
        };

        var notMine = function (i, j) {
            if (!isValid(i, j)) return Constants.OVERFLOW;
            return matrixContent[i][j] != Constants.MINE;
        };

        var isZero = function (i, j) {
            if (!isValid(i, j)) return Constants.OVERFLOW;
            return matrixContent[i][j] == Constants.ZERO;
        };

        var isOther = function (i, j) {
            if (!isValid(i, j)) return Constants.OVERFLOW;
            return matrixContent[i][j] != Constants.ZERO && matrixContent[i][j] != Constants.MINE;
        };

        var isMarked = function (i, j) {
            if (!isValid(i, j)) return Constants.OVERFLOW;
            return matrixState[i][j] == Constants.MARKED_STATE;
        };

        var openCell = function (i, j) {
            if (isClosed(i, j)) {
                numberClosed--;
                matrixState[i][j] = Constants.OPENED_STATE;
            }
        };

        var markCell = function (i, j) {
            if (!isOpened(i, j)) {
                if (isMarked(i, j)) {
                    matrixState[i][j] = Constants.CLOSED_STATE;
                } else {
                    matrixState[i][j] = Constants.MARKED_STATE;
                }
                return true;
            }
            return false;
        };

        /**
         * Search and opening empty cells
         * @param i
         * @param j
         * @param arrChanges
         */
        var searchEmpty = function (i, j, arrChanges) {
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

        //--------------------------------------------------------------------------
        //  Public methods
        //--------------------------------------------------------------------------

        this.tryOpenCell = function (i, j) {
            if (isOpened(i, j) || isMarked(i, j)) return;

            openCell(i, j);
            var arrChanges = [];
            arrChanges.push({'i':i, 'j': j});
            if (isZero(i, j)) {
                searchEmpty(i, j, arrChanges);
            }

            this.dispatchEvent('changed', arrChanges);

            if (isMine(i, j)) {
                endTime = new Date();
                this.dispatchEvent('lostGame');
                stateGame = Constants.STATE_LOST;
            }
            if (numberClosed == numMines) {
                endTime = new Date();
                this.dispatchEvent('wonGame');
                stateGame = Constants.STATE_WON;
            }
        };

        this.tryMarkCell = function (i, j) {
            if (markCell(i, j)) {
                var arrChanges = [];
                arrChanges.push({'i':i, 'j': j});
                this.dispatchEvent('changed', arrChanges);
            }
        };

        this.getContentCell = function(i, j) {
            if (!isValid(i, j)) return Constants.OVERFLOW;
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

        this.getMines = function () {
            return numMines;
        };

        this.isWon = function () {
            if (stateGame == Constants.STATE_WON) {
                return true;
            } else {
                return false;
            }
        };

        this.getTime = function () {
            if (endTime) {
                return (endTime.getTime() - startTime.getTime()) / 1000;
            }
        };

        // Initialization
        Matrix.fillRandom(matrixContent, numMines, Constants.MINE);
        calculateCells();
    };

    // Inherit from event dispatcher
    extend(mines.Model, mines.utils.EventDispatcher);
})();

