/**
 * Created by Gualdo de la Cruz on 05/10/2016.
 */
angular.module('App')

    .factory('ReportesFactory', ['$http', '$q', 'CONST_PROXY_URL', function ($http, $q, CONST_PROXY_URL) {

        var factory = {};

        factory.getInfoRenovacionesServices = function (request) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify(request),
                url: CONST_PROXY_URL.PROXY_URL_GET_INFO_RENOVACIONES,
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }


        factory.getCreateReporteRenovacionesServices = function (request) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify(request),
                url: CONST_PROXY_URL.PROXY_URL_REPORTE_RENOVACIONES,
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }



        return factory;
    }])


    .service('ReportesServices', ['ReportesFactory', function (ReportesFactory) {

        this.getInfoRenovaciones = function (request) {
            return ReportesFactory.getInfoRenovacionesServices(request);
        };


        this.getCreateReporteRenovaciones = function(request){
            return ReportesFactory.getCreateReporteRenovacionesServices(request);
        }

    }]);

