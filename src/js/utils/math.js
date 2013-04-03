define('utils.math', function () {

    return {

        /**
         * Возвращает случайное число из указанного диапазона
         * @param min Минимально допустимое значение
         * @param max Максимально допустимое значение
         * @return {Number}
         */
        getRandomInt : function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    };

});