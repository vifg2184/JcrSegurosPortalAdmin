/**
 * Created by Eduardo Luttinger on 05/04/2016.
 */
angular.module('App')

    .factory('PolizasLookup',['$http','$q','CONST_PROXY_URL',function ($http, $q, CONST_PROXY_URL) {

        var lookup = {};

        var polizaIdFound = 0;

        var polizaData = {};

        var polizaJson = {
            poliza: {},
            totalPages: 0,
            totalRecords: 0
        };


        /**
         *
         * @returns {IPromise<TResult>|*}
         */
        lookup.allPolizas = function (filterCriteria) {

            var defered = $q.defer();
            var promise = defered.promise;


            $http({
                method: 'POST',
                data: JSON.stringify(filterCriteria),
                url: CONST_PROXY_URL.PROXY_URL_POLIZA_WITH_PAGINATE,
            }).success(function (response) {
                polizaJson.poliza = response.JcrResponse.object;
                polizaJson.totalPages = response.JcrResponse.totalPages;
                polizaJson.totalRecords = response.JcrResponse.totalRecords;
                defered.resolve(polizaJson);
            }).error(function (err) {
                defered.reject(err);
            })

            return promise;
        };


        lookup.getPolizaById = function (request) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http({
                method: 'POST',
                data: JSON.stringify(request),
                url: CONST_PROXY_URL.PROXY_URL_POLIZA_BY_ID,
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            })

            return promise;
        };


        lookup.createPoliza = function (request) {
            var defered = $q.defer();
            var promise = defered.promise;
            $http({
                method: 'POST',
                data: JSON.stringify(request),
                url: CONST_PROXY_URL.PROXY_URL_CREATE_POLIZA,
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            })

            return promise;
        };



        lookup.deletePoliza = function(request){

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify(request),
                url: CONST_PROXY_URL.PROXY_URL_DELETE_POLIZA,
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            })

            return promise;

        }

        return lookup;

    }])

    .service('PolizaService',['PolizasLookup',function (PolizasLookup) {

        var objModeEdit = {
            isModeEdit: false,
            idPoliza: 0
        };


        var showGrowl = {
            isShow: false,
            message: ""
        };

        var objUserById = {};

        this.cleanGrowl = function(){
            this.setShowGrowlMessage({isShow:false,message:""});
        }

        this.cleanModeEdit = function(){
            this.setModeEdit({isModeEdit:false,idPoliza:0});
        }


        this.getModeEdit = function () {
            return objModeEdit;
        };
        this.setModeEdit = function (mode) {
            objModeEdit = mode;
        };


        this.getShowGrowlMessage = function () {
            return showGrowl;
        }

        this.setShowGrowlMessage = function (obj) {
            showGrowl = obj;
        }

        
        this.allPolizaPaginate = function(request){
            return PolizasLookup.allPolizas(request);
        }

        this.newPoliza = function(request){
            return PolizasLookup.createPoliza(request);
        }

        this.searhPolizaById = function(request){
            return PolizasLookup.getPolizaById(request);
        }

        this.deletePolizaById =  function(request){
            return PolizasLookup.deletePoliza(request);
        }
    }]);