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
requirejs.config({
    baseUrl: 'js/',
	paths: {  
		'jquery':		'libs/jquery',
		'jqm':			'libs/jquery.mobile',
		'view':			'view/view',
		'utils':		'utils/utils',
		'events':		'utils/events',
		'controller':	'controller/controller',
		'model':		'model/model',
		'cells':		'model/cells',
		'constants':	'model/constants'
   }
});


requirejs(
    ['jquery', 'jqm', 'model', 'view', 'controller'],
    function($, jqm, Model, View, Controller) {
		$('#canvas').css({position: "absolute", left: ($(window).width() - $('#canvas').width()) / 2, marginLeft: 0});
        var model = new Model(8, 8, 10);
        var view = new View(model);
        var controller = new Controller(model, view);
    }
);