/**
 * Created by VladimirIlich on 16/11/2016.
 */


angular.module('App')

    .controller("formatoAnulacionCtrl", ['$scope',
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
        '$window',
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
                  $controller,
                  $window) {


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

            $scope.formato = {
                fecha: "",
                compania_nombre: "",
                nombre_cliente: "",
                ci: "",
                polizas: "",
                telefono_cliente: ""
            }

            $scope.setUserSession(MENU_JCR_SEGUROS_ACTIVE.CODE_FORMATOS_MENU);

            $scope.exportarFormato = function () {

                spinnerService.show("spinnerNew");

                var request = {

                    JcrParameters: {
                        Formats: {
                            date_format: $scope.formato.fecha,
                            company_name: $scope.formato.compania_nombre,
                            aseg_name: $scope.formato.nombre_cliente,
                            ci_aseg: $scope.formato.ci,
                            polizas: $scope.formato.polizas,
                            client_phone: $scope.formato.telefono_cliente,
                            type_report: 4
                        }
                    }
                };


                console.log("Request invocacion servicio: " + request);

                RecordatorioServices.callFormatsReport(request).then(function (resp) {

                        spinnerService.hide("spinnerNew");

                        if (resp.JcrResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {
                            $window.open(resp.JcrResponse.url_format, '_blank', '');
                        }
                        else {
                            console.log("Error invocando servicio: "+resp.message);
                            growl.error("Error invocando servicio: "+resp.message);
                        }

                    })
                    .catch(function (err) {
                        console.log("Error invocando servicio: "+err);
                        spinnerService.hide("spinnerNew");
                    })

            }


        }])