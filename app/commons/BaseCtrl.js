/**
 * Created by VladimirIlich on 22/9/2016.
 */

angular.module("App")
    .controller("BaseCtrl",['$scope','$state','$rootScope','$sessionStorage',function ($scope,$state,$rootScope,$sessionStorage) {

        $scope.loadServices = true;

        $scope.setUserSession = function (menu_active) {

            if (isUndefined($sessionStorage.rol_user) || isEmptyString($sessionStorage.rol_user)) {
                console.error("Usuario no a iniciado session");
                $scope.loadServices = false;
                $state.go("login");
            }
            else {
                //data user by session
                $scope.nameUser = $sessionStorage.nameUser;
                $scope.rol_user = $sessionStorage.rol_user;
                //menu sidebar
                $scope.menus = addActiveClassMenu(JSON.parse($sessionStorage.appMenus),menu_active);

            }
        }


    }]);