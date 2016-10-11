/**
 * Created by JcrSeguros on 14/5/2016.
 */
angular.module('App')
    .controller('SuperUserCtrl', [
        '$scope',
        '$sessionStorage',
        'UserService',
        'spinnerService',
        'growl',
        '$log',
        '$state',
        'GLOBAL_CONSTANT',
        'GLOBAL_MESSAGE',
        'MENU_JCR_SEGUROS_ACTIVE',
        '$controller',
        '$rootScope',
        function ($scope,
                  $sessionStorage,
                  UserService,
                  spinnerService,
                  growl,
                  $log,
                  $state,
                  GLOBAL_CONSTANT,
                  GLOBAL_MESSAGE,
                  MENU_JCR_SEGUROS_ACTIVE,
                  $controller,
                  $rootScope) {


            //herencia metodos comunes
            $controller('BaseCtrl', {$scope: $scope,
                $state: $state,
                $rootScope: $rootScope,
                $sessionStorage: $sessionStorage});


            $scope.checkBoxAdmin = {
                id_user_type: 1,
                object: [
                    {
                        menu_id: 1,
                        checkBoxActive: false,
                        id_user_type: 1
                    },
                    {
                        menu_id: 2,
                        checkBoxActive: false,
                        id_user_type: 1
                    },
                    {
                        menu_id: 3,
                        checkBoxActive: false,
                        id_user_type: 1
                    },
                    {
                        menu_id: 4,
                        checkBoxActive: false,
                        id_user_type: 1
                    },
                    {
                        menu_id: 5,
                        checkBoxActive: false,
                        id_user_type: 1
                    }
                ]

            };

            $scope.checkBoxSuscripcion = {
                id_user_type: 2,
                object: [
                    {
                        menu_id: 1,
                        checkBoxActive: false,
                        id_user_type: 2
                    },
                    {
                        menu_id: 2,
                        checkBoxActive: false,
                        id_user_type: 2
                    },
                    {
                        menu_id: 3,
                        checkBoxActive: false,
                        id_user_type: 2
                    },
                    {
                        menu_id: 4,
                        checkBoxActive: false,
                        id_user_type: 2
                    },
                    {
                        menu_id: 5,
                        checkBoxActive: false,
                        id_user_type: 2
                    }
                ]
            };

            $scope.checkBoxSiniestro = {
                id_user_type: 3,
                object: [
                    {
                        menu_id: 1,
                        checkBoxActive: false,
                        id_user_type: 3
                    },
                    {
                        menu_id: 2,
                        checkBoxActive: false,
                        id_user_type: 3
                    },
                    {
                        menu_id: 3,
                        checkBoxActive: false,
                        id_user_type: 3
                    },
                    {
                        menu_id: 4,
                        checkBoxActive: false,
                        id_user_type: 3
                    },
                    {
                        menu_id: 5,
                        checkBoxActive: false,
                        id_user_type: 3
                    }
                ]
            };

            $scope.checkBoxCoordinador = {
                id_user_type: 4,
                object: [
                    {
                        menu_id: 1,
                        checkBoxActive: false,
                        id_user_type: 4
                    },
                    {
                        menu_id: 2,
                        checkBoxActive: false,
                        id_user_type: 4
                    },
                    {
                        menu_id: 3,
                        checkBoxActive: false,
                        id_user_type: 4
                    },
                    {
                        menu_id: 4,
                        checkBoxActive: false,
                        id_user_type: 4
                    },
                    {
                        menu_id: 5,
                        checkBoxActive: false,
                        id_user_type: 4
                    }
                ]
            };

            function init() {

                console.info("Iniciando controlador SuperUserController");

                $scope.setUserSession(MENU_JCR_SEGUROS_ACTIVE.CODE_OPC_ADMIN_MENU);

                if($scope.loadServices){
                    callServiceAccessMenu();
                }

            }

            init();




            /***
             * Service get access menu by rol user
             */
            function callServiceAccessMenu() {
                spinnerService.show("spinnerNew");

                UserService.getAccessMenuByRol()
                    .then(function (resp) {
                        if (resp.JcrResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {

                            resp.JcrResponse.object.forEach(function (entry) {


                                if (entry.tipo_usuario_id == $scope.checkBoxAdmin.id_user_type) {

                                    for (var i = 0; i < $scope.checkBoxAdmin.object.length; i++) {
                                        if ($scope.checkBoxAdmin.object[i].menu_id == entry.menu_id) {
                                            $scope.checkBoxAdmin.object[i].checkBoxActive = (entry.active_menu == 1) ? true : false;
                                            break;
                                        }
                                    }
                                }
                                else if (entry.tipo_usuario_id == $scope.checkBoxSuscripcion.id_user_type) {

                                    for (var i = 0; i < $scope.checkBoxSuscripcion.object.length; i++) {
                                        if ($scope.checkBoxSuscripcion.object[i].menu_id == entry.menu_id) {
                                            $scope.checkBoxSuscripcion.object[i].checkBoxActive = (entry.active_menu == 1) ? true : false;
                                            break;
                                        }
                                    }
                                }
                                else if (entry.tipo_usuario_id == $scope.checkBoxSiniestro.id_user_type) {

                                    for (var i = 0; i < $scope.checkBoxSiniestro.object.length; i++) {
                                        if ($scope.checkBoxSiniestro.object[i].menu_id == entry.menu_id) {
                                            $scope.checkBoxSiniestro.object[i].checkBoxActive = (entry.active_menu == 1) ? true : false;
                                            break;
                                        }
                                    }
                                }
                                else if (entry.tipo_usuario_id == $scope.checkBoxCoordinador.id_user_type) {

                                    for (var i = 0; i < $scope.checkBoxCoordinador.object.length; i++) {
                                        if ($scope.checkBoxCoordinador.object[i].menu_id == entry.menu_id) {
                                            $scope.checkBoxCoordinador.object[i].checkBoxActive = (entry.active_menu == 1) ? true : false;
                                            break;
                                        }
                                    }
                                }

                            });
                        } else {
                            console.error("Error obteniendo la data del servicio: " + resp.ReaxiumResponse.message);
                            growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                        }
                    })
                    .catch(function (err) {
                        console.error("Error obteniendo la data del servicio: " + err);
                        growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                    }).finally(function () {
                    spinnerService.hide("spinnerNew");
                });
            }



            $scope.saveAccess = function () {

                spinnerService.show("spinnerNew");

                var jsonSend = {
                    JcrParameters: {
                        JcrSystem: {
                            object: []
                        }
                    }
                };


                $scope.checkBoxAdmin.object.forEach(function (entry) {
                    var checkActiveMenu = (entry.checkBoxActive == false) ? 0 : 1;
                    jsonSend.JcrParameters.JcrSystem.object.push({
                        tipo_usuario_id: entry.id_user_type,
                        menu_id: entry.menu_id,
                        active_menu: checkActiveMenu
                    })
                });

                $scope.checkBoxSuscripcion.object.forEach(function (entry) {
                    var checkActiveMenu = (entry.checkBoxActive == false) ? 0 : 1;
                    jsonSend.JcrParameters.JcrSystem.object.push({
                        tipo_usuario_id: entry.id_user_type,
                        menu_id: entry.menu_id,
                        active_menu: checkActiveMenu
                    })
                });

                $scope.checkBoxSiniestro.object.forEach(function (entry) {
                    var checkActiveMenu = (entry.checkBoxActive == false) ? 0 : 1;
                    jsonSend.JcrParameters.JcrSystem.object.push({
                        tipo_usuario_id: entry.id_user_type,
                        menu_id: entry.menu_id,
                        active_menu: checkActiveMenu
                    })
                });


                $scope.checkBoxCoordinador.object.forEach(function (entry) {
                    var checkActiveMenu = (entry.checkBoxActive == false) ? 0 : 1;
                    jsonSend.JcrParameters.JcrSystem.object.push({
                        tipo_usuario_id: entry.id_user_type,
                        menu_id: entry.menu_id,
                        active_menu: checkActiveMenu
                    })
                });


                $log.debug("Arreglo final", jsonSend);

                UserService.updateAllAccessMenu(jsonSend)

                    .then(function (resp) {
                        if (resp.JcrResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {
                            growl.success("Se han actualizado los accesos");
                        }
                        else {
                            console.error("Error update access menu user rol: " + resp.JcrResponse.message);
                            growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                        }
                    })
                    .catch(function (err) {
                        console.error("Error update access menu user rol: " + err);
                        growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                    })
                    .finally(function () {
                        spinnerService.hide("spinnerNew");
                    });

            }

        }]);