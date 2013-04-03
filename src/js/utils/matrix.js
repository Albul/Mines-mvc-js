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

/* Модуль работы с двухмерными массивами */
define('utils.matrix', function (app) {

	var math = app.utils.math;

	var createMatrix = function (rows, cols) {
		var matrix = new Array(rows),
			i = matrix.length;

		while (i--) {
			matrix[i] = new Array(cols);
		}
		return matrix;
	};

	var fillMatrix = function (matrix, value) {
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
		 * Создание двухмерного массива
		 * @param rows Количество рядков
		 * @param cols Количество столбцов
		 * @param value Значение которым будет заполнен массив
		 * @return {Array} Созданный двухмерный массив
		 */
		create: function (rows, cols, value) {
			var matrix = createMatrix(rows, cols);
			if (typeof value != 'undefined') {
				fillMatrix(matrix, value);
			}
			return matrix;
		},

		/**
		 * Заполнение существующего двухмерного массива указанным значением
		 * @param matrix Двухмерный массив
		 * @param value Значение которым будет заполнен массив
		 */
		fill: function (matrix, value) {
			fillMatrix(matrix, value);
		}
	}

});