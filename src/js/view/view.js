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
define('view.View', function (app) {

        CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius, fill, stroke) {
            if (width < 2 * radius) radius = width / 2;
            if (height < 2 * radius) radius = height / 2;
            this.beginPath();
            this.moveTo(x + radius, y);
            this.arcTo(x + width, y, x + width, y + height, radius);
            this.arcTo(x + width, y + height, x, y + height, radius);
            this.arcTo(x, y + height, x, y, radius);
            this.arcTo(x, y, x + width, y, radius);
            this.closePath();
            if (fill) {
                this.fill();
            }
            if (stroke) {
                this.stroke();
            }
        };

        var View = function (model) {
            this.canvas = document.getElementById("canvas");

            // Modules --------------------------------------------- */
            var
                collision = app.utils.collision,
                matrix = app.utils.matrix;

            // Private members --------------------------------------------- */
            var
                ROWS = model.getRows(),
                COLS = model.getCols(),
                context = this.canvas.getContext('2d');

            // Cell --------------------------------------------- */
            var
                Cell = function (i, j) {
                    this.i = i;
                    this.j = j;
                    this.x = j * this.SIZE + 3; //
                    this.y = i * this.SIZE + 3; //
                    this.width = this.SIZE; //
                    this.height = this.SIZE; //
                },
                updateCell = function (cell) {
                    cell.draw(model.getContentCell(cell.i, cell.j), model.isOpened(cell.i, cell.j), model.isMine(cell.i, cell.j), model.isMarked(cell.i, cell.j));
                };

            Cell.prototype.TOP_COLOR_OPENED = '#fcfcfc';
            Cell.prototype.BOTTOM_COLOR_OPENED = '#e1dfde';
            Cell.prototype.TOP_COLOR_CLOSED = '#8cb0dc';
            Cell.prototype.BOTTOM_COLOR_CLOSED = '#7aa1d2';

            Cell.prototype.MINE_COLOR_FILL = '#7B7B7B';
            Cell.prototype.MINE_COLOR_STROKE = '#121212';

            Cell.prototype.COLORS_NUMBER = [
                '#0000FF', '#00A000', '#FF0000', '#00007F',
                '#A00000', '#00CCFF', '#A000A0', '#000000'
            ];

            Cell.prototype.SIZE = 60;
            Cell.SIZE = 60;
            Cell.prototype.FONT_SIZE = 54;
            Cell.prototype.THORN_HEIGHT = 8;

            Cell.prototype.imgFlag = new Image();
            Cell.prototype.imgFlag.src = '../asset/flag.png';
            Cell.prototype.imgMine = new Image();
            Cell.prototype.imgMine.src = '../asset/mine.png';

            /**
             * Drawing the mines in the middle of the cell
             */
            Cell.prototype.drawMine = function () {
                var
                    x0 = this.x + this.SIZE / 2,
                    y0 = this.y + this.SIZE / 2,
                    r = this.SIZE / 3.5,
                    angle = 2 * Math.PI,
                    x1, y1,
                    x2, y2,
                    gradient = context.createRadialGradient(x0 - 4, y0 - 2, 0, x0 - 4, y0 - 2, r);

                gradient.addColorStop(0, this.MINE_COLOR_FILL);
                gradient.addColorStop(1, this.MINE_COLOR_STROKE);

                // Circle of mine
                context.beginPath();
                context.arc(x0, y0, r, 0, 2 * Math.PI, false);
                context.fillStyle = gradient;
                context.fill();
                context.lineWidth = 5;
                context.strokeStyle = this.MINE_COLOR_STROKE;
                context.stroke();

                // thorns of mine
                while (angle) {
                    x1 = x0 + r * Math.cos(angle);
                    y1 = y0 + r * Math.sin(angle);
                    x2 = x0 + (r + this.THORN_HEIGHT) * Math.cos(angle);
                    y2 = y0 + (r + this.THORN_HEIGHT) * Math.sin(angle);
                    context.beginPath();
                    context.moveTo(x1, y1);
                    context.lineTo(x2, y2);
                    context.stroke();
                    angle -= Math.PI / 4;
                }

                // Thorn in the middle of mine
                context.moveTo(x0, y0 - this.THORN_HEIGHT / 4);
                context.lineTo(x0 , y0 + this.THORN_HEIGHT / 4);
                context.stroke();
            };

            Cell.prototype.drawFlag = function () {
                context.drawImage(this.imgFlag, this.x + 2, this.y + 2);
            };

            Cell.prototype.drawStrikeoutFlag = function () {
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

            Cell.prototype.draw = function(content, isOpened, isMine, isMarked) {
                var grd = context.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
                if (isOpened) {
                    grd.addColorStop(0, this.TOP_COLOR_OPENED);
                    grd.addColorStop(1, this.BOTTOM_COLOR_OPENED);
                } else {
                    grd.addColorStop(0, this.TOP_COLOR_CLOSED);
                    grd.addColorStop(1, this.BOTTOM_COLOR_CLOSED);
                }
                context.lineWidth = 1;
                context.fillStyle = grd;
                context.strokeStyle = "#7d838c";
                context.roundRect(this.x, this.y, this.SIZE, this.SIZE, 6, true, false);
                context.roundRect(this.x -1 , this.y - 1, this.SIZE, this.SIZE, 6, false, true);

                if (isOpened) { // Drawing number in the middle of the cell
                    if (typeof content != 'undefined' && content > 0) {
                        context.font = 'bold ' + this.FONT_SIZE + 'px Arial';
                        context.textAlign = 'center';
                        context.textBaseline = 'middle';
                        context.fillStyle = this.COLORS_NUMBER[(content - 1) % this.COLORS_NUMBER.length];
                        context.fillText(content.toString(), this.x + this.SIZE / 2, this.y + this.SIZE / 2);
                    }

                    if (isMine) {
                        this.drawMine();
                    }
                } else {
                    if (isMarked) {
                        this.drawFlag();
                    }
                }
            };

            // Events handlers --------------------------------------------- */
            this.getCellAtMouse = function (mouseX, mouseY) {
                var cell,
                    i = ROWS,
                    j = COLS;

                while (i--) {
                    while (j--) {
                        cell = cells[i][j];
                        if (collision.hitTestPoint(cell, mouseX, mouseY)) {
                            return cell;
                        }
                    }
                    j = COLS;
                }
                return cell;
            };

            // Events handlers --------------------------------------------- */
            var
                update = function (arrChanges) {
                    for (var i = arrChanges.length; i--;) {
                        updateCell(cells[arrChanges[i]['i']][arrChanges[i]['j']]);
                    }
                },
                onLostGame = function () {
                    for (var i = 0; i < ROWS; i++) {
                        for (var j = 0; j < COLS; j++) {
                            if (model.isMine(i, j) && !model.isMarked(i, j))
                                cells[i][j].drawMine();
                            if (model.isMarked(i, j) && !model.isMine(i, j)) {
                                cells[i][j].drawStrikeoutFlag();
                            }
                        }
                    }
                    alert('Игра окончена');
                };

            // Initialization --------------------------------------------- */
            this.canvas.width = Cell.SIZE * COLS + 20;
            this.canvas.height = Cell.SIZE * ROWS + 20;

            var cells = matrix.create(ROWS, COLS);
            for (var i = 0; i < ROWS; i++) {
                for (var j = 0; j < COLS; j++) {
                    cells[i][j] = new Cell(i, j);
                    cells[i][j].draw(0, false, false, false);
                }
            }
            model.addEventListener('changed', update);
            model.addEventListener('lostGame', onLostGame);
        };

        return View;
    }
); 