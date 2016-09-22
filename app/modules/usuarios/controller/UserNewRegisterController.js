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
                tipo_usuario_id: "",
            };

            $scope.phones = {
                home: "",
                office: "",
                movil: ""
            }


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
                                    $scope.users.documento_id = $scope.userInfo.documento_id;
                                    $scope.users.correo = $scope.userInfo.correo;
                                    $scope.users.direccion = $scope.userInfo.direccion;
                                    $scope.users.tipo_usuario_id = $scope.userInfo.tipo_usuario_id;
                                    $scope.users.clave = $scope.userInfo.clave;

                                    //tratando fecha de nacimiento
                                    if (!isEmptyString($scope.userInfo.fecha_nacimiento)) {

                                        var birthdate = $scope.userInfo.fecha_nacimiento.split('/');

                                        var day = (birthdate[0].length == 1) ? birthdate[0] : birthdate[0];
                                        var month = (birthdate[1].length == 1) ? birthdate[1] : birthdate[1];
                                        var year = birthdate[2];

                                        var dateFinal = month + "/" + day + "/" + year;
                                        console.log(dateFinal);
                                        $scope.users.fecha_nacimiento = new Date(dateFinal);
                                    }
                                    else {
                                        $scope.users.fecha_nacimiento = new Date();
                                    }


                                    //numero telefonicos
                                    $scope.userInfo.telefonos.forEach(function(entry) {

                                        if (entry.telefono_nombre.toLowerCase() === "hogar"){
                                            $scope.phones.home = entry.telefono_numero;
                                        }
                                        else if (entry.telefono_nombre.toLowerCase() === "oficina"){
                                            $scope.phones.office = entry.telefono_numero;
                                        } else {
                                            $scope.phones.movil = entry.telefono_numero;
                                        }
                                    });

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
             * Formats date calendar
             * @type {string[]}
             */

            $scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'MM/dd/yyyy', 'shortDate'];
            $scope.format = $scope.formats[2];
            $scope.altInputFormats = ['M!/d!/yyyy'];

            /**
             * Options calendar
             * @type {string[]}
             */

            $scope.dateOptions = {
                formatYear: 'yyyy',
                maxDate: new Date(2020, 5, 22),
                minDate: new Date(1920, 1, 1),
                startingDay: 1
            };

            /**
             * Open calendar
             */
            $scope.open1 = function () {
                $scope.popup1.opened = true;
            };

            $scope.popup1 = {
                opened: false
            };


            /**
             * Method save new user
             */
            $scope.saveNewUser = function () {

                //agregar validacion de todos los datos de entrada

                var request = {
                    JcrParameters: {
                        Users: {
                            nombre: $scope.users.nombre,
                            apellido: $scope.users.apellido,
                            documento_id: $scope.users.documento_id,
                            fecha_nacimiento: formatDate($scope.users.fecha_nacimiento),
                            correo: $scope.users.correo,
                            direccion: $scope.users.direccion,
                            tipo_usuario_id: $scope.users.tipo_usuario_id,
                            clave: $scope.users.clave,
                            status_id: 1
                        },
                        Phones: [
                            {
                                telefono_nombre: "Hogar",
                                telefono_numero: cleanMaskPhone($scope.phones.home)
                            },
                            {
                                telefono_nombre: "Movil",
                                telefono_numero: cleanMaskPhone($scope.phones.movil)
                            },
                            {
                                telefono_nombre: "Oficina",
                                telefono_numero: cleanMaskPhone($scope.phones.office)
                            }
                        ]
                    }
                };



                if(UserService.getModeEdit().isModeEdit){

                    request.JcrParameters.Users.usuario_id = $scope.users.usuario_id;

                    if (!isUndefined($scope.userInfo.telefonos[0])) {
                        request.JcrParameters.Phones[0].telefono_id =  $scope.userInfo.telefonos[0].telefono_id;
                    }

                    if (!isUndefined($scope.userInfo.telefonos[1])) {
                        request.JcrParameters.Phones[1].telefono_id =  $scope.userInfo.telefonos[1].telefono_id;
                    }

                    if (!isUndefined($scope.userInfo.telefonos[2])) {
                        request.JcrParameters.Phones[2].telefono_id =  $scope.userInfo.telefonos[2].telefono_id;
                    }

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
