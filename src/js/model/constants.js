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

define('constants', function (app) {
    return {
        MINE: -1,
        ZERO: 0,
        CLOSED_STATE: 0,
        OPENED_STATE: 1,
        MARKED_STATE: 3,
        OVERFLOW: false,
        STATE_DURING: 0,
        STATE_WON: 1,
        STATE_LOST: 2
    };
});