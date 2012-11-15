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
    'view',
    ['utils'],
    function(utils) {

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
            var
                ROWS = model.getRows(),
                COLS = model.getCols(),
                context = this.canvas.getContext('2d'),
                Cell = function (i, j) {
                    this.i = i;
                    this.j = j;
                    this.x = j * this.SIZE + 3; //
                    this.y = i * this.SIZE + 3; //
                    this.width = this.SIZE; //
                    this.height = this.SIZE; //
                },
                openCell = function (cell) {
                    cell.draw(model.getContentCell(cell.i, cell.j), model.isOpened(cell.i, cell.j));
                };

            Cell.prototype.TOP_COLOR_OPENED = '#fcfcfc';
            Cell.prototype.BOTTOM_COLOR_OPENED = '#e1dfde';
            Cell.prototype.TOP_COLOR_CLOSED = '#8cb0dc';
            Cell.prototype.BOTTOM_COLOR_CLOSED = '#7aa1d2';
            Cell.prototype.SIZE = 60;
            Cell.prototype.draw = function(content, isOpened) {
                var grd = context.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
                if (isOpened) {
                    grd.addColorStop(0, this.TOP_COLOR_OPENED);
                    grd.addColorStop(1, this.BOTTOM_COLOR_OPENED);
                } else {
                    grd.addColorStop(0, this.TOP_COLOR_CLOSED);
                    grd.addColorStop(1, this.BOTTOM_COLOR_CLOSED);
                }

                context.fillStyle = grd;
                context.strokeStyle = "#7d838c";
                context.roundRect(this.x, this.y, this.width, this.height, 6, true, false);
                context.roundRect(this.x -1 , this.y - 1, this.width, this.height, 6, false, true);
                if (typeof content != 'undefined' && content != 0) {
                    context.font = 'bold 36px Arial';
                    context.textAlign = 'center';
                    context.textBaseline = 'middle';
                    context.fillStyle = 'blue';
                    context.fillText(content.toString(), this.x + this.width / 2, this.y + this.height / 2);
                }

            };

            var cells = utils.array.createMatrix(8, 8);
            for (var i = 0; i < ROWS; i++) {            //
                for (var j = 0; j < COLS; j++) {
                    cells[i][j] = new Cell(i, j);
                    cells[i][j].draw(0, false);
                }
            }

            /**
             * Получить клетку из под координат мышки
             * @param mouseX
             * @param mouseY
             * @return {*}
             */
            this.getCellAtMouse = function (mouseX, mouseY) {
                var cell,
                    i = ROWS,
                    j = COLS;

                while (i--) {
                    while (j--) {
                        cell = cells[i][j];
                        if (utils.collision.hitTestPoint(cell, mouseX, mouseY)) {
                             //box.color = '#ff0000';
                             //box.draw();
                            return cell;
                        }
                    }
                    j = COLS;
                }
                return cell;
            };

            var update = function (arrChanges) {
//                alert(e.i.toString() + e.j.toString());

                for (var i = arrChanges.length; i--;) {
                    openCell(cells[arrChanges[i]['i']][arrChanges[i]['j']]);
                }
            };

            /* Инициализация */
            model.addEventListener('changed', update);
        };

        return View;
    }
); 