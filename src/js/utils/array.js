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

    var math = app.utils.math;

    var createArray = function (length) {
        var arr = new Array(length),
            i = length;

        while (i--) {
            arr[i] = i + 1;
        }
        return arr;
    };

    var fillArray = function (length, value) {
            var arr = new Array(length),
                i = length;

            while (i--) {
                arr[i] = value;
            }

            return arr;
        };

    var shuffle = function (arr, start, end) {
            for(var j, x, i = end; i >= start;
                j = math.getRandomInt(start, end), x = arr[i], arr[i] = arr[j], arr[j] = x, i--);
            return arr;
        };

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
         * Создает случайный массив чисел из указаного диапазона, указанной длины
         * @param from Начало диапазона выборки
         * @param to Конец диапазона выборки
         * @param length Длина массива
         * @param arrExceptions Массив исключений которые входят в диапазон выборки,
         * но не должны попасть у выходной массив
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
         * Перемешивает входной массив случайным образом
         * @param arr Входной массив
         * @param start Начало диапазона перемешивания
         * @param end Конец диапазона перемешивания
         * @return {Array}
         */
        shuffle : function (arr, start, end) {
            if (typeof start == 'undefined' || typeof end == 'undefined') {
                return shuffle(arr, 0, arr.length - 1);
            } else {
                return shuffle(arr, start, end);
            }
        },

        amount : function (arr, value) {
            var result = 0;

            for (var i = arr.length; i--;) {
                if (arr[i] == value) result++;
            }
            return result;
        }
    }
});