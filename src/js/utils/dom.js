define('utils.dom', function (app) {

    return {
        /**
         * Возвращает глобальные координаты элемента на странице
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