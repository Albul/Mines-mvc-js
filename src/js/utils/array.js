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

define('utils.array', function (app) {

    // Modules --------------------------------------------- */
    var math = app.utils.math;

    // Private methods --------------------------------------------- */
    var createArray = function (length) {
            var arr = new Array(length),
                i = length;

            while (i--) {
                arr[i] = i + 1;
            }
            return arr;
        },
        fillArray = function (length, value) {
            var arr = new Array(length),
                i = length;

            while (i--) {
                arr[i] = value;
            }

            return arr;
        },
        shuffle = function (arr, start, end) {
            for(var j, x, i = end; i >= start;
                j = math.getRandomInt(start, end), x = arr[i], arr[i] = arr[j], arr[j] = x, i--);
            return arr;
        };

    // Add to prototype of array the method clone
    Array.prototype.clone = function() {
        return this.slice(0);
    };

    // Public methods --------------------------------------------- */
    return {

        /**
         * Create array and fills it with the specified value or indexes starting from 1
         * @param length Length of the array
         * @param value The value of the array elements
         */
        create: function (length, value) {
            if (typeof value == 'undefined') {
                return createArray(length);
            } else {
                return fillArray(length, value);
            }
        },

        /**
         * Creates a random array of numbers from a specified range of the specified length
         * @param from Start of range sampling
         * @param to End of range sampling
         * @param length Length of the array
         * @param arrExceptions An array of exceptions that are included in sampling range,
         * but should not put in the output array
         * @return {Array}
         */
        createRandom : function (from, to, length, arrExceptions) {
            var arr = new Array(length),
                item;

            for (var i = length; i--;) {
                item = math.getRandomInt(from, to);
                while (arr.indexOf(item) != -1 || arrExceptions.indexOf(item) != -1) {
                    item = math.getRandomInt(from, to);
                }
                arr[i] = item;
            }
            return arr;
        },

        /**
         * Shuffles input array randomly
         * @param arr The input array
         * @param start Start of range of shuffling
         * @param end End of the range of shuffling
         * @return {Array}
         */
        shuffle : function (arr, start, end) {
            if (typeof start == 'undefined' || typeof end == 'undefined') {
                return shuffle(arr, 0, arr.length - 1);
            } else {
                return shuffle(arr, start, end);
            }
        },

        /**
         * Counts the number of elements in the array with a given value
         * @param arr The input array
         * @param value The input value
         * @return {number}
         */
        amount : function (arr, value) {
            var result = 0;

            for (var i = arr.length; i--;) {
                if (arr[i] == value) result++;
            }
            return result;
        }
    }
});