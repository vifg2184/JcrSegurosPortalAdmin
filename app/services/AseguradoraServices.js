/**
 * Created by Eduardo Luttinger on 05/04/2016.
 */
angular.module('App')

    .factory('AseguradoraLookup',['$http','$q','CONST_PROXY_URL',function ($http, $q, CONST_PROXY_URL) {

        var lookup = {};

        var aseguradoraIdFound = 0;

        var aseguradoraData = {};

        var aseguradoraJson = {
            aseguradora: {},
            totalPages: 0,
            totalRecords: 0
        };


        /**
         *
         * @returns {IPromise<TResult>|*}
         */
        lookup.allAseguradora = function (filterCriteria) {

            var defered = $q.defer();
            var promise = defered.promise;


            $http({
                method: 'POST',
                data: JSON.stringify(filterCriteria),
                url: CONST_PROXY_URL.PROXY_URL_ASEGURADORAS_WITH_PAGINATE,
            }).success(function (response) {
                aseguradoraJson.aseguradora = response.JcrResponse.object;
                aseguradoraJson.totalPages = response.JcrResponse.totalPages;
                aseguradoraJson.totalRecords = response.JcrResponse.totalRecords;
                defered.resolve(aseguradoraJson);
            }).error(function (err) {
                defered.reject(err);
            })

            return promise;
        };

        return lookup;

    }])

    .service('AseguradoraService',['AseguradoraLookup',function (AseguradoraLookup) {

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

        this.allAseguradoraPaginate = function(request){
            return AseguradoraLookup.allAseguradora(request);
        }

    }]);