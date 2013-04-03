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
    'controller',
    ['utils', 'jquery'],
    function(utils, $) {

        var Controller = function (model, view) {
            var 
				canvasPosition = utils.dom.getElementPosition(document.getElementById("canvas"));
				endGame = function () {
                    model.removeEventListener('wonGame', endGame);
                    model.removeEventListener('lostGame', endGame);
                    view.canvas.removeEventListener('click', onClick);
                },
                onClick = function (e) {			
                    var cell = view.getCellAtMouse(e.clientX + window.scrollX - canvasPosition.x, e.clientY + window.scrollY - canvasPosition.y);
                    model.openCell(cell.i, cell.j);
                };

            /* Инициализация */
            view.canvas.addEventListener('click', onClick);
            $(view.canvas).mousedown(function (event) {
                //alert(['Left', 'Middle', 'Right'][event.which - 1]);
                if (event.which == 3) {
                    $(this)[0].oncontextmenu = function() {
                        return false;
                    }
                }
            });
//            $(view.canvas).bind("contextmenu", function(e){ alert('ura'); return false; })
            window.document.body.onselectstart = function () {return false;};
            view.canvas.addEventListener('click', onClick);
            model.addEventListener('wonGame', endGame);
            model.addEventListener('lostGame', endGame);
        };
        return Controller;
    }
);

// 					var start = new Date();					
// 
// 					var end = new Date();
// 					console.log('Скорость ' + (end.getTime()-start.getTime()) + ' мс');