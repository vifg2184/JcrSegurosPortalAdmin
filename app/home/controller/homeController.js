angular.module('App')

    .controller('HomeController', [
        '$scope',
        '$state',
        '$rootScope',
        'UserService',
        '$sessionStorage',
        'GLOBAL_CONSTANT',
        function ($scope,
                  $state,
                  $rootScope,
                  UserService,
                  $sessionStorage,
                  GLOBAL_CONSTANT) {

            $scope.panelTimeline = false;
            //Search on the menu
            $scope.menuOptions = {searchWord: ''};


            /**
             * Method init
             */
            function init() {

                console.info("Iniciando controlador HomeController");

                if (isUndefined($sessionStorage.rol_user) || isEmptyString($sessionStorage.rol_user)) {
                    console.error("Usuario no a iniciado session");
                    $state.go("login");
                }
                else {
                    //data user by session
                    $scope.photeUser = $sessionStorage.user_photo;
                    $scope.nameUser = $sessionStorage.nameUser;
                    //Menu
                    $scope.menus = addActiveClassMenu(JSON.parse($sessionStorage.appMenus), GLOBAL_CONSTANT.ID_HOME_MENU);
                }
            }

            init();


            $scope.logout = function () {

                console.info("Limpiado datos de session");
                delete $sessionStorage.nameUser;
                delete $sessionStorage.rol_user;
                delete $sessionStorage.user_photo;
                delete $sessionStorage.appMenus;
                $state.go('login');

            };

        }]);