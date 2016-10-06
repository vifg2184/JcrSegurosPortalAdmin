/**
 * Created by Eduardo Luttinger on 05/04/2016.
 */
angular.module('App')

    .factory('SiniestroLookup',['$http','$q','CONST_PROXY_URL',function ($http, $q, CONST_PROXY_URL) {

        var lookup = {};

        var siniestroIdFound = 0;

        var siniestroData = {};

        var siniestroJson = {
            siniestro: {},
            totalPages: 0,
            totalRecords: 0
        };


        /**
         *
         * @returns {IPromise<TResult>|*}
         */
        lookup.allSiniestroServices = function (filterCriteria) {

            var defered = $q.defer();
            var promise = defered.promise;


            $http({
                method: 'POST',
                data: JSON.stringify(filterCriteria),
                url: CONST_PROXY_URL.PROXY_URL_SINIESTRO_WITH_PAGINATE,
            }).success(function (response) {
                siniestroJson.siniestro = response.JcrResponse.object;
                siniestroJson.totalPages = response.JcrResponse.totalPages;
                siniestroJson.totalRecords = response.JcrResponse.totalRecords;
                defered.resolve(siniestroJson);
            }).error(function (err) {
                defered.reject(err);
            })

            return promise;
        };


        /**
         *
         * @returns {IPromise<TResult>|*}
         */
        lookup.createSiniestroServices = function (filterCriteria) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify(filterCriteria),
                url: CONST_PROXY_URL.PROXY_URL_SINIESTRO_CREATE,
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            })

            return promise;
        };


        /**
         *
         * @returns {IPromise<TResult>|*}
         */
        lookup.getSiniestroByIdServices = function (filterCriteria) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify(filterCriteria),
                url: CONST_PROXY_URL.PROXY_URL_SINIESTRO_BY_ID,
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            })

            return promise;
        };

        /**
         *
         * @returns {IPromise<TResult>|*}
         */
        lookup.deleteSiniestroServices = function (filterCriteria) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify(filterCriteria),
                url: CONST_PROXY_URL.PROXY_URL_SINIESTRO_DELETE,
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            })

            return promise;
        };



        return lookup;

    }])

    .service('SiniestroService',['SiniestroLookup',function (SiniestroLookup) {

        var objModeEdit = {
            isModeEdit: false,
            idSiniestro: 0,
            idTipoSiniestro:0
        };


        var showGrowl = {
            isShow: false,
            message: ""
        };


        this.cleanGrowl = function(){
            this.setShowGrowlMessage({isShow:false,message:""});
        }

        this.cleanModeEdit = function(){
            this.setModeEdit({isModeEdit:false,idUser:0});
        }

        this.getShowGrowlMessage = function () {
            return showGrowl;
        }

        this.setShowGrowlMessage = function (obj) {
            showGrowl = obj;
        }

        this.getModeEdit = function () {
            return objModeEdit;
        };
        this.setModeEdit = function (mode) {
            objModeEdit = mode;
        };

        this.allSiniestroPaginate = function(request){
            return SiniestroLookup.allSiniestroServices(request);
        }

        this.createSiniestro = function(request){
            return SiniestroLookup.createSiniestroServices(request);
        }

        this.getSiniestroById = function(request){
            return SiniestroLookup.getSiniestroByIdServices(request);
        }

        this.deleteSiniestro = function(request){
            return SiniestroLookup.deleteSiniestroServices(request);
        }


    }]);