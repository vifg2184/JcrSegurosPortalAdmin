/**
 * Created by JcrSeguros on 05/04/2016.
 */
angular.module('App')

    .controller("UserController", [
        '$scope',
        'UserService',
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
                  UserService,
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


            console.log("Cargo el Controlador de Usuarios");
            $scope.showMessage = "";

            //Search on the menu
            $scope.menuOptions = {searchWord: ''};

            $scope.totalPages = 0;
            $scope.usersCount = 0;

            var loadServices = true;
            /**
             * cabecera de la tabla de usuarios
             * @type {*[]}
             */
            $scope.userTableHeaders = [{
                title: 'Nombre',
                value: 'nombre'
            }, {
                title: 'Apellido',
                value: 'apellido'
            }, {
                title: 'Cedula de Identidad',
                value: 'documento_id'
            },{
                title: 'Tipo de Usuario',
                value: 'Usuarios.tipo_usuario_id'
            }
            ];

            //default criteria that will be sent to the server
            $scope.filterCriteria = {
                JcrParameters: {
                    Users:{
                        page: 1,
                        limit: 10,
                        sortDir: 'asc',
                        sortedBy: 'nombre',
                        filter: ''
                    }
                }
            };

            /**
             * Method Init
             */
            function init() {
                console.info("Iniciando controlador UserController");

                if (isUndefined($sessionStorage.rol_user) || isEmptyString($sessionStorage.rol_user)) {
                    console.error("Usuario no a iniciado session");
                    loadServices = false;
                    $state.go("login");
                }
                else {
                    //data user by session
                    $scope.nameUser = $sessionStorage.nameUser;
                    //menu sidebar
                    $scope.menus = addActiveClassMenu(JSON.parse($sessionStorage.appMenus),MENU_JCR_SEGUROS_ACTIVE.CODE_USER_MENU);

                }
            }

            init();

            /**
             * Call service all user
             */
            $scope.getAllUsers = function () {

                spinnerService.show("spinnerUserList");
                UserService.cleanModeEdit();

                UserService.getUsers($scope.filterCriteria).then(function (data) {
                    $scope.users = data.users;
                    $scope.totalPages = data.totalPages;
                    $scope.totalRecords = data.totalRecords;
                    spinnerService.hide("spinnerUserList");

                    var messageGrowl = UserService.getShowGrowlMessage();

                    if (messageGrowl.isShow) {
                        growl.info(messageGrowl.message);
                        UserService.cleanGrowl();
                    }

                }).catch(function (err) {
                    console.error("Error invocando servicio getAllUsers " + err);
                    $scope.users = [];
                    $scope.totalPages = 0;
                    $scope.totalRecords = 0;
                    spinnerService.hide("spinnerUserList");
                    growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                });
            }

            //called when navigate to another page in the pagination
            $scope.selectPage = function () {
                if (loadServices) {
                    $scope.getAllUsers();
                }
            };

            //Will be called when filtering the grid, will reset the page number to one
            $scope.filterResult = function () {
                $scope.filterCriteria.JcrParameters.Users.page = 1;
                $scope.getAllUsers();

            };

            //call back function that we passed to our custom directive sortBy, will be called when clicking on any field to sort
            $scope.onSort = function (sortedBy, sortDir) {
                console.log("OnSort");
                $scope.filterCriteria.JcrParameters.Users.sortDir = sortDir;
                $scope.filterCriteria.JcrParameters.Users.sortedBy = sortedBy;
                $scope.filterCriteria.JcrParameters.Users.page = 1;
                $scope.getAllUsers();

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


            $scope.selectPage(1);
            return $scope;

        }])


    // controlador comportamiento del model
    .controller('ModalInstUserCtrl', ['$scope', '$state','$sessionStorage','$uibModalInstance', 'userData',
        function ($scope, $state,$sessionStorage,$uibModalInstance, userData) {

            $scope.userFound = userData;
            $scope.rol_user_id = $sessionStorage.rol_user;

            $scope.cancel = function () {
                $uibModalInstance.close();
            };

            $scope.showBusiness = function (businessId) {
                $uibModalInstance.close();
                $state.go('newBusiness', {id_business: businessId, edit: true});

            }

            $scope.showRoute = function (rooute_id) {
                $uibModalInstance.close();
                $state.go('routesNewRegister', {id_route: rooute_id, edit: true});
            }

            $scope.showUser = function (user_id) {
                $uibModalInstance.close();
                $state.go('newUser', {id_user: user_id, edit: true});
            }

            $scope.showStop = function (stop_id) {
                $uibModalInstance.close();
                $state.go('stopInfo', {id_stop: stop_id});
            }

        }]);
