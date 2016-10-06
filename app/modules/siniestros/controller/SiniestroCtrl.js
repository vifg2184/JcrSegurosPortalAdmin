/**
 * Created by JcrSeguros on 05/04/2016.
 */
angular.module('App')

    .controller("SiniestroController", [
        '$scope',
        'SiniestroService',
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
        function ($scope,
                  SiniestroService,
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
                  MENU_JCR_SEGUROS_ACTIVE) {



            $scope.showMessage = "";

            //Search on the menu
            $scope.menuOptions = {searchWord: ''};

            $scope.totalPages = 0;


            var loadServices = true;
            /**
             * cabecera de la tabla de usuarios
             * @type {*[]}
             */
            $scope.siniestroTableHeaders = [{
                title: 'Numero de Siniestro',
                value: 'numero_siniestro'
            }];

            //default criteria that will be sent to the server
            $scope.filterCriteria = {
                JcrParameters: {
                    page: 1,
                    limit: 10,
                    sortDir: 'asc',
                    sortedBy: 'numero_siniestro',
                    filter: ''
                }
            };

            /**
             * Method Init
             */
            function init() {
                console.info("Iniciando controlador Siniestros");

                if (isUndefined($sessionStorage.rol_user) || isEmptyString($sessionStorage.rol_user)) {
                    console.error("Usuario no a iniciado session");
                    loadServices = false;
                    $state.go("login");
                }
                else {
                    //data user by session
                    $scope.nameUser = $sessionStorage.nameUser;
                    //menu sidebar
                    $scope.menus = addActiveClassMenu(JSON.parse($sessionStorage.appMenus),MENU_JCR_SEGUROS_ACTIVE.CODE_SINIESTRO_MENU);

                }
            }

            init();

            /**
             * Call service all user
             */
            $scope.getAllSiniestro = function () {

                spinnerService.show("spinnerUserList");
                SiniestroService.cleanModeEdit();

                SiniestroService.allSiniestroPaginate($scope.filterCriteria).then(function (data) {
                    $scope.siniestro = data.siniestro;
                    $scope.totalPages = data.totalPages;
                    $scope.totalRecords = data.totalRecords;
                    spinnerService.hide("spinnerUserList");

                    var messageGrowl = SiniestroService.getShowGrowlMessage();

                    if (messageGrowl.isShow){
                        growl.info(messageGrowl.message);
                        SiniestroService.cleanGrowl();
                    }

                }).catch(function (err) {
                    console.error("Error invocando servicio getAllUsers " + err);
                    $scope.siniestro = [];
                    $scope.totalPages = 0;
                    $scope.totalRecords = 0;
                    spinnerService.hide("spinnerUserList");
                    growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                });
            }

            //called when navigate to another page in the pagination
            $scope.selectPage = function () {
                if (loadServices) {
                    $scope.getAllSiniestro();
                }
            };

            //Will be called when filtering the grid, will reset the page number to one
            $scope.filterResult = function () {
                $scope.filterCriteria.JcrParameters.page = 1;
                $scope.getAllSiniestro();

            };

            //call back function that we passed to our custom directive sortBy, will be called when clicking on any field to sort
            $scope.onSort = function (sortedBy, sortDir) {
                console.log("OnSort");
                $scope.filterCriteria.JcrParameters.sortDir = sortDir;
                $scope.filterCriteria.JcrParameters.sortedBy = sortedBy;
                $scope.filterCriteria.JcrParameters.page = 1;
                $scope.getAllSiniestro();

            };


            /**
             * Delete User
             * @param id_user
             */
            $scope.deleteUser = function (id_user) {

                $confirm({text: 'Are you sure you want to delete?'})
                    .then(function () {
                        UserService.deleteUser(id_user)
                            .then(function (resp) {
                                if (resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {
                                    $scope.selectPage(1);
                                    growl.success(resp.ReaxiumResponse.message);
                                } else {
                                    growl.error(resp.ReaxiumResponse.message);
                                }
                            })
                            .catch(function (err) {
                                console.error("Error invocando servicio delete: " + err);
                                growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                            });
                    });
            }




            $scope.getAllSiniestro();

        }]);
