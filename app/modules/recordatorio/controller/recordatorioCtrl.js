/**
 * Created by Pc on 19/10/2016.
 */


angular.module('App')

    .controller("recordatorioCtrl", [
        '$scope',
        'UserService',
        'PolizaService',
        '$state',
        '$rootScope',
        'spinnerService',
        '$log',
        'RecordatorioServices',
        '$sessionStorage',
        'growl',
        '$confirm',
        '$timeout',
        '$uibModal',
        'GLOBAL_MESSAGE',
        'GLOBAL_CONSTANT',
        'MENU_JCR_SEGUROS_ACTIVE',
        '$controller',
        function ($scope,
                  UserService,
                  PolizaService,
                  $state,
                  $rootScope,
                  spinnerService,
                  $log,
                  RecordatorioServices,
                  $sessionStorage,
                  growl,
                  $confirm,
                  $timeout,
                  $uibModal,
                  GLOBAL_MESSAGE,
                  GLOBAL_CONSTANT,
                  MENU_JCR_SEGUROS_ACTIVE,
                  $controller) {


            //herencia metodos comunes
            $controller('BaseCtrl', {
                $scope: $scope,
                $state: $state,
                $rootScope: $rootScope,
                $sessionStorage: $sessionStorage
            });

            $scope.showMessage = "";

            //Search on the menu
            $scope.menuOptions = {searchWord: ''};

            var correos = ['gabo3cr@gmail.com', 'vladimir.fernandez21@gmail.com'];


            $scope.setUserSession(MENU_JCR_SEGUROS_ACTIVE.CODE_FORMATOS_MENU);

            var request = {
                JcrParameters: {
                    object: correos
                }
            }


            $scope.enviarRecordatorio = function () {

                spinnerService.show("spinnerNew");
                var jsonObject = {'JcrParameters':{'Recordatorio':{}}};

                RecordatorioServices.sendRecordatorio(jsonObject).then(function (resp) {
                    console.log(resp);

                    if (resp.JcrResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {


                        spinnerService.hide("spinnerNew");

                    }else{
                        spinnerService.hide("spinnerNew");
                    }

                }).catch(function (err) {

                    spinnerService.hide("spinnerNew");

                });
            }

        }])