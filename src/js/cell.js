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
define('components.Cell', function (app) {

    /**
     * Метод для рисования прямоугольника из закругленными углами
     * @param x
     * @param y
     * @param width
     * @param height
     * @param radius
     * @param fill
     * @param stroke
     */
	CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius, fill, stroke) {
		this.beginPath();
		this.moveTo(x + radius, y);
		this.lineTo(x + width - radius, y);
		this.quadraticCurveTo(x + width, y, x + width, y + radius);
		this.lineTo(x + width, y + height - radius);
		this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		this.lineTo(x + radius, y + height);
		this.quadraticCurveTo(x, y + height, x, y + height - radius);
		this.lineTo(x, y + radius);
		this.quadraticCurveTo(x, y, x + radius, y);
		this.closePath();
		if (fill) {
			this.fill();
		}
		if (stroke) {
			this.stroke();
		}
	};

    var constants = app.constants;
    var canvas = document.getElementById("canvas");

    var context = canvas.getContext('2d'),
        Cell = function (i, j) {
            this.i = i;
            this.j = j;
            this.x = j * this.SIZE + 3; //
            this.y = i * this.SIZE + 3; //
            this.width = this.SIZE; //
            this.height = this.SIZE; //
            this.state = constants.CLOSED_STATE;
            this.content = constants.ZERO;
        };

    Cell.prototype.TOP_COLOR_OPENED = '#fcfcfc';
    Cell.prototype.BOTTOM_COLOR_OPENED = '#e1dfde';
    Cell.prototype.TOP_COLOR_CLOSED = '#8cb0dc';
    Cell.prototype.BOTTOM_COLOR_CLOSED = '#7aa1d2';
    // Цвет мины
    Cell.prototype.MINE_COLOR_FILL = '#7B7B7B';
    Cell.prototype.MINE_COLOR_STROKE = '#121212';

    Cell.prototype.COLORS_NUMBER = [
        '#0000FF', '#00A000', '#FF0000', '#00007F',
        '#A00000', '#00CCFF', '#A000A0', '#000000'
    ];

    Cell.prototype.SIZE = 60;
    Cell.prototype.RADIUS = 7;
	Cell.SIZE = 60;
    Cell.prototype.FONT_SIZE = 54;
    Cell.prototype.imgFlag = new Image();
    Cell.prototype.imgFlag.src = '../asset/flag.png';
    Cell.prototype.imgMine = new Image();
    Cell.prototype.imgMine.src = '../asset/mine.png';

    /**
     * Отрисовка мины
     */
    Cell.prototype.drawMine = function () {
        context.drawImage(this.imgMine, this.x + 2, this.y + 2);
    };

    /**
     * Отрисовка флага
     */
    Cell.prototype.drawFlag = function () {
        context.drawImage(this.imgFlag, this.x + 2, this.y + 2);
    };

    /**
     * Отрисовка зачеркнутости флага
     */
    Cell.prototype.drawStrike = function () {
        context.save();
        context.lineWidth = 6;
        context.strokeStyle = this.MINE_COLOR_STROKE;
        context.lineCap = "round";
        context.beginPath();
        context.moveTo(this.x + 5, this.y + 5);
        context.lineTo(this.x + this.SIZE - 8, this.y + this.SIZE - 8);
        context.moveTo(this.x + this.SIZE - 8, this.y + 5);
        context.lineTo(this.x + 5, this.y + this.SIZE - 8);
        context.stroke();
        context.closePath();
        context.restore();
    };

    Cell.prototype.draw = function() {
        var grd = context.createLinearGradient(this.x, this.y, this.x, this.y + this.height);

        if (this.isOpened()) {
            grd.addColorStop(0, this.TOP_COLOR_OPENED);
            grd.addColorStop(1, this.BOTTOM_COLOR_OPENED);
        } else {
            grd.addColorStop(0, this.TOP_COLOR_CLOSED);
            grd.addColorStop(1, this.BOTTOM_COLOR_CLOSED);
        }
        context.lineWidth = 1;
        context.fillStyle = grd;
        context.strokeStyle = "#7d838c";
        context.roundRect(this.x, this.y, this.SIZE, this.SIZE, this.RADIUS, true, false);
        context.roundRect(this.x -1 , this.y - 1, this.SIZE, this.SIZE, this.RADIUS, false, true);

        if (this.isOpened()) {
            // Отрисовываем число в средине ячейки
            if (typeof this.content != 'undefined' && this.isOther()) {
                context.font = 'bold ' + this.FONT_SIZE + 'px Arial';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                // В зависимости от числа в ячейке назначаем соответствующий цвет из массива
                context.fillStyle = this.COLORS_NUMBER[(this.content - 1) % this.COLORS_NUMBER.length];
                context.fillText(this.content.toString(), this.x + this.SIZE / 2, this.y + this.SIZE / 2);
            }

            if (this.isMine()) {
                this.drawMine();
            }
        } else {
            if (this.isMarked()) {
                this.drawFlag();
            }
        }
    };

    Cell.prototype.isOpened = function () {
        return this.state == constants.OPENED_STATE;
    };

    Cell.prototype.isClosed = function () {
        return this.state == constants.CLOSED_STATE;
    };

    Cell.prototype.isMarked = function () {
        return this.state == constants.MARKED_STATE;
    };

    Cell.prototype.isMine = function () {
        return this.content == constants.MINE;
    };

    Cell.prototype.isZero = function () {
        return this.content == constants.ZERO;
    };

	Cell.prototype.isOther = function () {
        return this.content != constants.ZERO && this.content != constants.MINE;
    };

    Cell.prototype.open = function () {
        this.state = constants.OPENED_STATE;
        this.draw();
    };

    Cell.prototype.mark = function () {
        this.state = constants.MARKED_STATE;
        this.draw();
    };

    Cell.prototype.unMark = function () {
        this.state = constants.CLOSED_STATE;
        this.draw();
    };

    return Cell;
});