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
var APP_NAME = 'MINES';
window[APP_NAME] = {};

function define(namespace, factory) {
    var parts = namespace.split('.'),
        parent = window[APP_NAME];

    for (var i = 0, length = parts.length; i < length; i++) {
        // Create a property, if it is not found
        if (typeof parent[parts[i]] === "undefined") {
            if (i == length - 1) {
                parent[parts[i]] = factory(window[APP_NAME]);
            } else {
                parent[parts[i]] = {};
            }
        }
        parent = parent[parts[i]];
    }
}
