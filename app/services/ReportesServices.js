/**
 * Created by Gualdo de la Cruz on 05/10/2016.
 */
angular.module('App')

    .factory('ReportesFactory', ['$http', '$q', 'CONST_PROXY_URL', function ($http, $q, CONST_PROXY_URL) {

        var factory = {};


        var siniestroJson = {
            siniestro: {},
            totalPages: 0,
            totalRecords: 0
        };

        var renovacionesJson = {
            siniestro: {},
            totalPages: 0,
            totalRecords: 0
        };

        var saJson = {
            poliza: {},
            totalPages: 0,
            totalRecords: 0
        };

        var vcJson = {
            poliza: {},
            totalPages: 0,
            totalRecords: 0
        };

        factory.getInfoRenovacionesServices = function (request) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify(request),
                url: CONST_PROXY_URL.PROXY_URL_GET_INFO_RENOVACIONES,
            }).success(function (response) {

                renovacionesJson.code = response.JcrResponse.code;
                renovacionesJson.message = response.JcrResponse.message;
                renovacionesJson.renovaciones = response.JcrResponse.object;
                renovacionesJson.totalPages = response.JcrResponse.totalPages;
                renovacionesJson.totalRecords = response.JcrResponse.totalRecords;

                defered.resolve(renovacionesJson);

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

        factory.enviarReportesRenovacion = function (request) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify(request),
                url: CONST_PROXY_URL.PROXY_URL_REPORTE_EMAIL_NOTIFICATION,
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }



        factory.getInfoSiniestrosServices = function (request) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify(request),
                url: CONST_PROXY_URL.PROXY_URL_INFO_SINIESTROS,
            }).success(function (response) {
                siniestroJson.code = response.JcrResponse.code;
                siniestroJson.message = response.JcrResponse.message;
                siniestroJson.siniestro = response.JcrResponse.object;
                siniestroJson.totalPages = response.JcrResponse.totalPages;
                siniestroJson.totalRecords = response.JcrResponse.totalRecords;
                defered.resolve(siniestroJson);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }




        factory.getCreateReporteSiniestralidadServices = function (request) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify(request),
                url: CONST_PROXY_URL.PROXY_URL_REPORTES_SINIESTRALIDAD,
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }

        factory.getInfoSumaAseguradaServices = function (request) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify(request),
                url: CONST_PROXY_URL.PROXY_URL_INFO_SA,
            }).success(function (response) {
                saJson.code = response.JcrResponse.code;
                saJson.message = response.JcrResponse.message;
                saJson.polizas = response.JcrResponse.object;
                saJson.totalPages = response.JcrResponse.totalPages;
                saJson.totalRecords = response.JcrResponse.totalRecords;
                defered.resolve(saJson);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }

        factory.getCreateReporteSAServices = function (request) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify(request),
                url: CONST_PROXY_URL.PROXY_URL_REPORT_SA,
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }


        factory.getInfoVCruzadasServices = function (request) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify(request),
                url: CONST_PROXY_URL.PROXY_URL_INFO_VENTA_CRUZADA,
            }).success(function (response) {
                vcJson.code = response.JcrResponse.code;
                vcJson.message = response.JcrResponse.message;
                vcJson.polizas = response.JcrResponse.object;
                vcJson.totalPages = response.JcrResponse.totalPages;
                vcJson.totalRecords = response.JcrResponse.totalRecords;
                defered.resolve(vcJson);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }


        factory.getCreateReporteVentasCServices = function (request) {
            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify(request),
                url: CONST_PROXY_URL.PROXY_URL_REPORT_VENTAS_CRUZADAS,
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


        this.getInfoSiniestros = function(request){
            return ReportesFactory.getInfoSiniestrosServices(request);
        }

        this.getCreateReporteSiniestralidad = function(request){
            return ReportesFactory.getCreateReporteSiniestralidadServices(request);
        }

        this.getInfoSumaAsegurada = function(request){
            return ReportesFactory.getInfoSumaAseguradaServices(request);
        }

        this.getCreateReporteSA = function(request){
            return ReportesFactory.getCreateReporteSAServices(request);
        }

        this.getInfoVCruzadas = function(request){
            return ReportesFactory.getInfoVCruzadasServices(request);
        }

        this.getCreateReporteVentasC = function(request){
            return ReportesFactory.getCreateReporteVentasCServices(request);
        }

        this.enviarReportesRenovacion = function(request){
            return ReportesFactory.enviarReportesRenovacion(request);
        }
    }]);

