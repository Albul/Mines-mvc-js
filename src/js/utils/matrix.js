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

define('utils.matrix', function (app) {

    // Modules --------------------------------------------- */
    var math = app.utils.math;

    // Private methods --------------------------------------------- */
    var
        createMatrix = function (rows, cols) {
            var matrix = new Array(rows),
                i = matrix.length;

            while (i--) {
                matrix[i] = new Array(cols);
            }
            return matrix;
        },
        fillMatrix = function (matrix, value) {
            var i = matrix.length,
                j = matrix[0].length;

            while (i--) {
                while (j--) {
                    matrix[i][j] = value;
                }
                j = matrix[0].length;
            }
        };

    // Public methods --------------------------------------------- */
    return {

        /**
         * Creating a two-dimensional array
         * @param rows
         * @param cols
         * @param value
         * @return {Array}
         */
        create: function (rows, cols, value) {
            var matrix = createMatrix(rows, cols);
            if (typeof value != 'undefined') {
                fillMatrix(matrix, value);
            }
            return matrix;
        },

        /**
         * Filling the existing two-dimensional array specified value
         * @param matrix
         * @param value
         */
        fill: function (matrix, value) {
            fillMatrix(matrix, value);
        },

        fillRandom : function (matrix, amount, value) {
            var maxI = matrix.length - 1,
                maxJ = matrix[0].length - 1,
                i, j;

            while (amount) {
                i = math.getRandomInt(0, maxI);
                j = math.getRandomInt(0, maxJ);
                while (matrix[i][j] == value) {
                    i = math.getRandomInt(0, maxI);
                    j = math.getRandomInt(0, maxJ);
                }
                matrix[i][j] = value;
                amount--;
            }
        }
    }
});