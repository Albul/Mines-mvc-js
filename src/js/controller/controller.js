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

define('controller.Controller', function (app) {
    var Controller = function (model, view) {
        var
            dom = app.utils.dom,
            canvasPosition = dom.getElementPosition(document.getElementById("canvas"));

        // Events handlers --------------------------------------------- */
        var
            onEndGame = function () {
                model.removeEventListener('wonGame', onEndGame);
                model.removeEventListener('lostGame', onEndGame);
                view.canvas.removeEventListener('click', onClick);
                view.canvas.removeEventListener('mousedown', onMouseDown);
                view.canvas.removeEventListener('mouseup', onMouseUp);
            },
            onClick = function (e) {
                if (e.which == 3) {
                    return;
                }
                var cell = view.getCellAtMouse(e.clientX + window.scrollX - canvasPosition.x, e.clientY + window.scrollY - canvasPosition.y);
                model.tryOpenCell(cell.i, cell.j);
            },
            onMouseDown = function (e) {
                if (e.which == 3) {
                    this.oncontextmenu = function () {
                        return false;
                    };
                }
            },
            onMouseUp = function (e) {
                if (e.which == 3) { // Right click
                    var cell = view.getCellAtMouse(e.clientX + window.scrollX - canvasPosition.x, e.clientY + window.scrollY - canvasPosition.y);
                    model.tryMarkCell(cell.i, cell.j);
                }
            };

        // Initialization --------------------------------------------- */
        view.canvas.addEventListener('click', onClick);
        view.canvas.addEventListener('mousedown', onMouseDown);
        view.canvas.addEventListener('mouseup', onMouseUp);
        model.addEventListener('wonGame', onEndGame);
        model.addEventListener('lostGame', onEndGame);
        window.document.body.onselectstart = function () {return false;};
    };
    return Controller;
});