/**
 * Created by VladimirIlich on 22/9/2016.
 */

angular.module('App')
    .controller('AseguradoraNewCtrl', [
        '$scope',
        '$log',
        '$timeout',
        '$rootScope',
        'spinnerService',
        'FILE_SYSTEM_ROUTE',
        '$state',
        '$sessionStorage',
        '$stateParams',
        'growl',
        '$confirm',
        'GLOBAL_CONSTANT',
        'GLOBAL_MESSAGE',
        'MENU_JCR_SEGUROS_ACTIVE',
        '$controller',
        'AseguradoraService',
        function ($scope,
                  $log,
                  $timeout,
                  $rootScope,
                  spinnerService,
                  FILE_SYSTEM_ROUTE,
                  $state,
                  $sessionStorage,
                  $stateParams,
                  growl,
                  $confirm,
                  GLOBAL_CONSTANT,
                  GLOBAL_MESSAGE,
                  MENU_JCR_SEGUROS_ACTIVE,
                  $controller,
                  AseguradoraService) {


            //herencia metodos comunes
            $controller('BaseCtrl', {
                $scope: $scope,
                $state: $state,
                $rootScope: $rootScope,
                $sessionStorage: $sessionStorage
            });


            //Search on the menu
            $scope.menuOptions = {searchWord: ''};

            $scope.aseguradora = {
                aseguradora_nombre: "",
                aseguradora_documento_id: "",
                status_id: 1
            }
            /**
             * Validate session
             */

            $scope.setUserSession(MENU_JCR_SEGUROS_ACTIVE.CODE_ASEGURADORA);


            $scope.init = function () {

                console.info("Iniciando controlador AseguradoraNewCtrl...");
                console.info("Mode edit: " + $stateParams.edit);
                console.info("Id de la aseguradora: " + $stateParams.aseguradora_id);

                AseguradoraService.setModeEdit({
                    isModeEdit: Boolean($stateParams.edit),
                    idAseguradora: parseInt($stateParams.aseguradora_id)
                });

                AseguradoraService.setShowGrowlMessage({isShow: false, message: ""});

                spinnerService.show("spinnerNew");

                if (AseguradoraService.getModeEdit().isModeEdit) {

                    var request = {
                        JcrParameters: {
                            Aseguradora: {
                                aseguradora_id: AseguradoraService.getModeEdit().idAseguradora
                            }
                        }
                    };

                    AseguradoraService.aseguradoraById(request).then(function (resp) {
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
                    });

                } else {
                    //crear aseguradora
                    spinnerService.hide("spinnerNew");
                    console.log("Modo crear poliza");

                }
            }

            $scope.init();

            $scope.saveAseguradora = function () {

                spinnerService.show("spinnerNew");

                var request = {
                    JcrParameters: {
                        Aseguradora: {
                            aseguradora_nombre: $scope.aseguradora.aseguradora_nombre,
                            aseguradora_documento_id: $scope.aseguradora.aseguradora_documento_id,
                            status_id: $scope.aseguradora.status_id
                        }
                    }
                };

                if (AseguradoraService.getModeEdit().isModeEdit) {
                    request.JcrParameters.Aseguradora.aseguradora_id = $scope.aseguradora.aseguradora_id;
                }

                AseguradoraService.createAseguradoras(request).then(function (resp) {

                    if (resp.JcrResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {

                        spinnerService.hide("spinnerNew");

                        //modo edicion
                        if (AseguradoraService.getModeEdit().isModeEdit) {

                            AseguradoraService.setShowGrowlMessage({
                                isShow: true,
                                message: GLOBAL_MESSAGE.MESSAGE_SAVE_ASEGURADORA_SUCCESS
                            });
                            $state.go("verAseguradora");
                        }
                        else {
                            $confirm({text: 'Desea crear una nueva Aseguradora en sistema', ok: 'Si', cancel: 'No'})
                                .then(function () {
                                    cleanFields();
                                })
                                .catch(function () {
                                    AseguradoraService.setShowGrowlMessage({
                                        isShow: true,
                                        message: GLOBAL_MESSAGE.MESSAGE_SAVE_POLIZA_SUCCCESS
                                    });
                                    $state.go("verAseguradora");
                                });
                        }
                    } else {
                        spinnerService.hide("spinnerNew");
                        AseguradoraService.setShowGrowlMessage({
                            isShow: true,
                            message: GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR
                        });
                        $state.go("verAseguradora");
                    }

                }).catch(function (err) {

                    spinnerService.hide("spinnerNew");
                    console.error("Error creando usuario: " + err);
                    AseguradoraService.setShowGrowlMessage({
                        isShow: true,
                        message: GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR
                    });

                    $state.go("verAseguradora");
                });

            }


            function cleanFields() {

                $scope.aseguradora.aseguradora_documento_id = "";
                $scope.aseguradora.aseguradora_nombre = "";
                $scope.aseguradora.status_id=1;

            }

        }]);