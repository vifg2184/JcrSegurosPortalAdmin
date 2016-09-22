/**
 * Created by VladimirIlich on 22/9/2016.
 */
angular.module('App')

    .controller("NewVehiculoCtrl", [
        '$scope',
        'VehiculoService',
        '$state',
        '$rootScope',
        'spinnerService',
        '$log',
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
                  VehiculoService,
                  $state,
                  $rootScope,
                  spinnerService,
                  $log,
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
            $controller('BaseCtrl', {$scope: $scope,
                $state: $state,
                $rootScope: $rootScope,
                $sessionStorage: $sessionStorage});


            //Search on the menu
            $scope.menuOptions = {searchWord: ''};


            $scope.setUserSession(MENU_JCR_SEGUROS_ACTIVE.CODE_VEHICULO_MENU);


            $scope.init = function () {

                console.info("Iniciando controlador VehiculoNewCtrl...");
                console.info("Mode edit: " + $stateParams.edit);
                console.info("Id de la aseguradora: " + $stateParams.aseguradora_id);

                VehiculoService.setModeEdit({
                    isModeEdit: Boolean($stateParams.edit),
                    idVehiculo: parseInt($stateParams.aseguradora_id)
                });

                VehiculoService.setShowGrowlMessage({isShow: false, message: ""});

                spinnerService.show("spinnerNew");

                if (VehiculoService.getModeEdit().isModeEdit) {

                    var request = {
                        JcrParameters: {
                            Vehiculo: {
                                vehiculo_id: VehiculoService.getModeEdit().idVehiculo
                            }
                        }
                    };

                    /*AseguradoraService.aseguradoraById(request).then(function (resp) {
                        spinnerService.hide("spinnerNew");

                        if (resp.JcrResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {
                            $scope.aseguradora.aseguradora_id = resp.JcrResponse.object[0].aseguradora_id;
                            $scope.aseguradora.aseguradora_nombre = resp.JcrResponse.object[0].aseguradora_nombre;
                            $scope.aseguradora.aseguradora_documento_id = resp.JcrResponse.object[0].aseguradora_documento_id;
                            $scope.aseguradora.status_id = resp.JcrResponse.object[0].status_id;
                        } else {
                            AseguradoraService.setShowGrowlMessage({
                                isShow: true,
                                message: GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR
                            });
                            $state.go("verAseguradora");
                        }

                    }).catch(function (err) {
                        console.error(err);
                        spinnerService.hide("spinnerNew");
                        AseguradoraService.setShowGrowlMessage({
                            isShow: true,
                            message: GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR
                        });
                        $state.go("verAseguradora");
                    });*/

                } else {
                    //crear aseguradora
                    spinnerService.hide("spinnerNew");
                    console.log("Modo crear poliza");

                }
            }
            $scope.init();

        }]);