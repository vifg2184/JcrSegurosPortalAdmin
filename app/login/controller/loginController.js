/**
 * Created by JcrSeguros on 4/4/2016.
 */

angular.module('App')
    .controller('loginController', [
        '$scope',
        '$state',
        '$log',
        'loginServices',
        'spinnerService',
        '$localStorage',
        '$sessionStorage',
        '$rootScope',
        'growl',
        'GLOBAL_CONSTANT',
        'GLOBAL_MESSAGE',
        function ($scope,
                  $state,
                  $log,
                  loginServices,
                  spinnerService,
                  $localStorage,
                  $sessionStorage,
                  $rootScope,
                  growl,
                  GLOBAL_CONSTANT,
                  GLOBAL_MESSAGE) {

            $scope.showspinner = false;
            $scope.data = {
                settings: {
                    username: '',
                    password: '',
                    checked: false
                }
            };

            /**
             * Metodo inicial del controlador
             */
            var init = function () {
                console.log('Inicializando controlador Login...');

                if (angular.isDefined($localStorage.settings)) {
                    console.log('Esta definido el localStored');
                    $log.debug($localStorage.settings);
                    $scope.data.settings = $localStorage.settings;
                }
                else {
                    console.log('No Esta definido el localStored');
                    $localStorage.settings = $scope.data.settings;
                }
            }

            init();

            /**
             * Metodo para autenticar el usuario
             */
            $scope.authenticateUser = function () {

                spinnerService.show('html5spinner');

                loginServices.proxyLogin($scope.data.settings.username, $scope.data.settings.password)
                    .then(function (data) {
                        console.log(data)
                        console.log("Invocacion del servicio exitosa");
                        spinnerService.hide('html5spinner');

                        if (data.JcrResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {

                            if (data.JcrResponse.object[0].tipo_usuario_id == GLOBAL_CONSTANT.USER_ROL_ADMIN) {

                                $sessionStorage.nameUser = data.JcrResponse.object[0].nombre + ' ' + data.JcrResponse.object[0].apellido;
                                $sessionStorage.rol_user = GLOBAL_CONSTANT.USER_ROL_ADMIN;
                                getMenuByTypeUser(GLOBAL_CONSTANT.USER_ROL_ADMIN);

                            }else if(data.JcrResponse.object[0].tipo_usuario_id == GLOBAL_CONSTANT.USER_ROL_SINIESTRO){

                                $sessionStorage.nameUser = data.JcrResponse.object[0].nombre + ' ' + data.JcrResponse.object[0].apellido;
                                $sessionStorage.rol_user = GLOBAL_CONSTANT.USER_ROL_SINIESTRO;
                                getMenuByTypeUser(GLOBAL_CONSTANT.USER_ROL_SINIESTRO);

                            }else if(data.JcrResponse.object[0].tipo_usuario_id == GLOBAL_CONSTANT.USER_ROL_SUSCRIPCION){

                                $sessionStorage.nameUser = data.JcrResponse.object[0].nombre + ' ' + data.JcrResponse.object[0].apellido;
                                $sessionStorage.rol_user = GLOBAL_CONSTANT.USER_ROL_SUSCRIPCION;
                                getMenuByTypeUser(GLOBAL_CONSTANT.USER_ROL_SUSCRIPCION);
                            }
                            else if(data.JcrResponse.object[0].tipo_usuario_id == GLOBAL_CONSTANT.USER_ROL_COORDINADOR){

                                $sessionStorage.nameUser = data.JcrResponse.object[0].nombre + ' ' + data.JcrResponse.object[0].apellido;
                                $sessionStorage.rol_user = GLOBAL_CONSTANT.USER_ROL_COORDINADOR;
                                getMenuByTypeUser(GLOBAL_CONSTANT.USER_ROL_COORDINADOR);
                            }
                            else {
                                spinnerService.hide('html5spinner');
                                growl.error("User with restricted access");
                                console.info("User with restricted access: " + data.JcrResponse.message);
                            }

                        } else {
                            spinnerService.hide('html5spinner');
                            growl.error(data.JcrResponse.message);
                            console.error("Error a ingresar al aplicativo: " + data.JcrResponse.message);
                        }

                    })
                    .catch(function (error) {
                        console.error("Error invocacion del servicio" + error);
                        spinnerService.hide('html5spinner');
                        growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                    });

            }

            /**
             * Metodo para obtener un json del menu y asi pintar menu de la app
             */
            function getMenuByTypeUser(id_user_type) {

                var arrayMenu = [];
                spinnerService.show('html5spinner');

                loginServices.menuApplication(id_user_type)
                    .then(function (resp) {
                        spinnerService.hide('html5spinner');
                        if (resp.JcrResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {

                            $log.debug("Response Service: ", resp);

                            resp.JcrResponse.object.forEach(function (menu) {

                                var objMenu = {subMenus: []};

                                objMenu.id = menu.menu_id;
                                objMenu.class_active_menu = menu.class_menu == 1 ? false : true;
                                objMenu.name = menu.name_menu;
                                objMenu.icon_class = menu.icon_class;

                                menu.sub_menu_aplicacion.forEach(function (subMenu) {

                                    if (subMenu.menu_id === menu.menu_id) {
                                        objMenu.subMenus.push(subMenu);
                                    }
                                });

                                arrayMenu.push(objMenu);
                            });


                            $sessionStorage.appMenus = JSON.stringify(arrayMenu);
                            $state.go('home');

                        } else {
                            console.error("Error no se obtuvo el menu");
                        }

                    })
                    .catch(function (err) {
                        spinnerService.hide('html5spinner');
                        console.error("Error invocacion del servicio para obtener menu" + err);
                        growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                    });

            }

            /*Limpiar el scope vinculados a los campos*/

            $scope.newDataUser = function () {
                console.log("Cambio checkbox ifChecked");
                if ($scope.data.settings.username != null &&
                    $scope.data.settings.username != undefined &&
                    $scope.data.settings.password != null &&
                    $scope.data.settings.password != undefined) {

                    var obj = {
                        settings: {
                            username: $scope.data.settings.username,
                            password: $scope.data.settings.password,
                            checked: true
                        }
                    };
                    $log.debug("objeto paraguardar local:", obj);
                    $localStorage.settings = obj.settings;

                }
            }

            $scope.deleteDataUser = function () {
                console.log("Cambio checkbox ifUnchecked");
                delete $localStorage.settings;
            }

            $scope.data_alert = {
                boldTextTitle: "Done",
                textAlert: "Invalid User",
                mode: "danger",
                color_border: "bg-red-active"
            }

        }])

    /**
     * Directiva para manter check la opcion de recordar clave del usuario
     */
    .directive('myViewCheck', function () {

        return {
            restrict: "AE",
            template: '<div class="checkbox icheck"><label><input id="checkLogin" type="checkbox"> Remember Me</label></div>',

            link: function (scope, elem, attrs, ctrl) {

                $(function () {
                    $('#checkLogin').iCheck({
                        checkboxClass: 'icheckbox_square-blue',
                        radioClass: 'iradio_square-blue',
                        increaseArea: '20%'
                    });
                });

                if (scope.data.settings.checked) {
                    $('#checkLogin').iCheck('check');
                }
                $('#checkLogin').on('ifChecked', function (event) {
                    scope.newDataUser();
                });
                $('#checkLogin').on('ifUnchecked', function (event) {
                    scope.deleteDataUser();
                });
            }
        }
    });
