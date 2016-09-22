/**
 * Created by JcrSeguros on 05/04/2016.
 */
angular.module('App')

    .controller("PolizaController", [
        '$scope',
        'UserService',
        'PolizaService',
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
                  UserService,
                  PolizaService,
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
            $scope.polizaTableHeaders = [{
                title: 'Numero de Poliza',
                value: 'numero_poliza'
            }];

            //default criteria that will be sent to the server
            $scope.filterCriteria = {
                JcrParameters: {
                        page: 1,
                        limit: 10,
                        sortDir: 'asc',
                        sortedBy: 'numero_poliza',
                        filter: ''
                }
            };


            $scope.setUserSession(MENU_JCR_SEGUROS_ACTIVE.CODE_POLIZAS_MENU);

            /**
             * Call service all user
             */
            $scope.getAllPoliza = function () {

                spinnerService.show("spinnerUserList");
                PolizaService.cleanModeEdit();

                PolizaService.allPolizaPaginate($scope.filterCriteria).then(function (data) {
                    $scope.polizas = data.poliza;
                    $scope.totalPages = data.totalPages;
                    $scope.totalRecords = data.totalRecords;
                    spinnerService.hide("spinnerUserList");

                    var messageGrowl = PolizaService.getShowGrowlMessage();

                    if (messageGrowl.isShow){
                        growl.info(messageGrowl.message);
                        PolizaService.cleanGrowl();
                    }

                }).catch(function (err) {
                    console.error("Error invocando servicio getAllUsers " + err);
                    $scope.polizas = [];
                    $scope.totalPages = 0;
                    $scope.totalRecords = 0;
                    spinnerService.hide("spinnerUserList");
                    growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                });
            }

            //called when navigate to another page in the pagination
            $scope.selectPage = function () {
                if ($scope.loadServices) {
                    $scope.getAllPoliza();
                }
            };

            //Will be called when filtering the grid, will reset the page number to one
            $scope.filterResult = function () {
                $scope.filterCriteria.JcrParameters.page = 1;
                $scope.getAllPoliza();

            };

            //call back function that we passed to our custom directive sortBy, will be called when clicking on any field to sort
            $scope.onSort = function (sortedBy, sortDir) {
                console.log("OnSort");
                $scope.filterCriteria.JcrParameters.sortDir = sortDir;
                $scope.filterCriteria.JcrParameters.sortedBy = sortedBy;
                $scope.filterCriteria.JcrParameters.page = 1;
                $scope.getAllPoliza();

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
            $scope.deletePoliza = function (poliza_id,poliza_number) {

                var request={JcrParameters:{Poliza:{poliza_id:poliza_id}}};

                $confirm({text: 'Estas segura de querer borrar la poliza numero ' + poliza_number + '?'})
                    .then(function () {
                        PolizaService.deletePolizaById(request)
                            .then(function (resp) {
                                if (resp.JcrResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {
                                    $scope.selectPage();
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


            function openModal(data) {

                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'myModalContent.html',
                    controller: 'ModalInstUserCtrl',
                    size: 'md',
                    resolve: {
                        userData: function () {
                            return data;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };


            $scope.selectPage();

        }]);



