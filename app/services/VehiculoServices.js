/**
 * Created by Eduardo Luttinger on 05/04/2016.
 */
angular.module('App')

    .factory('VehiculoLookup',['$http','$q','CONST_PROXY_URL',function ($http, $q, CONST_PROXY_URL) {

        var lookup = {};

        var vehiculoIdFound = 0;

        var vehiculoData = {};

        var vehiculoJson = {
            vehiculo: {},
            totalPages: 0,
            totalRecords: 0
        };


        /**
         *
         * @returns {IPromise<TResult>|*}
         */
        lookup.allVehiculoServices = function (filterCriteria) {

            var defered = $q.defer();
            var promise = defered.promise;


            $http({
                method: 'POST',
                data: JSON.stringify(filterCriteria),
                url: CONST_PROXY_URL.PROXY_URL_VEHICULO_WITH_PAGINATE,
            }).success(function (response) {
                vehiculoJson.vehiculos = response.JcrResponse.object;
                vehiculoJson.totalPages = response.JcrResponse.totalPages;
                vehiculoJson.totalRecords = response.JcrResponse.totalRecords;
                defered.resolve(vehiculoJson);
            }).error(function (err) {
                defered.reject(err);
            })

            return promise;
        };


        lookup.getVehiculoByIdServices = function(request){

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify(request),
                url: CONST_PROXY_URL.PROXY_URL_VEHICULO_BY_ID,
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            })

            return promise;

        }


        lookup.createVehiculoServices = function(request){

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify(request),
                url: CONST_PROXY_URL.PROXY_URL_VEHICULO_CREATE,
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            })

            return promise;

        }

        return lookup;

    }])

    .service('VehiculoService',['VehiculoLookup',function (VehiculoLookup) {

        var objModeEdit = {
            isModeEdit: false,
            idVehiculo: 0
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

        this.allVehiculosPaginate = function(request){
            return VehiculoLookup.allVehiculoServices(request);
        }

        this.getVehiculoById = function(request){
            return VehiculoLookup.getVehiculoByIdServices(request);
        }

    }]);