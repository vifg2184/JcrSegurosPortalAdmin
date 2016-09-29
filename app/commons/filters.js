/**
 * Created by VladimirIlich on 9/4/2016.
 */

angular.module('App')

    .filter('capitalize', function () {
        return function (text) {
            if (text != null) {
                return text.substring(0, 1).toUpperCase() + text.substring(1);
            }
        }
    })

    .filter('lowerCase', function () {
        return function (text) {
            if (text != null) {
                return text.toLowerCase();
            }
        }
    })

    .filter('upperCase', function () {
        return function (text) {
            if (text != null) {
                return text.toUpperCase();
            }
        }
    })

    .filter('transforDate', function () {
        return function (text) {
            if (text != null) {

                var pos = text.indexOf('+');

                return text.substring(0, pos);

            }
        }
    })

    .filter('tel', function () {
        return function (tel) {
            if (!tel) {
                return '';
            }

            var value = tel.toString().trim().replace(/^\+/, '');

            if (value.match(/[^0-9]/)) {
                return tel;
            }

            var country, city, number;

            switch (value.length) {
                case 10: // +1PPP####### -> C (PPP) ###-####
                    country = 1;
                    city = value.slice(0, 3);
                    number = value.slice(3);
                    break;

                case 11: // +CPPP####### -> CCC (PP) ###-####
                    country = value[0];
                    city = value.slice(1, 4);
                    number = value.slice(4);
                    break;

                case 12: // +CCCPP####### -> CCC (PP) ###-####
                    country = value.slice(0, 3);
                    city = value.slice(3, 5);
                    number = value.slice(5);
                    break;

                default:
                    return tel;
            }

            if (country == 1) {
                country = "";
            }

            number = number.slice(0, 3) + '-' + number.slice(3);

            return (country + " (" + city + ") " + number).trim();
        };
    })


    .filter('start', function () {
        return function (input, start) {
            if (!input || !input.length) {
                return;
            }

            start = +start;
            return input.slice(start);
        };
    })

    .filter('name_month', function () {
        return function (num) {
            var month = "";
            switch (parseInt(num)) {
                case 1:
                    month = "January";
                    break;
                case 2:
                    month = "February";
                    break;
                case 3:
                    month = "March";
                    break;
                case 4:
                    month = "April";
                    break;
                case 5:
                    month = "May";
                    break;
                case 6:
                    month = "June";
                    break;
                case 7:
                    month = "July";
                    break;
                case 8:
                    month = "August";
                    break;
                case 9:
                    month = "September";
                    break;
                case 10:
                    month = "October";
                    break;
                case 11:
                    month = "November";
                    break;
                case 12:
                    month = "December";
                    break;
            }

            return month;
        }
    })

    .filter('concat_min_seg', function () {
        return function (text) {
            var hours = text + ":00:00";
            return hours;
        }

    })

    .filter('type_user_poliza', function () {

        return function (type) {

            var result = "";
            switch (parseInt(type)) {
                case 1:
                    result = "Tomador";
                    break;
                case 2:
                    result = "Titular";
                    break;
                case 3:
                    result = "Beneficiario";
                    break;

            }

            return result;
        }
    })


    .filter('format_porcent', ['$filter', function ($filter) {

        return function (input, decimals) {
            return $filter('number')(input, decimals) + '%';
        };
    }])


    .filter('tipo_siniestro',function(){

        return function(type){

            var result = "";

            switch (parseInt(type)){
                case 1:
                    result = "Personas";
                    break;
                case 2:
                    result = "Auto";
                    break;
            }

            return result;
        }
    })