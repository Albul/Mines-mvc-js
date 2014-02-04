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

define('utils.dom', function (app) {

    // Public methods --------------------------------------------- */
    return {

        /**
         * Returns the global coordinates of the element on the page
         * @param element HTMLElement
         * @return {Object}
         */
        getElementPosition: function (element) {
            var elem = element,
                tagname = '',
                x = 0,
                y = 0;

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
});