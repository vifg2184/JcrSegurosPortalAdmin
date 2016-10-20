/**
 * Created by Gabrielcarrillo on 19/10/2016.
 */
angular.module('App')

    .factory('RecordatorioFactory', ['$http', '$q', 'CONST_PROXY_URL', function ($http, $q, CONST_PROXY_URL) {

        var factory = {};

        factory.sendMemo = function (jsonObject) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http({
                method: 'POST',
                data: JSON.stringify(jsonObject),
                url: CONST_PROXY_URL.PROXY_URL_RECORDATORIOS,
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }

        return factory;
    }])

    .service('RecordatorioServices', ['RecordatorioFactory', function (RecordatorioFactory) {

        this.sendRecordatorio = function (jsonObject) {
            return RecordatorioFactory.sendMemo(jsonObject);
        };

    }]);
/**
 * Created by Pc on 19/10/2016.
 */
