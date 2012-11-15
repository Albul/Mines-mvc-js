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
    function() {
		         //http://js-tut.aardon.de/js-tut/tutorial/position.html
         function getElementPosition(element) {
            var elem=element, tagname="", x=0, y=0;
           
            while((typeof(elem) == "object") && (typeof(elem.tagName) != "undefined")) {
               y += elem.offsetTop;
               x += elem.offsetLeft;
               tagname = elem.tagName.toUpperCase();

               if(tagname == "BODY")
                  elem=0;

               if(typeof(elem) == "object") {
                  if(typeof(elem.offsetParent) == "object")
                     elem = elem.offsetParent;
               }
            }

            return {x: x, y: y};
         }
         
        var Controller = function (model, view) {
            /*         view.canvas.addEventListener('mousemove', function (e) {
             console.log(e.offsetX, e.offsetY);
             view.getBoxAtMouse(e.offsetX, e.offsetY);
             });*/

            view.canvas.addEventListener('click', function (e) {
                console.log(e.offsetX, e.offsetY);
				 var canvasPosition = getElementPosition(document.getElementById("canvas"));
				 
                var cell = view.getCellAtMouse(e.clientX - canvasPosition.x, e.clientY - canvasPosition.y);
                model.openCell(cell.i, cell.j);
            });
        };
        return Controller;
    }
);