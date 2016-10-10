/**
 * Created by Gualdo de la cruz on 05/04/2016.
 */
angular.module('App')

    .factory('CoberturaLookup',['$http','$q','CONST_PROXY_URL',function ($http, $q, CONST_PROXY_URL) {

        var lookup = {};

        var coberturaIdFound = 0;

        var coberturaData = {};

        var coberturaJson = {
            cobertura: {},
            totalPages: 0,
            totalRecords: 0
        };


        /**
         *
         * @returns {IPromise<TResult>|*}
         */
        lookup.allCoberturas = function (filterCriteria) {

            var defered = $q.defer();
            var promise = defered.promise;


            $http({
                method: 'POST',
                data: JSON.stringify(filterCriteria),
                url: CONST_PROXY_URL.PROXY_URL_COBERTURA_WITH_PAGINATE,
            }).success(function (response) {
                coberturaJson.coberturas = response.JcrResponse.object;
                coberturaJson.totalPages = response.JcrResponse.totalPages;
                coberturaJson.totalRecords = response.JcrResponse.totalRecords;
                defered.resolve(coberturaJson);
            }).error(function (err) {
                defered.reject(err);
            })

            return promise;
        };

        return lookup;

    }])

    .service('CoberturaService',['CoberturaLookup',function (CoberturaLookup) {

        var objModeEdit = {
            isModeEdit: false,
            idAseguradora: 0
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

        this.allCoberturaPaginate = function(request){
            return CoberturaLookup.allCoberturas(request);
        }

    }]);