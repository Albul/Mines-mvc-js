define('utils.collision', function (app) {

    return {

        /**
         * Проверяет на столкновение объекта с точькой
         */
        hitTestPoint: function (obj, x, y) {
            if (obj.x < x && obj.y < y
                && obj.x + obj.width > x
                && obj.y + obj.height > y) {
                return true;
            } else {
                return false;
            }
        }

    }

});