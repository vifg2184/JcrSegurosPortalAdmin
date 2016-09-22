/**
 * Created by JcrSeguros on 05/04/2016.
 */
angular.module('App')

    .controller("AseguradoraController", [
        '$scope',
        'AseguradoraService',
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
                  AseguradoraService,
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


            $scope.showMessage = "";

            //Search on the menu
            $scope.menuOptions = {searchWord: ''};

            $scope.totalPages = 0;


            /**
             * cabecera de la tabla de usuarios
             * @type {*[]}
             */
            $scope.aseguradoraTableHeaders = [
                {
                    title: 'Aseguradora',
                    value: 'aseguradora_nombre'
                }
            ];

            //default criteria that will be sent to the server
            $scope.filterCriteria = {
                JcrParameters: {
                    page: 1,
                    limit: 10,
                    sortDir: 'asc',
                    sortedBy: 'aseguradora_nombre',
                    filter: ''
                }
            };

            /**
             * Method Init
             */
            $scope.setUserSession(MENU_JCR_SEGUROS_ACTIVE.CODE_ASEGURADORA);

            /**
             * Call service all user
             */
            $scope.getAllAseguradora = function () {

                spinnerService.show("spinnerUserList");
                AseguradoraService.cleanModeEdit();

                AseguradoraService.allAseguradoraPaginate($scope.filterCriteria).then(function (data) {
                    $scope.aseguradoras = data.aseguradora;
                    $scope.totalPages = data.totalPages;
                    $scope.totalRecords = data.totalRecords;
                    spinnerService.hide("spinnerUserList");

                    var messageGrowl = AseguradoraService.getShowGrowlMessage();

                    if (messageGrowl.isShow) {
                        growl.info(messageGrowl.message);
                        AseguradoraService.cleanGrowl();
                    }

                }).catch(function (err) {
                    console.error("Error invocando servicio getAllUsers " + err);
                    $scope.aseguradoras = [];
                    $scope.totalPages = 0;
                    $scope.totalRecords = 0;
                    spinnerService.hide("spinnerUserList");
                    growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                });
            }

            //called when navigate to another page in the pagination
            $scope.selectPage = function () {
                if ($scope.loadServices) {
                    $scope.getAllAseguradora();
                }
            };

            //Will be called when filtering the grid, will reset the page number to one
            $scope.filterResult = function () {
                $scope.filterCriteria.JcrParameters.page = 1;
                $scope.getAllAseguradora();

            };

            //call back function that we passed to our custom directive sortBy, will be called when clicking on any field to sort
            $scope.onSort = function (sortedBy, sortDir) {
                console.log("OnSort");
                $scope.filterCriteria.JcrParameters.sortDir = sortDir;
                $scope.filterCriteria.JcrParameters.sortedBy = sortedBy;
                $scope.filterCriteria.JcrParameters.page = 1;
                $scope.getAllAseguradora();

            };


            /**
             * get the user's phone information and show it in a modal and show it in a modal
             * @param userId
             */
            $scope.showInformation = function (userId) {
                console.log("showPhoneInformation");

            }

            /**
             * Edit User Mode
             * @param id
             */


            /**
             * Delete User
             * @param id_user
             */
            $scope.deleteAseguradora = function (aseguradora_id) {

                var request={
                    JcrParameters:{
                        Aseguradora:{
                            aseguradora_id:aseguradora_id
                        }
                    }
                }

                $confirm({text: 'Estas seguro de borrar la aseguradora?'})
                    .then(function () {
                        AseguradoraService.deleteAseguradora(request)
                            .then(function (resp) {
                                if (resp.JcrResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {
                                    $scope.selectPage(1);
                                    growl.success(resp.JcrResponse.message);
                                } else {
                                    growl.error(resp.JcrResponse.message);
                                }
                            })
                            .catch(function (err) {
                                console.error("Error invocando servicio delete: " + err);
                                growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                            });
                    });
            }

            $scope.getAllAseguradora();

        }]);

