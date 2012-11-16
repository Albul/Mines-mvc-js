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
    'utils',
    function () {
        var utils = {};


        utils.math = (function () {
            return {

                /**
                 * Возвращает случайное число из указанного диапазона
                 * @param min Минимально допустимое значение
                 * @param max Максимально допустимое значение
                 * @return {Number}
                 */
                getRandomInt : function (min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }
            }
        }());


        utils.lang = (function () {
            return {

                /**
                 * Конвертация значения в логический тип
                 * @param val Входное значение
                 * @return Boolean
                 */
                parseBool : function (val) {
                    switch (val.toString().toLowerCase()) {
                        case "true":
                        case "1":
                        case "yes":
                        case "y":
                            return true;
                        case "false":
                        case "0":
                        case "no":
                        case "n":
                            return false;
                        default:
                            return false;
                    }
                }
            }
        }());


        utils.array = (function () {
            var math = utils.math,

                createArray = function (length) {
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

                createMatrix: function (cols, rows) {
                    var arr = new Array(cols);
                    for (var i = 0, max = arr.length; i < max; i++) {
                        arr[i] = new Array(rows);
                    }
                    return arr;
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
            };

        }());


        /**
         * Модуль работы с двухмерными массивами
         * @type {*}
         */
        utils.matrix = (function () {
            var math = utils.math,
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

            return {
                /**
                 *
                 */
                create: function (rows, cols, value) {
                    var matrix = createMatrix(rows, cols);
                    if (typeof value != 'undefined') {
                        fillMatrix(matrix, value);
                    }
                    return matrix;
                },

                fill: function (matrix, value) {
                    fillMatrix(matrix, value);
                },

                /**
                 * Устанавливает у случайные ячейки матрицы указанное значение, указанное число раз
                 * @param matrix Матрица которую заполняем
                 * @param amount Количество случайно выбраных ячеек которые нужно заполнить
                 * @param value Значение которым заполняем ячейки
                 */
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

        }());

        utils.collision = (function () {

            return {

                /**
                 * Проверяет на столкновение объекта с точькой
                 */
                hitTestPoint: function (obj, x, y) {
                    if (obj.x < x && obj.y < y
                        && obj.x + obj.width > x
                        && obj.y + obj.height > y) {
                        return true;
                    } else {
                        return false;
                    }
                }

            }
        }());

        utils.dom = (function () {

            return {
                /**
                 * Возвращает глобальные координаты элемента страници
                 * @param element HTMLElement
                 * @return {Object}
                 */
                getElementPosition: function (element) {
                    var elem = element, tagname = '', x = 0, y = 0;

                    while((typeof(elem) == 'object') && (typeof(elem.tagName) != 'undefined')) {
                        y += elem.offsetTop;
                        x += elem.offsetLeft;
                        tagname = elem.tagName.toUpperCase();

                        if(tagname == 'BODY') elem = 0;

                        if(typeof(elem) == 'object') {
                            if(typeof(elem.offsetParent) == 'object')
                                elem = elem.offsetParent;
                        }
                    }

                    return {x: x, y: y};
                }
            }

        }());

        return utils;
    }
); 