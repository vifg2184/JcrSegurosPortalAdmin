/**
 * Created by JcrSeguros on 23/9/2016.
 */
angular.module("App")
    .controller("NewSiniestroCtrl", [
        '$scope',
        'SiniestroService',
        '$state',
        '$rootScope',
        'spinnerService',
        '$sessionStorage',
        'growl',
        '$confirm',
        '$timeout',
        '$uibModal',
        'GLOBAL_MESSAGE',
        'GLOBAL_CONSTANT',
        'MENU_JCR_SEGUROS_ACTIVE',
        '$controller',
        '$stateParams',
        function ($scope,
                  SiniestroService,
                  $state,
                  $rootScope,
                  spinnerService,
                  $sessionStorage,
                  growl,
                  $confirm,
                  $timeout,
                  $uibModal,
                  GLOBAL_MESSAGE,
                  GLOBAL_CONSTANT,
                  MENU_JCR_SEGUROS_ACTIVE,
                  $controller,
                  $stateParams) {

            //herencia metodos comunes
            $controller('BaseCtrl', {$scope: $scope,
                $state: $state,
                $rootScope: $rootScope,
                $sessionStorage: $sessionStorage});


            $scope.menuOptions = {searchWord: ''};

            $scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'MM/dd/yyyy', 'shortDate'];
            $scope.format = $scope.formats[2];
            $scope.altInputFormats = ['M!/d!/yyyy'];

            $scope.showInfoAutoSiniestro = false;
            $scope.showReclamoSalud = false;
            $scope.poliza = {};
            $scope.montoOrden = "";
            $scope.porcentaje_siniestralidad = "";

            $scope.siniestro = {
                siniestro_id:"",
                siniestro_automovil_id:"",
                poliza_id:"",
                fecha_ocurrencia: "",
                fecha_declaracion: "",
                fecha_inspeccion: "",
                fecha_llegada: "",
                fecha_entrada_taller:"",
                fecha_cierre:"",
                monto_siniestro:"",
                numero_siniestro:"",
                tipo_siniestro_id:"",
                observaciones_odenes:"",
                taller_propuesto:""
            }


            $scope.repuestosEdit = [];
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

            $scope.respuestos = {active:1}
            $scope.polizaListFinal = [];
            $scope.showTablePoliza = false;


            /**
             * construyendo menu y obteniendo datos de session
             */
            $scope.setUserSession(MENU_JCR_SEGUROS_ACTIVE.CODE_SINIESTRO_MENU);


            /**
             * Metodo inicial del controlador
             */
            $scope.init = function(){

                //TODO aqui tengo q trabajar la edicion
                console.info("Iniciando controlador NewSiniestroCtrl...");
                console.info("Mode edit: " + $stateParams.edit);
                console.info("Id del usuario: " + $stateParams.id_user);


                SiniestroService.setModeEdit({
                    isModeEdit: Boolean($stateParams.edit),
                    idSiniestro: parseInt($stateParams.siniestro_id)
                });

                SiniestroService.setShowGrowlMessage({isShow: false, message: ""});

                if(SiniestroService.getModeEdit().isModeEdit){
                    //TODO edicion de siniestro




                }else{
                    //TODO creacion de siniestro
                }

            }

            $scope.init();


            $scope.choices = [{id:1,fecha_llegada:"",descripcion:"",observacion:""}];

            /**
             * funcion que agrega en la lsta de repuesto
             */
            $scope.addNewChoice = function(){
                var newItemNo = $scope.choices.length+1;
                $scope.choices.push({id:newItemNo,descripcion:"",observacion:""});
                console.log($scope.choices);
            }

            /**
             * funcion que remueve lista de repuesto involucrados
             */
            $scope.removeChoice = function() {
                var lastItem = $scope.choices.length-1;
                if(lastItem != 0){
                    $scope.choices.splice(lastItem);
                }
            };

            /**
             * funcion calculando siniestralidad
             */
            $scope.calcularSiniestralidad = function(){

                if($scope.montoOrden != null){
                    $scope.porcentaje_siniestralidad = ($scope.siniestro.monto_siniestro * 100) /  $scope.poliza.prima;
                }
                else{
                    $scope.siniestro.monto_siniestro = "";
                    $scope.porcentaje_siniestralidad = 0;
                }

            }


            $scope.openFechaOcurrencia = function () {$scope.popupFechaOcurrencia.opened = true;};
            $scope.popupFechaOcurrencia = {opened: false};

            $scope.openFechaDeclaracion = function () {$scope.popupFechaDeclaracion.opened = true;};
            $scope.popupFechaDeclaracion = {opened: false};


            $scope.openFechaInspeccion = function () {$scope.popupFechaInspeccion.opened = true;};
            $scope.popupFechaInspeccion = {opened: false};

            $scope.openFechaOrden = function () {$scope.popupFechaOrden.opened = true;};
            $scope.popupFechaOrden = {opened: false};

            $scope.openFechaEntTaller = function () {$scope.popupFechaEntTaller.opened = true;};
            $scope.popupFechaEntTaller = {opened: false};

            $scope.openFechaCierre = function () {$scope.popupFechaCierre.opened = true;};
            $scope.popupFechaCierre = {opened: false};


            /**
             * abriendo modal para buscar poliza
             */
            $scope.openModalPoliza = function(){openModalSearchPoliza();}


            /**
             * borrando poliza seleccionada
             * @param poliza_id
             */
            $scope.deletePolizaSelect = function(poliza_id){

                var index = -1;
                for (var i = 0, len = $scope.polizaListFinal.length; i < len; i++) {
                    if ($scope.polizaListFinal[i].poliza_id === poliza_id) {
                        index = i;
                        break;
                    }
                }

                $scope.polizaListFinal.splice(index, 1);


                if ($scope.polizaListFinal.length == 0) {
                    $scope.showTablePoliza = false;
                    $scope.showReclamoSalud = false;
                    $scope.showInfoAutoSiniestro = false;
                }

            }

            /**
             * Metodo para guardar el siniestro
             */
            $scope.saveSiniestro = function(){

                var requestNewSiniestro = null;

                if($scope.poliza.ramo.ramo_id == GLOBAL_CONSTANT.RAMO_PERSONAS){

                    requestNewSiniestro = {
                        JcrParameters:{
                            SiniestroSystem:{
                                siniestro:{
                                    poliza_id: $scope.siniestro.poliza_id,
                                    numero_siniestro:$scope.siniestro.numero_siniestro,
                                    monto_siniestro:$scope.siniestro.monto_siniestro,
                                    tipo_siniestro_id:GLOBAL_CONSTANT.RAMO_PERSONAS
                                }
                            }
                        }
                    }

                    //TODO agregar aqui el id cuando este editando

                    if(SiniestroService.getModeEdit().isModeEdit){
                        requestNewSiniestro.JcrParameters.SiniestroSystem.siniestro.siniestro_id = SiniestroService.getModeEdit().idSiniestro;
                    }

                }else if($scope.poliza.ramo.ramo_id == GLOBAL_CONSTANT.RAMO_AUTO){

                    requestNewSiniestro ={
                        JcrParameters:{
                            SiniestroSystem:{
                                siniestro:{
                                    poliza_id: $scope.siniestro.poliza_id,
                                    numero_siniestro: $scope.siniestro.numero_siniestro,
                                    monto_siniestro: $scope.siniestro.monto_siniestro,
                                    tipo_siniestro_id: GLOBAL_CONSTANT.RAMO_PERSONAS
                                },
                                auto:{
                                    fecha_ocurrencia: formatDate($scope.siniestro.fecha_ocurrencia),
                                    fecha_declaracion: formatDate($scope.siniestro.fecha_declaracion),
                                    fecha_inspeccion: formatDate($scope.siniestro.fecha_inspeccion),
                                    observaciones_odenes: $scope.siniestro.observaciones_odenes,
                                    taller_propuesto: $scope.siniestro.taller_propuesto,
                                    fecha_entrada_taller: formatDate($scope.siniestro.fecha_entrada_taller),
                                    fecha_cierre: formatDate($scope.siniestro.fecha_cierre)
                                },
                                respuestos:[]
                            }
                        }
                    }

                    if($scope.choices.length > 0){
                        $scope.choices.forEach(function(entry){

                            var repuesto = {};

                            repuesto.fecha_llegada = formatDate(entry.fecha_llegada);
                            repuesto.descripcion = entry.descripcion;
                            repuesto.observaciones = entry.observaciones;

                            requestNewSiniestro.JcrParameters.SiniestroSystem.respuestos.push(repuesto);
                        });

                    }

                    //TODO agregar aqui el id cuando este editando

                    if(SiniestroService.getModeEdit().isModeEdit){
                        requestNewSiniestro.JcrParameters.SiniestroSystem.siniestro.siniestro_id = SiniestroService.getModeEdit().idSiniestro;
                        requestNewSiniestro.JcrParameters.SiniestroSystem.auto.siniestro_automovil_id = $scope.siniestro.siniestro_automovil_id;



                    }

                }


                console.log(requestNewSiniestro);

            }

            function openModalSearchPoliza() {

                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'listPolizaSearchModal.html',
                    controller: 'PolizaSearchModalCtrl',
                    size: 'lg',
                    resolve: {}
                });

                //resultado de lo selecionado en el modal
                modalInstance.result.then(function (selectedItem) {

                    if (selectedItem.length > 0) {

                        if (!$scope.polizaListFinal.length > 0) {

                            selectedItem.forEach(function (entry) {

                                $scope.polizaListFinal.push(entry);
                            });

                            $scope.showTablePoliza = true;
                            $scope.poliza.prima = $scope.polizaListFinal[0].prima_total;
                            $scope.siniestro.poliza_id = $scope.polizaListFinal[0].poliza_id;

                            $scope.poliza.ramo = $scope.polizaListFinal[0].ramo;

                            if($scope.poliza.ramo.ramo_id == GLOBAL_CONSTANT.RAMO_PERSONAS){
                                $scope.showReclamoSalud = true;
                            }
                            else if($scope.poliza.ramo.ramo_id == GLOBAL_CONSTANT.RAMO_AUTO){

                                $scope.showInfoAutoSiniestro = true;
                            }

                            console.log($scope.polizaListFinal);

                        }
                        else {
                            growl.warning("Solo puedes agregar una sola poliza");
                        }

                    }
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            }



        }])

    /**
     * Controlador para implementar el funcionamiendo del modal
     */
    .controller('PolizaSearchModalCtrl', ['$scope', '$state', '$sessionStorage', '$uibModalInstance', 'PolizaService',
        function ($scope, $state, $sessionStorage, $uibModalInstance, PolizaService) {


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

            $scope.totalPages = 0;
            $scope.polizaListSelect=[];
            /**
             * Call service all user
             */
            $scope.getAllPoliza = function () {


                PolizaService.allPolizaPaginate($scope.filterCriteria).then(function (data) {
                    $scope.polizas = data.poliza;
                    $scope.totalPages = data.totalPages;
                    $scope.totalRecords = data.totalRecords;


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
                $scope.getAllPoliza();
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

            $scope.selectPage();

            $scope.listPoliza = function (obj) {

                var size = $scope.polizaListSelect.length;
                if (size > 0) {
                    $scope.polizaListSelect = [];
                }
                $scope.polizaListSelect.push(obj);
            }


            $scope.processPoliza = function () {
                $uibModalInstance.close($scope.polizaListSelect);
            };


        }]);