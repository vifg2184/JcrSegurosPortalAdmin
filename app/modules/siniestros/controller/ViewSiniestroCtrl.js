/**
 * Created by JcrSeguros on 23/9/2016.
 */
angular.module("App")
    .controller("ViewSiniestroCtrl", [
        '$scope',
        'SiniestroService',
        'PolizaService',
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
                  PolizaService,
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
            $controller('BaseCtrl', {
                $scope: $scope,
                $state: $state,
                $rootScope: $rootScope,
                $sessionStorage: $sessionStorage
            });


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
                siniestro_id: "",
                siniestro_automovil_id: "",
                poliza_id: "",
                fecha_ocurrencia: "",
                fecha_declaracion: "",
                fecha_inspeccion: "",
                fecha_llegada: "",
                fecha_entrada_taller: "",
                fecha_cierre: "",
                monto_siniestro: "",
                numero_siniestro: "",
                tipo_siniestro_id: "",
                observaciones_odenes: "",
                taller_propuesto: ""
            }


            $scope.repuestosEdit = [];
            $scope.choices = [];
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

            $scope.respuestos = {active: 1}
            $scope.polizaListFinal = [];
            $scope.showTablePoliza = false;


            /**
             * construyendo menu y obteniendo datos de session
             */
            $scope.setUserSession(MENU_JCR_SEGUROS_ACTIVE.CODE_SINIESTRO_MENU);


            /**
             * Metodo inicial del controlador
             */
            $scope.init = function () {


                console.info("Iniciando controlador NewSiniestroCtrl...");
                console.info("Mode edit: " + $stateParams.edit);
                console.info("Id del usuario: " + $stateParams.siniestro_id);
                console.info("Id del tipo de poliza:" + $stateParams.tipo_siniestro_id);



                SiniestroService.setModeEdit({
                    isModeEdit: Boolean($stateParams.edit),
                    idSiniestro: parseInt($stateParams.siniestro_id),
                    idTipoSiniestro: parseInt($stateParams.tipo_siniestro_id)
                });

                SiniestroService.setShowGrowlMessage({isShow: false, message: ""});

                if (SiniestroService.getModeEdit().isModeEdit) {

                    spinnerService.show("spinnerNew");

                    var request = {
                        JcrParameters: {
                            Siniestro: {
                                siniestro_id: SiniestroService.getModeEdit().idSiniestro,
                                tipo_siniestro_id: SiniestroService.getModeEdit().idTipoSiniestro
                            }
                        }
                    }

                    SiniestroService.getSiniestroById(request).then(function (resp) {

                            if (resp.JcrResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {

                                var dataSiniestro = resp.JcrResponse.object[0];
                                $scope.siniestro.tipo_siniestro_id = dataSiniestro.tipo_siniestro_id;
                                $scope.siniestro.siniestro_id = dataSiniestro.siniestro_id;
                                $scope.siniestro.poliza_id = dataSiniestro.poliza_id;
                                $scope.siniestro.numero_siniestro = parseInt(dataSiniestro.numero_siniestro);
                                $scope.siniestro.monto_siniestro = dataSiniestro.monto_siniestro;
                                $scope.siniestro.observaciones_ordenes = dataSiniestro.observaciones_ordenes;


                                // invocando servicio para obtener poliza

                                var requestPoliza = {
                                    JcrParameters: {
                                        Poliza: {
                                            poliza_id: $scope.siniestro.poliza_id
                                        }
                                    }
                                };

                                PolizaService.searhPolizaById(requestPoliza).then(function (resp) {

                                    if (resp.JcrResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {

                                        var poliza = resp.JcrResponse.object[0];

                                        console.log(poliza);

                                        $scope.polizaListFinal.push(poliza);
                                        $scope.showTablePoliza = true;
                                        $scope.poliza.prima = $scope.polizaListFinal[0].prima_total;
                                        $scope.poliza.ramo = $scope.polizaListFinal[0].ramo;
                                        $scope.calcularSiniestralidad();


                                        if ($scope.siniestro.tipo_siniestro_id == GLOBAL_CONSTANT.TIPO_SINIESTRO_AUTO) {

                                            $scope.siniestro.siniestro_automovil_id = dataSiniestro.siniestroAuto.siniestro_automovil_id;
                                            $scope.siniestro.fecha_ocurrencia = getDateFormat(dataSiniestro.siniestroAuto.fecha_ocurrencia);
                                            $scope.siniestro.fecha_declaracion = getDateFormat(dataSiniestro.siniestroAuto.fecha_declaracion);
                                            $scope.siniestro.fecha_inspeccion = getDateFormat(dataSiniestro.siniestroAuto.fecha_inspeccion);
                                            $scope.siniestro.fecha_entrada_taller = getDateFormat(dataSiniestro.siniestroAuto.fecha_entrada_taller);
                                            $scope.siniestro.fecha_cierre = getDateFormat(dataSiniestro.siniestroAuto.fecha_cierre);
                                            $scope.siniestro.taller_propuesto = dataSiniestro.siniestroAuto.taller_propuesto;

                                            //procesando repuestos

                                            if (dataSiniestro.repuestos.length > 0) {

                                                var repuesto = null;
                                                $scope.respuestos.active = 2;
                                                dataSiniestro.repuestos.forEach(function (entry) {

                                                    repuesto = {};
                                                    repuesto.id = entry.repuesto_id;
                                                    repuesto.fecha_llegada = formatDate(entry.fecha_llegada);
                                                    repuesto.descripcion = entry.descripcion;
                                                    repuesto.observaciones = entry.observaciones;
                                                    repuesto.mode = "E";
                                                    $scope.choices.push(repuesto);

                                                });
                                            }

                                            $scope.showInfoAutoSiniestro = true;
                                        }
                                        else {
                                            //tipo reclamo salud
                                            $scope.showReclamoSalud = true;
                                        }

                                        spinnerService.hide("spinnerNew");
                                    }
                                    else {
                                        console.error("Error obteniendo los datos del servicio Poliza:" + resp.JcrResponse.message);
                                        spinnerService.hide("spinnerNew");
                                    }

                                }).catch(function (err) {
                                    console.error("Error obteniendo los datos del servicio Poliza:" + err);
                                    spinnerService.hide("spinnerNew");
                                });

                            }
                            else {
                                console.error("Error obteniendo los datos del servicio:" + resp.message);
                                spinnerService.hide("spinnerNew");
                            }
                        })
                        .catch(function (err) {
                            console.error("Error obteniendo los datos del servicio:" + err);
                            spinnerService.hide("spinnerNew");
                        })

                }
                else {

                    console.log("Creacion de siniestro");
                    $scope.choices.push({id: 1, fecha_llegada: "", descripcion: "", observacion: "", mode: ""});
                    spinnerService.hide("spinnerNew");
                }

            }

            $scope.init();


            /**
             * funcion que agrega en la lsta de repuesto
             */
            $scope.addNewChoice = function () {
                var newItemNo = $scope.choices.length + 1;
                $scope.choices.push({id: newItemNo, descripcion: "", observacion: ""});
                console.log($scope.choices);
            }

            /**
             * funcion que remueve lista de repuesto involucrados
             */
            $scope.removeChoice = function () {
                var lastItem = $scope.choices.length - 1;
                if (lastItem != 0) {
                    $scope.choices.splice(lastItem);
                }
            };

            /**
             * funcion calculando siniestralidad
             */
            $scope.calcularSiniestralidad = function () {

                if ($scope.montoOrden != null) {
                    $scope.porcentaje_siniestralidad = ($scope.siniestro.monto_siniestro * 100) / $scope.poliza.prima;
                }
                else {
                    $scope.siniestro.monto_siniestro = "";
                    $scope.porcentaje_siniestralidad = 0;
                }

            }


            $scope.openFechaOcurrencia = function () {
                $scope.popupFechaOcurrencia.opened = true;
            };
            $scope.popupFechaOcurrencia = {opened: false};

            $scope.openFechaDeclaracion = function () {
                $scope.popupFechaDeclaracion.opened = true;
            };
            $scope.popupFechaDeclaracion = {opened: false};


            $scope.openFechaInspeccion = function () {
                $scope.popupFechaInspeccion.opened = true;
            };
            $scope.popupFechaInspeccion = {opened: false};

            $scope.openFechaOrden = function () {
                $scope.popupFechaOrden.opened = true;
            };
            $scope.popupFechaOrden = {opened: false};

            $scope.openFechaEntTaller = function () {
                $scope.popupFechaEntTaller.opened = true;
            };
            $scope.popupFechaEntTaller = {opened: false};

            $scope.openFechaCierre = function () {
                $scope.popupFechaCierre.opened = true;
            };
            $scope.popupFechaCierre = {opened: false};


            /**
             * abriendo modal para buscar poliza
             */
            $scope.openModalPoliza = function () {
                openModalSearchPoliza();
            }


            /**
             * borrando poliza seleccionada
             * @param poliza_id
             */
            $scope.deletePolizaSelect = function (poliza_id) {

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




        }]);