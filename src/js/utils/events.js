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
define('utils.events', function (app) {
    return {
        EventDispatcher:function () {
            var eventListeners = {
                any: []         // ��� �������: ���������
            };

            // ���������� �������� ��� �����������
            var visitListeners = function (action, type, event) {
                var pubtype = eventListeners.hasOwnProperty(type)? type : 'any';
                var listeners = eventListeners[pubtype];

                for (var i = 0, max = listeners.length; i < max; i++) {
                    if (action === 'dispatch') {
                        listeners[i](event);
                    } else {
                        if (listeners[i] === event) {
                            listeners.splice(i, 1);
                        }
                    }
                }
            };

            /**
             * ������������ ������ �������������� ������� �� ������� EventDispatcher ��� ��������� ��������������� ����������� � �������
             * @param type ��� �������
             * @param listener ������� ��������������, �������������� �������
             */
            this.addEventListener = function (type, listener) {
                type = type || 'any';
                if (typeof eventListeners[type] === "undefined") {
                    eventListeners[type] = [];
                }
                eventListeners[type].push(listener);
            };

            /**
             * ������� �������������� �� ������� EventDispatcher
             * @param type ��� �������
             * @param listener ������� ��������������, �������������� �������
             */
            this.removeEventListener = function (type, listener) {
                visitListeners('remove', type, listener);
            };

            /**
             * �������� �������
             * @param type ��� �������
             * @param event ������ ������� ������������ �����������
             */
            this.dispatchEvent = function (type, event) {
                visitListeners('dispatch', type, event);
            };

        }
    }
});