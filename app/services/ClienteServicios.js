/**
 * Created by Gualdo de la Cruz on 05/10/2016.
 */
angular.module('App')

    .factory('ClientFactory', ['$http', '$q', 'CONST_PROXY_URL', function ($http, $q, CONST_PROXY_URL) {

        var factory = {};

        factory.findAClientByDocumentId = function (documentNumber) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http({
                method: 'POST',
                data: JSON.stringify({JcrParameters: {Client: {document_number: documentNumber}}}),
                url: CONST_PROXY_URL.PROXY_URL_CLIENT_BY_DOCUMENT,
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }

        return factory;
    }])

    .service('ClientServices', ['ClientFactory', function (ClientFactory) {

        this.getClientByDocument = function (documentNumber) {
            return ClientFactory.findAClientByDocumentId(documentNumber);
        };

    }]);


