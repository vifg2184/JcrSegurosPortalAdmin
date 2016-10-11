/**
 * Created by JcrSeguros on 7/4/2016.
 */

angular.module('App')

    .controller('UserNewCtrl', [
        '$scope',
        'UserService',
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
        function ($scope,
                  UserService,
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
                  $controller) {


            //herencia metodos comunes
            $controller('BaseCtrl', {$scope: $scope,
                $state: $state,
                $rootScope: $rootScope,
                $sessionStorage: $sessionStorage});


            $scope.showTable = false;
            $scope.modeEdit = false;
            $scope.allUserType = [];
            $scope.showMessage = "";
            $scope.headerName = "";
            $scope.showPassword = false;


            $scope.users = {
                usuario_id:"",
                nombre: "",
                apellido: "",
                documento_id: "",
                fecha_nacimiento: "",
                correo: "",
                direccion: "",
                tipo_usuario_id: "",
                clave: "",
                confirm_password:""
            };



            //Search on the menu
            $scope.menuOptions = {searchWord: ''};


            /**
             * Validate session
             */

            $scope.setUserSession(MENU_JCR_SEGUROS_ACTIVE.CODE_USER_MENU);

            /**
             * Method initial controller
             */
            $scope.init = function () {

                console.info("Iniciando controlador UserNewCtrl...");
                console.info("Mode edit: " + $stateParams.edit);
                console.info("Id del usuario: " + $stateParams.id_user);

                UserService.setModeEdit({isModeEdit: Boolean($stateParams.edit),idUser: parseInt($stateParams.id_user)});
                UserService.setShowGrowlMessage({isShow: false, message: ""});

                //llamar servicio para obtener los distintos tipos de usuario
                spinnerService.show("spinnerNew");

                UserService.getAllUsersType().then(function (resp) {

                    if (resp.JcrResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {

                        $scope.allUserType = resp.JcrResponse.object;

                        //modo edicion
                        if(UserService.getModeEdit().isModeEdit){

                            UserService.getUsersById(UserService.getModeEdit().idUser)
                                .then(function(resp){

                                    console.log(resp);

                                    $scope.userInfo = resp.JcrResponse.object[0];
                                    $scope.users.usuario_id = $scope.userInfo.usuario_id;
                                    $scope.users.nombre = $scope.userInfo.nombre;
                                    $scope.users.apellido = $scope.userInfo.apellido;
                                    $scope.users.correo = $scope.userInfo.correo;
                                    $scope.users.tipo_usuario_id = $scope.userInfo.tipo_usuario_id;
                                    $scope.users.clave = $scope.userInfo.clave;
                                    $scope.users.confirm_password =  $scope.userInfo.clave;

                                    spinnerService.hide("spinnerNew");
                                })
                                .catch(function(err){
                                    console.log("Error: "+err);
                                    spinnerService.hide("spinnerNew");
                                })
                        }else{
                            //crear usuario
                            console.log("Creando Usuario");
                            spinnerService.hide("spinnerNew");
                        }
                    }
                    else {
                        console.log("Error: " + resp.JcrResponse.message);
                    }

                }).catch(function (err) {
                    console.log("Error consultado servicio tipo de usuario: " + err);
                    spinnerService.hide("spinnerNew");
                    growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);

                });

            }

            /**
             * Method initial controller
             */
            if ($scope.loadServices) {
                $scope.init();
            }


            /**
             * Method save new user
             */
            $scope.saveNewUser = function () {

                //agregar validacion de todos los datos de entrada

                if(confirmPassword($scope.users.clave,$scope.users.confirm_password)){

                    var request = {
                        JcrParameters: {
                            Users: {
                                nombre: $scope.users.nombre,
                                apellido: $scope.users.apellido,
                                correo: $scope.users.correo,
                                tipo_usuario_id: $scope.users.tipo_usuario_id,
                                clave: $scope.users.clave,
                                status_id: 1
                            }
                        }
                    };

                    if(UserService.getModeEdit().isModeEdit){
                        request.JcrParameters.Users.usuario_id = $scope.users.usuario_id;
                    }

                    console.log(request);

                    var validate = validateParamNewUser(request);
                    if (validate.isValidate) {

                        spinnerService.show("spinnerNew");

                        UserService.createNewUser(request).then(function (resp) {

                                if(resp.JcrResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){

                                    spinnerService.hide("spinnerNew");

                                    //modo edicion
                                    if(UserService.getModeEdit().isModeEdit){

                                        UserService.setShowGrowlMessage({isShow: true,message: GLOBAL_MESSAGE.MESSAGE_SAVE_USER_SUCCESS});
                                        $state.go("verUsuarios");
                                    }
                                    else{
                                        $confirm({text: 'Desea crear un nuevo usuario en sistema', ok: 'Si', cancel: 'No'})
                                            .then(function () {
                                                clearFields();
                                            })
                                            .catch(function () {
                                                UserService.setShowGrowlMessage({isShow: true,message: GLOBAL_MESSAGE.MESSAGE_SAVE_USER_SUCCESS});
                                                $state.go("verUsuarios");
                                            });
                                    }

                                }
                                else{
                                    console.log("Error: "+resp.JcrResponse.message);
                                    spinnerService.hide("spinnerNew");
                                    growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                                }
                            })
                            .catch(function (err) {
                                console.log("Error: "+err);
                                spinnerService.hide("spinnerNew");
                                growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                            })
                    }
                    else {
                        console.log("Error validacion: " + validate.message);
                        growl.warning(validate.message);
                    }
                }
                else{
                    console.log("Password no coincide");
                    growl.warning("Verificar password no coincide");
                }

            }


            function clearFields(){

                $scope.users.nombre = "";
                $scope.users.apellido = ""
                $scope.users.documento_id = "";
                $scope.users.fecha_nacimiento = "";
                $scope.users.correo = "";
                $scope.users.direccion = "";
                $scope.users.tipo_usuario_id=""
                $scope.users.clave="";
                $scope.phones.home="";
                $scope.phones.movil="";
                $scope.phones.office="";

            }

        }]);
