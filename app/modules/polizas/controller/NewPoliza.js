/**
 * Created by JcrSeguros on 12/9/2016.
 */

angular.module("App")

    .controller("NewPolizaCtrl", [
        '$scope',
        'UserService',
        'PolizaService',
        '$state',
        '$rootScope',
        '$stateParams',
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
                  PolizaService,
                  $state,
                  $rootScope,
                  $stateParams,
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


            //Search on the menu
            $scope.menuOptions = {searchWord: ''};

            $scope.aseguradoraListFinal = [];
            $scope.tomadorListFinal = [];
            $scope.showTableAseguradora = false;
            $scope.showTableTomador = false;
            $scope.selectedUser = null;

            $scope.poliza={
                numero_poliza:"",
                ramo_id:"",
                aseguradora_id:"",
                numero_recibo:"",
                vigencia:"",
                tipo_poliza_id:"",
                referencia:"",
                prima_total:"",
                usuario_id_agente:""
            }

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
             * Validate session
             */
            function validateSession() {

                if (isUndefined($sessionStorage.rol_user) || isEmptyString($sessionStorage.rol_user)) {
                    console.error("Usuario no a iniciado session");
                    $state.go("login");
                }
                else {

                    $scope.nameUser = $sessionStorage.nameUser;
                    $scope.rol_user = $sessionStorage.rol_user;
                    console.log("Rol: " + $scope.rol_user);
                    //menu sidebar
                    $scope.menus = addActiveClassMenu(JSON.parse($sessionStorage.appMenus), MENU_JCR_SEGUROS_ACTIVE.CODE_POLIZAS_MENU);

                }
            }

            validateSession();


            $scope.init = function () {

                console.info("Iniciando controlador PolizaNewCtrl...");
                console.info("Mode edit: " + $stateParams.edit);
                console.info("Id de la poliza: " + $stateParams.poliza_id);

                PolizaService.setModeEdit({
                    isModeEdit: Boolean($stateParams.edit),
                    idUser: parseInt($stateParams.idPoliza)
                });
                PolizaService.setShowGrowlMessage({isShow: false, message: ""});

                //TODO trabajar aqui la edicion

            }

            $scope.init();


            $scope.searchUsersInTheSystem = function (str) {

                var requestFilter = {JcrParameters:{User:{filter:str}}};

                return UserService.getUsersFilter(requestFilter)
                    .then(function (result) {

                        if (result.JcrResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {

                            $scope.usersFilter = [];
                            var array = result.JcrResponse.object;

                            array.forEach(function (entry) {
                                var aux = {
                                    usuario_id: entry.usuario_id,
                                    nombre: entry.nombre,
                                    apellido: entry.apellido,
                                    documento_id: entry.documento_id,
                                    tipo_usuario_id: entry.tipo_usuario_id,
                                };

                                $scope.usersFilter.push(aux);
                            });

                        } else {
                            $scope.usersFilter = [];
                            console.info(result.JcrResponse.message);
                        }

                        return $scope.usersFilter;

                    }).catch(function (err) {
                        console.error("Error invocando service filter" + err);
                    });
            };


            $scope.selectedUser = function(select){
                $scope.poliza.usuario_id_agente = (select != undefined) ? select.originalObject.usuario_id : null;
            }

            $scope.savePoliza = function(){

                var request={
                    JcrParameters:{
                        Poliza:{
                            numero_poliza : $scope.poliza.numero_poliza,
                            ramo_id : $scope.poliza.ramo_id,
                            aseguradora_id:  $scope.aseguradoraListFinal[0].aseguradora_id,
                            numero_recibo: $scope.poliza.numero_recibo,
                            vigencia: formatDate($scope.poliza.vigencia),
                            tipo_poliza_id:$scope.poliza.tipo_poliza_id,
                            referencia:$scope.poliza.referencia,
                            prima_total:$scope.poliza.prima_total,
                            usuario_id_agente: $scope.poliza.usuario_id_agente,
                            status_id:1,
                            beneficiarios:[]
                        }
                    }
                }

                //agregar tomador

                $scope.tomadorListFinal.forEach(function(entry){

                    if(GLOBAL_CONSTANT.TOMADOR == entry.type_usuario_poliza){
                        request.JcrParameters.Poliza.usuario_id_tomador = entry.usuario_id;
                    }
                    else if(GLOBAL_CONSTANT.TITULAR == entry.type_usuario_poliza){
                        request.JcrParameters.Poliza.usuario_id_titular = entry.usuario_id;
                    }else{
                        request.JcrParameters.Poliza.beneficiarios.push({usuario_id:entry.usuario_id});
                    }

                });

                //TODO agregar poliza_id para la edicion

                console.log(request);

                //validar request antes de mandar peticion

                PolizaService.newPoliza(request).then(function(resp){

                    if(resp.JcrResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){

                        //modo edicion
                        if(UserService.getModeEdit().isModeEdit){

                            PolizaService.setShowGrowlMessage({isShow: true,message: GLOBAL_MESSAGE.MESSAGE_SAVE_USER_SUCCESS});
                            $state.go("verPolizas");
                        }
                        else{
                            $confirm({text: 'Desea crear una nueva poliza en sistema', ok: 'Si', cancel: 'No'})
                                .then(function () {
                                    //TODO crear metodo para limpiar campos
                                    $state.go("verPolizas");
                                })
                                .catch(function () {
                                    PolizaService.setShowGrowlMessage({isShow: true,message: GLOBAL_MESSAGE.MESSAGE_SAVE_USER_SUCCESS});
                                    $state.go("verPolizas");
                                });
                        }

                    }
                    else{
                        console.log("Error: "+resp.JcrResponse.message);
                        growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                    }

                }).catch(function(err){
                    console.log("Error: "+err);
                });


            }


            /**
             * Open calendar
             */
            $scope.open1 = function () {
                $scope.popup1.opened = true;
            };

            $scope.popup1 = {
                opened: false
            };

            $scope.openModalAseguradora = function () {
                openModalAddAseguradora();
            }


            $scope.openModalUsuario = function (type_user) {
                openModalAddUsers(type_user);
            }

            $scope.openModalBeneficiarios = function(type_user){
                openModalBeneficiarios(type_user);
            }
            /**
             * Borrar Aseguradora
             * @param aseguradora_id
             */
            $scope.deleteAseguradoraSelect = function (aseguradora_id) {

                var index = -1;
                for (var i = 0, len = $scope.aseguradoraListFinal.length; i < len; i++) {
                    if ($scope.aseguradoraListFinal[i].aseguradora_id === aseguradora_id) {
                        index = i;
                        break;
                    }
                }

                $scope.aseguradoraListFinal.splice(index, 1);


                if ($scope.aseguradoraListFinal.length == 0) {
                    $scope.showTableAseguradora = false;
                }
            }


            /**
             * Borrar Delete
             * @param aseguradora_id
             */
            $scope.deleteUsersTomadorSelect = function (usuario_id,type_usuario_poliza) {

                var index = -1;
                for (var i = 0, len = $scope.tomadorListFinal.length; i < len; i++) {
                    if ($scope.tomadorListFinal[i].usuario_id == usuario_id &&
                        $scope.tomadorListFinal[i].type_usuario_poliza == type_usuario_poliza) {

                        index = i;
                        break;
                    }
                }

                $scope.tomadorListFinal.splice(index, 1);

                if ($scope.tomadorListFinal.length == 0) {
                    $scope.showTableTomador = false;
                }
            }



            function openModalAddAseguradora() {

                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'listAseguradorasAddModal.html',
                    controller: 'AseguradoraListModalCtrl',
                    size: 'lg',
                    resolve: {}
                });

                //resultado de lo selecionado en el modal
                modalInstance.result.then(function (selectedItem) {

                    if (selectedItem.length > 0) {

                        if (!$scope.aseguradoraListFinal.length > 0) {

                            selectedItem.forEach(function (entry) {

                                $scope.aseguradoraListFinal.push(entry);
                            });
                            $scope.showTableAseguradora = true;
                        }
                        else {
                            growl.warning("Solo puedes agregar una sola aseguradora");
                        }

                    }
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            }


            function openModalAddUsers(type_user) {

                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'listUsersAddModal.html',
                    controller: 'UsuarioListModalCtrl',
                    size: 'lg',
                    resolve: {
                        type_user_poliza:type_user
                    }
                });

                //resultado de lo selecionado en el modal
                modalInstance.result.then(function (selectedItem) {
                    console.log(selectedItem);

                    if (selectedItem.length > 0) {

                        selectedItem.forEach(function (entry) {

                            if (!searchObjList(entry.usuario_id,type_user)) {
                                $scope.tomadorListFinal.push(entry);
                            }

                        });
                        $scope.showTableTomador = true;
                    }
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            }


            function openModalBeneficiarios(type_user){

                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'listBeneficiariosAddModal.html',
                    controller: 'BeneficListModalCtrl',
                    size: 'lg',
                    resolve: {
                        type_user_poliza:type_user
                    }
                });

                //resultado de lo selecionado en el modal
                modalInstance.result.then(function (selectedItem) {

                    if (selectedItem.length > 0) {

                        selectedItem.forEach(function (entry) {

                            if (!searchObjList(entry.usuario_id,type_user)) {
                                $scope.tomadorListFinal.push(entry);
                            }

                        });
                        $scope.showTableTomador = true;
                    }
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            }

            /**
             * Valida si el usuario ya esta en la lista
             * @param id_user
             * @returns {boolean}
             */
            function searchObjList(usuario_id,type_usuario_poliza) {

                var validate = false;

                if ($scope.tomadorListFinal.length > 0) {

                    if(GLOBAL_CONSTANT.TITULAR == type_usuario_poliza){

                        if(!existsTitular($scope.tomadorListFinal)){
                            $scope.tomadorListFinal.forEach(function (entry) {
                                if (entry.usuario_id == usuario_id && entry.type_usuario_poliza == type_usuario_poliza) {
                                    validate = true;
                                }
                            });
                        }else{
                            validate = true;
                        }
                    }
                    else if(GLOBAL_CONSTANT.TOMADOR == type_usuario_poliza){

                        if(!existsTomador($scope.tomadorListFinal)){
                            $scope.tomadorListFinal.forEach(function (entry) {
                                if (entry.usuario_id == usuario_id && entry.type_usuario_poliza == type_usuario_poliza) {
                                    validate = true;
                                }
                            });
                        }else{
                            validate = true;
                        }

                    }else{

                        $scope.tomadorListFinal.forEach(function (entry) {
                            if (entry.usuario_id == usuario_id) {
                                validate = true;
                            }
                        });
                    }

                }

                return validate;
            }
            $scope.toggleAnimation = function () {
                $scope.animationsEnabled = !$scope.animationsEnabled;
            };



        }])

    // controlador comportamiento del model
    .controller('AseguradoraListModalCtrl', ['$scope', '$state', '$sessionStorage', '$uibModalInstance', 'AseguradoraService',
        function ($scope, $state, $sessionStorage, $uibModalInstance, AseguradoraService) {

            $scope.totalPages = 0;
            $scope.aseguradorasListSelect = [];

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
                    limit: 5,
                    sortDir: 'asc',
                    sortedBy: 'aseguradora_nombre',
                    filter: ''
                }
            };


            /**
             * Call service all user
             */
            $scope.getAllAseguradora = function () {


                AseguradoraService.allAseguradoraPaginate($scope.filterCriteria).then(function (data) {
                    $scope.aseguradoras = data.aseguradora;
                    $scope.totalPages = data.totalPages;
                    $scope.totalRecords = data.totalRecords;

                }).catch(function (err) {
                    console.error("Error invocando servicio getAllUsers " + err);
                    $scope.aseguradoras = [];
                    $scope.totalPages = 0;
                    $scope.totalRecords = 0;
                });
            }

            //called when navigate to another page in the pagination
            $scope.selectPage = function () {
                $scope.getAllAseguradora();
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


            $scope.selectPage();


            $scope.listAseguradora = function (obj) {

                var size = $scope.aseguradorasListSelect.length;
                if (size > 0) {
                    $scope.aseguradorasListSelect = [];
                }
                $scope.aseguradorasListSelect.push(obj);
            }


            $scope.processAseguradora = function () {
                $uibModalInstance.close($scope.aseguradorasListSelect);
            };


        }])

    .controller('UsuarioListModalCtrl', ['$scope', '$state', '$sessionStorage', '$uibModalInstance', 'UserService','type_user_poliza',
        function ($scope, $state, $sessionStorage, $uibModalInstance, UserService,type_user_poliza) {

            $scope.totalPages = 0;
            $scope.userListSelect = [];

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
            }, {
                title: 'Tipo de Usuario',
                value: 'Usuarios.tipo_usuario_id'
            }
            ];


            //default criteria that will be sent to the server
            $scope.filterCriteria = {
                JcrParameters: {
                    Users: {
                        page: 1,
                        limit: 5,
                        sortDir: 'asc',
                        sortedBy: 'nombre',
                        filter: ''
                    }
                }
            };


            /**
             * Call service all user
             */
            $scope.getAllUsers = function () {


                UserService.getUsers($scope.filterCriteria).then(function (data) {
                    $scope.users = addTypeUserPoliza(data.users);
                    $scope.totalPages = data.totalPages;
                    $scope.totalRecords = data.totalRecords;

                }).catch(function (err) {
                    console.error("Error invocando servicio getAllUsers " + err);
                    $scope.users = [];
                    $scope.totalPages = 0;
                    $scope.totalRecords = 0;
                });
            }

            //called when navigate to another page in the pagination
            $scope.selectPage = function () {
                $scope.getAllUsers();
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



            $scope.listUsers = function (obj) {
                var size = $scope.userListSelect.length;
                if (size > 0) {
                    $scope.userListSelect = [];
                }
                $scope.userListSelect.push(obj);
                console.log($scope.userListSelect);
            }

            $scope.processUsuario = function () {
                $uibModalInstance.close($scope.userListSelect);
            };

            $scope.selectPage();


            function addTypeUserPoliza(users){

                var result = [];

                users.forEach(function(entry){

                    var obj={}

                    obj.usuario_id = entry.usuario_id;
                    obj.nombre = entry.nombre;
                    obj.apellido = entry.apellido;
                    obj.documento_id = entry.documento_id;
                    obj.tipo_usuario = entry.tipo_usuario.tipo_usuario_nombre;
                    obj.type_usuario_poliza = type_user_poliza;
                    result.push(obj);

                });


                return result;

            }

        }])

    .controller('BeneficListModalCtrl', ['$scope', '$state', '$sessionStorage', '$uibModalInstance', 'UserService','type_user_poliza',
        function ($scope, $state, $sessionStorage, $uibModalInstance, UserService,type_user_poliza) {

            $scope.totalPages = 0;
            $scope.userListSelect = [];

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
            }, {
                title: 'Tipo de Usuario',
                value: 'Usuarios.tipo_usuario_id'
            }
            ];


            //default criteria that will be sent to the server
            $scope.filterCriteria = {
                JcrParameters: {
                    Users: {
                        page: 1,
                        limit: 5,
                        sortDir: 'asc',
                        sortedBy: 'nombre',
                        filter: ''
                    }
                }
            };


            /**
             * Call service all user
             */
            $scope.getAllUsers = function () {


                UserService.getUsers($scope.filterCriteria).then(function (data) {
                    $scope.users = addTypeUserPoliza(data.users);
                    $scope.totalPages = data.totalPages;
                    $scope.totalRecords = data.totalRecords;

                }).catch(function (err) {
                    console.error("Error invocando servicio getAllUsers " + err);
                    $scope.users = [];
                    $scope.totalPages = 0;
                    $scope.totalRecords = 0;
                });
            }

            //called when navigate to another page in the pagination
            $scope.selectPage = function () {
                $scope.getAllUsers();
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



            $scope.listUsers = function (obj) {

                if (searchObjList(obj.usuario_id)) {
                    deleteUserSelect(obj.usuario_id);
                } else {
                    $scope.userListSelect.push(obj);
                }
            }

            /**
             * Valida si el usuario ya esta en la lista
             * @param id_user
             * @returns {boolean}
             */
            function searchObjList(usuario_id) {

                var validate = false;

                if ($scope.userListSelect.length > 0) {

                    $scope.userListSelect.forEach(function (entry) {

                        if (entry.usuario_id == usuario_id) {
                            validate = true;
                        }
                    });
                }

                return validate;
            }


            /**
             * Borrar elemento de la lista selecionada
             * @param id_stop
             */
            function deleteUserSelect(usuario_id) {

                console.log("Delete Element: " + usuario_id);

                var index = -1;
                for (var i = 0, len = $scope.userListSelect.length; i < len; i++) {
                    if ($scope.userListSelect[i].usuario_id == usuario_id) {
                        index = i;
                        break;
                    }
                }

                $scope.userListSelect.splice(index, 1);

            }

            $scope.processUsuario = function () {
                $uibModalInstance.close($scope.userListSelect);
            };

            $scope.selectPage();


            function addTypeUserPoliza(users){

                var result = [];

                users.forEach(function(entry){

                    var obj={}

                    obj.usuario_id = entry.usuario_id;
                    obj.nombre = entry.nombre;
                    obj.apellido = entry.apellido;
                    obj.documento_id = entry.documento_id;
                    obj.tipo_usuario = entry.tipo_usuario.tipo_usuario_nombre;
                    obj.type_usuario_poliza = type_user_poliza;
                    obj.usuario_check = searchObjList(entry.usuario_id);
                    result.push(obj);

                });


                return result;

            }

        }]);