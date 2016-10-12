/**
 * Created by JcrSeguros on 12/9/2016.
 */

angular.module("App")

    .controller("NewPolizaCtrl", [
        '$scope',
        'UserService',
        'ClientServices',
        'PolizaService',
        'VehiculoService',
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
        '$controller',
        function ($scope,
                  UserService,
                  ClientServices,
                  PolizaService,
                  VehiculoService,
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
                  MENU_JCR_SEGUROS_ACTIVE,
                  $controller) {


            //herencia metodos comunes
            $controller('BaseCtrl', {
                $scope: $scope,
                $state: $state,
                $rootScope: $rootScope,
                $sessionStorage: $sessionStorage
            });

            //Search on the menu
            $scope.menuOptions = {searchWord: ''};

            $scope.aseguradoraListFinal = [];
            $scope.showTableAseguradora = false;
            $scope.selectEditAgente = null;
            $scope.CoberturaSelected = null;
            $scope.cobertura_id_selected = null;
            $scope.listVehiculosPoliza = [];
            $scope.showTableVehiculos = false;
            $scope.showAddVehiculo = false;
            $scope.selectPlaca = "";


            $scope.poliza = {
                poliza_id: null,
                numero_poliza: "",
                ramo: null,
                aseguradora_id: "",
                numero_recibo: "",
                fecha_emision: "",
                fecha_vencimiento: "",
                referencia: "",
                prima_total: "",
                agente: "",
                agente_helper: "",
                asegurado: {
                    "cliente_id": null,
                    "nombre_cliente": "",
                    "apellido_cliente": "",
                    "documento_id_cliente": "",
                    "fecha_nacimiento": "",
                    "genero_cliente": "",
                    telefono: "",
                    "correo_cliente": "",
                    "direccion": "",
                    "tipo_cliente_id": "",
                    "es_tomador": false
                },
                tomador: {
                    "cliente_id": null,
                    "nombre_cliente": "",
                    "apellido_cliente": "",
                    "documento_id_cliente": "",
                    "tipo_cliente_id": "",
                },
                vehiculo:[]
            }

            $scope.poliza_helper = {
                ramo: []
            }

            $scope.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'MM/dd/yyyy', 'shortDate'];
            $scope.format = $scope.formats[2];
            $scope.altInputFormats = ['M!/d!/yyyy'];

            $scope.tipo_poliza_select = [
                {tipo_poliza_id: 1, tipo_poliza_nombre: "Individual"},
                {tipo_poliza_id: 2, tipo_poliza_nombre: "Colectiva"},
                {tipo_poliza_id: 3, tipo_poliza_nombre: "Solidaria"}
            ]

            var descripcionDeCoberturaStandar = [
                {
                    descripcion_cobertura_id: 1,
                    descripcion_cobertura_nombre: "Suma Asegurada"
                }, {
                    descripcion_cobertura_id: 2,
                    descripcion_cobertura_nombre: "Deducible"
                }];

            var descripcionDeCoberturaSimple = [
                {
                    descripcion_cobertura_id: 1,
                    descripcion_cobertura_nombre: "Suma Asegurada"
                }
            ];

            var descripcionDeCoberturaAutoStandar = [
                {
                    descripcion_cobertura_id: 1,
                    descripcion_cobertura_nombre: "Suma Asegurada"
                }, {
                    descripcion_cobertura_id: 2,
                    descripcion_cobertura_nombre: "Deducible"
                }, {
                    descripcion_cobertura_id: 3,
                    descripcion_cobertura_nombre: "Tasa"
                }];

            var coberturaStandarSalud = [{
                cobertura_id: 1,
                cobertura_nombre: "HC Basico",
                descripciones_cobertura: descripcionDeCoberturaStandar
            }, {
                cobertura_id: 2,
                cobertura_nombre: "HC Exceso",
                descripciones_cobertura: descripcionDeCoberturaStandar
            }, {
                cobertura_id: 3,
                cobertura_nombre: "Maternidad",
                descripciones_cobertura: descripcionDeCoberturaStandar
            }, {
                cobertura_id: 4,
                cobertura_nombre: "Maternidad Exceso",
                descripciones_cobertura: descripcionDeCoberturaStandar
            }];

            var coberturaDefecto = [{
                cobertura_id: 9,
                cobertura_nombre: "Coberturas",
                descripciones_cobertura: descripcionDeCoberturaSimple
            }];

            var coberturaStandarAutomovil = [{
                cobertura_id: 5,
                cobertura_nombre: "Perdida Total",
                descripciones_cobertura: descripcionDeCoberturaAutoStandar
            }, {
                cobertura_id: 6,
                cobertura_nombre: "Cobertura Amplia",
                descripciones_cobertura: descripcionDeCoberturaAutoStandar
            }, {
                cobertura_id: 7,
                cobertura_nombre: "RCV",
                descripciones_cobertura: descripcionDeCoberturaAutoStandar
            }, {
                cobertura_id: 8,
                cobertura_nombre: "Producto Especial",
                descripciones_cobertura: descripcionDeCoberturaAutoStandar
            }];

            $scope.ramo_select = [
                {
                    ramo_id: 1,
                    ramo_nombre: "Hospitalizacion Colectivos",
                    seleccion_multiple: "1",
                    coberturas: coberturaStandarSalud
                }, {
                    ramo_id: 2,
                    ramo_nombre: "Hospitalizacion Individual",
                    seleccion_multiple: "1",
                    coberturas: coberturaStandarSalud
                }, {
                    ramo_id: 3,
                    ramo_nombre: "Automovil Flota",
                    seleccion_multiple: "0",
                    coberturas: coberturaStandarAutomovil
                }, {
                    ramo_id: 4,
                    ramo_nombre: "Automovil Individual",
                    seleccion_multiple: "0",
                    coberturas: coberturaStandarAutomovil
                }, {
                    ramo_id: 5,
                    ramo_nombre: "Accidentes Personales",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto,
                },
                {
                    ramo_id: 7,
                    ramo_nombre: "Armas y Equipaje",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 9,
                    ramo_nombre: "Combinado Empresarial",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 10,
                    ramo_nombre: "Combinado Rescidencial",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 11,
                    ramo_nombre: "Construccion",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 12,
                    ramo_nombre: "Dinero y Valores",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 13,
                    ramo_nombre: "Objetos Valiosos",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 14,
                    ramo_nombre: "Equipo Contratista",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 15,
                    ramo_nombre: "Equipo Electronico",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 16,
                    ramo_nombre: "Fidelidad",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 17,
                    ramo_nombre: "Fidelidad 3D",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 18,
                    ramo_nombre: "Incendio y Terremoto",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 19,
                    ramo_nombre: "Lucro Cesante",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 20,
                    ramo_nombre: "Montaje",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 21,
                    ramo_nombre: "Industria y Comercio",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 22,
                    ramo_nombre: "RCG",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 23,
                    ramo_nombre: "RCE",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 24,
                    ramo_nombre: "Responsabilidad Civil Patronal",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 25,
                    ramo_nombre: "Responsabilidad Civil Medico",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 26,
                    ramo_nombre: "Robo",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 27,
                    ramo_nombre: "Rotura de Maquinaria",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 28,
                    ramo_nombre: "Seguro Escolar",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 29,
                    ramo_nombre: "Seguro Especial",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 30,
                    ramo_nombre: "Servicios Funerales Colectivos",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 31,
                    ramo_nombre: "Transporte Maritimo",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 31,
                    ramo_nombre: "Transporte Terrestre",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 32,
                    ramo_nombre: "Vida Colectivo",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 33,
                    ramo_nombre: "Vida Individual",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                },
                {
                    ramo_id: 34,
                    ramo_nombre: "Ramos Tecnicos de Ingenieria",
                    seleccion_multiple: "0",
                    coberturas: coberturaDefecto
                }];

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
            $scope.setUserSession(MENU_JCR_SEGUROS_ACTIVE.CODE_POLIZAS_MENU);


            $scope.init = function () {
                console.info("Iniciando controlador PolizaNewCtrl...");
                console.info("Mode edit: " + $stateParams.edit);
                console.info("Id de la poliza: " + $stateParams.poliza_id);
                $scope.show_agent_helper = 'hidden';

                PolizaService.setModeEdit({
                    isModeEdit: Boolean($stateParams.edit),
                    idPoliza: parseInt($stateParams.poliza_id)
                });

                PolizaService.setShowGrowlMessage({isShow: false, message: ""});

                spinnerService.show("spinnerNew");

                if (PolizaService.getModeEdit().isModeEdit) {

                    var requestService = {JcrParameters: {Poliza: {poliza_id: PolizaService.getModeEdit().idPoliza}}};

                    PolizaService.searhPolizaById(requestService).then(function (resp) {

                        if (resp.JcrResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {
                            $scope.poliza = resp.JcrResponse.object[0];
                            $scope.poliza_helper.ramo = $scope.poliza.ramo;
                            $('#selectRamos').val($scope.poliza.ramo.ramo_id);

                            //si el ramo es de vehiculo se llena el arreglo
                            if($scope.poliza.ramo.ramo_id == GLOBAL_CONSTANT.RAMO_AUTO_INDIVIDUAL ||
                                $scope.poliza.ramo.ramo_id == GLOBAL_CONSTANT.RAMO_AUTO_FLOTA){

                                if($scope.poliza.vehiculo.length > 0){
                                    $scope.listVehiculosPoliza = $scope.poliza.vehiculo;
                                    $scope.showAddVehiculo=true;
                                    $scope.showTableVehiculos=true;
                                }

                            }

                            if ($scope.poliza.ramo.seleccion_multiple == 0) {
                                $scope.CoberturaSelected = $scope.poliza.ramo.coberturas[0];
                            } else {

                            }
                            spinnerService.hide("spinnerNew");
                        } else {
                            console.log(resp.JcrResponse.message);
                            throw "Error Servicio";
                        }

                    }).catch(function (err) {
                        console.error("Error: " + err);
                        spinnerService.hide("spinnerNew");
                        PolizaService.setShowGrowlMessage({
                            isShow: true,
                            message: GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR
                        });
                        $state.go("verPolizas");
                    });
                }
                else {
                    //create poliza
                    spinnerService.hide("spinnerNew");
                    console.log("Modo crear poliza");

                }


            }

            $scope.init();




            /**
             * Evento del cambio de Agente
             */
            $scope.onAgentChangeEvent = function () {
                if ($scope.poliza.agente_helper == 'otro') {
                    $scope.show_agent_helper = '';
                } else {
                    $scope.show_agent_helper = 'hidden';
                }
            }

            /**
             *
             * Agerga el ramo seleccionado a la poliza
             *
             * @param ramo
             */
            $scope.agregarRamoALaPoliza = function (ramoId) {
                var ramoSelected = null;
                for (var i = 0; i < $scope.ramo_select.length; i++) {
                    if ($scope.ramo_select[i].ramo_id == ramoId) {
                        ramoSelected = $scope.ramo_select[i];
                        break;
                    }
                }
                $scope.poliza_helper.ramo = ramoSelected;
                console.log("Ramo seleccionado");
                console.log($scope.poliza_helper.ramo);
                $scope.CoberturaSelected = [];
                $scope.poliza.ramo = {
                    "ramo_id": ramoSelected.ramo_id,
                    "ramo_nombre": ramoSelected.ramo_nombre,
                    "seleccion_multiple": ramoSelected.seleccion_multiple,
                    "coberturas": []
                };

                if($scope.poliza.ramo.ramo_id == GLOBAL_CONSTANT.RAMO_AUTO_INDIVIDUAL || $scope.poliza.ramo.ramo_id == GLOBAL_CONSTANT.RAMO_AUTO_FLOTA){
                    $scope.showAddVehiculo = true;
                }else{
                    $scope.showAddVehiculo = false;
                }

            }

            /**
             *
             * Agrega el o las coberturas seleccionados a la poliza
             *
             * @param coberturaId
             */

            $scope.agregarCoberturasALaPoliza = function (coberturaId, isChecked) {
                console.log(coberturaId);
                if (coberturaId != null && coberturaId != 0 && coberturaId != "") {
                    if (isChecked) {
                        var cobertura = null;
                        for (var i = 0; i < $scope.poliza_helper.ramo.coberturas.length; i++) {
                            if ($scope.poliza_helper.ramo.coberturas[i].cobertura_id == coberturaId) {
                                cobertura = $scope.poliza_helper.ramo.coberturas[i];
                                console.log("Cobertura seleccionada");
                                console.log(cobertura);
                                $scope.CoberturaSelected = cobertura;
                                break;
                            }
                        }
                        var coberturaObject = {
                            cobertura_id: cobertura.cobertura_id,
                            cobertura_nombre: cobertura.cobertura_nombre,
                            descripciones_cobertura: []
                        };
                        for (var i = 0; i < cobertura.descripciones_cobertura.length; i++) {
                            var descripcion_cobertura = {
                                descripcion_cobertura_id: cobertura.descripciones_cobertura[i].descripcion_cobertura_id,
                                descripcion_cobertura_nombre: cobertura.descripciones_cobertura[i].descripcion_cobertura_nombre,
                                monto: 0
                            };
                            coberturaObject.descripciones_cobertura.push(descripcion_cobertura);
                        }
                        $scope.poliza.ramo.coberturas.push(coberturaObject);
                    } else {
                        for (var i = $scope.poliza.ramo.coberturas.length - 1; i >= 0; i--) {
                            if ($scope.poliza.ramo.coberturas[i].cobertura_id === coberturaId) {
                                $scope.poliza.ramo.coberturas.splice(i, 1);
                                break;
                            }
                        }
                    }
                }else{
                    $scope.CoberturaSelected = "";
                }
                console.log($scope.poliza.ramo.coberturas);
            }


            /**
             * Agrega los montos de cobertura seleccionados al objeto poliza
             *
             * @param cobertura
             * @param descripcionCobertura
             * @param monto
             */
            $scope.agregarMontoACobertura = function (cobertura, descripcionCobertura, monto) {
                for (var i = 0; i < $scope.poliza.ramo.coberturas.length; i++) {
                    if ($scope.poliza.ramo.coberturas[i].cobertura_id == cobertura.cobertura_id) {
                        for (var j = 0; j < $scope.poliza.ramo.coberturas[i].descripciones_cobertura.length; j++) {
                            if ($scope.poliza.ramo.coberturas[i].descripciones_cobertura[j].descripcion_cobertura_id == descripcionCobertura.descripcion_cobertura_id) {
                                $scope.poliza.ramo.coberturas[i].descripciones_cobertura[j].monto = monto;
                            }
                        }
                    }
                }
            }

            /**
             *  Maneja el objeto cuando se reutiliza un cliente del sistema como tomador
             * @param objectSelected
             */
            $scope.selectTomador = function (objectSelected) {
                if (objectSelected != undefined && objectSelected != null) {
                    $scope.poliza.tomador.nombre_cliente = objectSelected.originalObject.nombre_cliente;
                    $scope.poliza.tomador.apellido_cliente = objectSelected.originalObject.apellido_cliente;
                    $scope.poliza.tomador.cliente_id = objectSelected.originalObject.cliente_id;
                    $scope.poliza.tomador.documento_id_cliente = objectSelected.originalObject.documento_id_cliente;
                    //$scope.poliza.tomador.tipo_cliente_id = objectSelected.originalObject.tipo_cliente_id;
                }
            }

            /**
             * Selecciona el cliente encontrado
             * @param client
             */
            $scope.selectClient = function (objectSelected) {
                if (objectSelected != undefined && objectSelected != null) {
                    $scope.poliza.asegurado.nombre_cliente = objectSelected.originalObject.nombre_cliente;
                    $scope.poliza.asegurado.apellido_cliente = objectSelected.originalObject.apellido_cliente;
                    $scope.poliza.asegurado.cliente_id = objectSelected.originalObject.cliente_id;
                    $scope.poliza.asegurado.correo_cliente = objectSelected.originalObject.correo_cliente;
                    $scope.poliza.asegurado.documento_id_cliente = objectSelected.originalObject.documento_id_cliente;
                    $scope.poliza.asegurado.fecha_nacimiento = objectSelected.originalObject.fecha_nacimiento;
                    $('#fechaNacimiento').val(formatDate($scope.poliza.asegurado.fecha_nacimiento));
                    $scope.poliza.asegurado.genero_cliente = objectSelected.originalObject.genero_cliente;
                    //$scope.poliza.asegurado.tipo_cliente_id = objectSelected.originalObject.tipo_cliente_id;
                }
            }

            /**
             * Busca clientes en el servidor por las iniciales de su numero de documento
             * @param documentId
             * @returns {*|Promise}
             */
            $scope.findClientsByDocument = function (documentId) {
                return ClientServices.getClientByDocument(documentId).then(function (result) {
                    if (result.JcrResponse.code === GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {
                        $scope.clientFound = [];
                        var array = result.JcrResponse.object;
                        array.forEach(function (entry) {
                            var aux = {
                                cliente_id: entry.cliente_id,
                                nombre_cliente: entry.nombre_cliente,
                                apellido_cliente: entry.apellido_cliente,
                                documento_id_cliente: entry.documento_id_cliente,
                                nombre_completo: entry.nombre_cliente + ' ' + entry.apellido_cliente,
                                fecha_nacimiento: entry.fecha_nacimiento,
                                correo_cliente: entry.correo_cliente,
                                direccion: entry.direccion,
                                tipo_cliente_id: entry.tipo_cliente_id,
                                genero_cliente: entry.genero_cliente
                            };
                            $scope.clientFound.push(aux);
                        });
                    } else {
                        $scope.clientFound = [];
                    }
                    return $scope.clientFound;
                })
            };

            /**
             * Manejador de limpieza de campos cuando se borre el contenido del numero de documento del asegurado
             *
             * @param value (Valor del campo numero de documento)
             */
            $scope.onChangeValueFromAseguradoDocument = function (value) {
                if (value == '') {
                    $scope.poliza.asegurado = {
                        "cliente_id": "",
                        "nombre_cliente": "",
                        "apellido_cliente": "",
                        "documento_id_cliente": "",
                        "fecha_nacimiento": "",
                        "genero_cliente": "",
                        telefono: "",
                        "correo_cliente": "",
                        "direccion": "",
                        "tipo_cliente_id": "",
                        "es_tomador": false
                    }
                }else{
                    $scope.poliza.asegurado.documento_id_cliente = value;
                }
            }

            /**
             * Manejador de limpieza de campos cuando se borre el contenido del numero de documento del tomador
             *
             * @param value (Valor del campo numero de documento)
             */
            $scope.onChangeValueFromTomadorDocument = function (value) {
                if (value == '') {
                    $scope.poliza.tomador = {
                        "cliente_id": "",
                        "nombre_cliente": "",
                        "apellido_cliente": "",
                        "documento_id_cliente": "",
                        "tipo_cliente_id": ""
                    }
                }else{
                    $scope.poliza.tomador.documento_id_cliente = value;
                }
            }

            /**
             * Salva la poliza en el servidor
             *
             *  Se envia el objeto poliza que es tratado como objeto general de toda la vista y controlador
             *
             */
            $scope.saveThePolicy = function () {
                spinnerService.show("spinnerNew");

                if($scope.poliza.ramo.ramo_id == GLOBAL_CONSTANT.RAMO_AUTO_INDIVIDUAL ||
                    $scope.poliza.ramo.ramo_id == GLOBAL_CONSTANT.RAMO_AUTO_FLOTA){
                    buildVehiculoPoliza();
                }

                var request = {
                    JcrParameters: {
                        Poliza: $scope.poliza
                    }
                };

                console.log(request);
                spinnerService.hide("spinnerNew");
                //validar request antes de mandar peticion
                PolizaService.newPoliza(request).then(function (resp) {
                    if (resp.JcrResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {
                        //modo edicion
                        if (PolizaService.getModeEdit().isModeEdit) {
                            PolizaService.setShowGrowlMessage({
                                isShow: true,
                                message: GLOBAL_MESSAGE.MESSAGE_SAVE_POLIZA_SUCCCESS
                            });
                            $state.go("verPolizas");
                        }
                        else {
                            $confirm({text: 'Desea crear una nueva poliza en sistema', ok: 'Si', cancel: 'No'})
                                .then(function () {
                                    cleanFields();
                                })
                                .catch(function () {
                                    PolizaService.setShowGrowlMessage({
                                        isShow: true,
                                        message: GLOBAL_MESSAGE.MESSAGE_SAVE_POLIZA_SUCCCESS
                                    });
                                    $state.go("verPolizas");
                                });
                        }
                    }
                    else {
                        console.log("Error: " + resp.JcrResponse.message);
                        growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                    }
                    spinnerService.hide("spinnerNew");
                }).catch(function (err) {
                    spinnerService.hide("spinnerNew");
                    console.log("Error: " + err);
                });
            }



            /**
             * Open calendar
             */
            $scope.open1 = function () {
                $scope.popup1.opened = true;
            };
            $scope.open2 = function () {
                $scope.popup2.opened = true;
            };

            $scope.popup1 = {
                opened: false
            };

            $scope.popup2 = {
                opened: false
            };

            $scope.openModalAseguradora = function () {
                openModalAddAseguradora();
            }


            $scope.openModalVehiculos = function(){
                openModalAddVehiculos();
            }

            /**
             * agregando vehiculos a el request de la poliza
             */
            function buildVehiculoPoliza(){

                var vehiculo = null;

                $scope.poliza.vehiculo=[];

                $scope.listVehiculosPoliza.forEach(function(entry){
                    vehiculo = {};
                    vehiculo.vehiculo_id = entry.vehiculo_id;
                    vehiculo.vehiculo_placa = entry.vehiculo_placa;
                    vehiculo.vehiculo_marca_id = entry.marca_vehiculo.marca_vehiculo_id;
                    vehiculo.vehiculo_modelo = entry.vehiculo_modelo;
                    vehiculo.vehiculo_ano = entry.vehiculo_ano;
                    vehiculo.vehiculo_version = entry.vehiculo_version;
                    $scope.poliza.vehiculo.push(vehiculo);
                });


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
                                $scope.poliza.aseguradora_id = entry.aseguradora_id;
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


            function openModalAddVehiculos(){

                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'addVehiculosModal.html',
                    controller: 'NewVehiculoModalCtrl',
                    size: 'lg',
                    resolve: {}
                });

                //resultado de lo selecionado en el modal
                modalInstance.result.then(function (selectedItem) {

                    console.log(selectedItem);

                    if($scope.poliza.ramo.ramo_id == GLOBAL_CONSTANT.RAMO_AUTO_INDIVIDUAL){

                       if($scope.listVehiculosPoliza.length == 0){

                           $scope.listVehiculosPoliza.push(selectedItem);
                           $scope.showTableVehiculos = true;
                       }
                       else{
                           growl.warning("Solo puede agregar mas de un vehiculo para una poliza Auto Individual");
                       }

                    }
                    else if($scope.poliza.ramo.ramo_id == GLOBAL_CONSTANT.RAMO_AUTO_FLOTA){

                        $scope.listVehiculosPoliza.push(selectedItem);
                        $scope.showTableVehiculos = true;
                    }else{
                        console.log("No es un ramo valido");
                    }

                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });

            }

            /**
             * Borrar vehiculo selecionado
             * @param vehiculo_placa
             */
            $scope.deleteVehiculoSelect = function(vehiculo_placa){

                var index = -1;
                for (var i = 0, len = $scope.listVehiculosPoliza.length; i < len; i++) {
                    if ($scope.listVehiculosPoliza[i].vehiculo_placa === vehiculo_placa) {
                        index = i;
                        break;
                    }
                }

                $scope.listVehiculosPoliza.splice(index, 1);


                if ($scope.listVehiculosPoliza.length == 0) {
                    $scope.showTableVehiculos = false;
                }

            }


            /**
             * Borarr lista seleccionada de aseguradoras
             * @param aseguradora_id
             */
            $scope.deleteAseguradoraSelect = function(aseguradora_id){

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
             * Metodo para buscar vehiculo por numero de placa
             */
            $scope.seachVehiculoByPlaca = function(){

                if(!isEmptyString($scope.selectPlaca) && $scope.selectPlaca != null){

                    var request={
                        JcrParameters:{
                            Vehiculo:{
                                filter: $scope.selectPlaca
                            }
                        }
                    };

                    if($scope.poliza.ramo.ramo_id == GLOBAL_CONSTANT.RAMO_AUTO_INDIVIDUAL){

                        if($scope.listVehiculosPoliza.length == 0){
                            spinnerService.show("spinnerNew");

                            VehiculoService.getVehiculosByPlaca(request)
                                .then(function(resp){
                                    spinnerService.hide("spinnerNew");

                                    if(resp.JcrResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){

                                        var vehiculo = resp.JcrResponse.object[0];
                                        $scope.listVehiculosPoliza.push(vehiculo);
                                        $scope.showTableVehiculos = true;

                                    }else{
                                        growl.warning("Vehiculo no se encuentra en el sistema si lo desea puede agregar un nuevo vehiculo");
                                    }
                                })
                                .catch(function(err){
                                    spinnerService.hide("spinnerNew");
                                    console.error("Error invocando servicio: "+err);
                                });
                        }else{
                            growl.warning("Solo puede agregar mas de un vehiculo para una poliza Auto Individual");
                        }


                    }else if($scope.poliza.ramo.ramo_id == GLOBAL_CONSTANT.RAMO_AUTO_FLOTA){

                        spinnerService.show("spinnerNew");

                        VehiculoService.getVehiculosByPlaca(request)
                            .then(function(resp){
                                spinnerService.hide("spinnerNew");

                                if(resp.JcrResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){

                                    var vehiculo = resp.JcrResponse.object[0];
                                    $scope.listVehiculosPoliza.push(vehiculo);
                                    $scope.showTableVehiculos = true;

                                }else{
                                    growl.warning("Vehiculo no se encuentra en el sistema si lo desea puede agregar un nuevo vehiculo");
                                }
                            })
                            .catch(function(err){
                                spinnerService.hide("spinnerNew");
                                console.error("Error invocando servicio: "+err);
                            });
                    }

                }
                else{
                    spinnerService.hide("spinnerNew");
                    growl.warning("Seleccione un numero de placa para continuar con la buscada");
                }

            }

            function cleanFields() {
                $scope.aseguradoraListFinal = [];
                $scope.showTableAseguradora = false;
                $scope.poliza = {
                    poliza_id: "",
                    numero_poliza: "",
                    ramo: null,
                    aseguradora_id: "",
                    numero_recibo: "",
                    vigencia_desde: "",
                    vigencia_hasta: "",
                    referencia: "",
                    prima_total: "",
                    agente: "",
                    agente_helper: "",
                    asegurado: {
                        "cliente_id": "",
                        "nombre_cliente": "",
                        "apellido_cliente": "",
                        "documento_id_cliente": "",
                        "fecha_nacimiento": "",
                        "genero_cliente": "",
                        telefono: "",
                        "correo_cliente": "",
                        "direccion": "",
                        "tipo_cliente_id": "",
                        "es_tomador": false
                    },
                    tomador: {
                        "cliente_id": "",
                        "nombre_cliente": "",
                        "apellido_cliente": "",
                        "documento_id_cliente": "",
                        "tipo_cliente_id": "",
                    }
                }

                clearInput('autocompleteClient');
                clearInput('autocompleteTomador');

            }


            var clearInput = function (id) {
                if (id) {
                    $scope.$broadcast('angucomplete-alt:clearInput', id);
                }
                else {
                    $scope.$broadcast('angucomplete-alt:clearInput');
                }
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

    // controlador comportamiento del model
    .controller('NewVehiculoModalCtrl', ['$scope', '$state', '$sessionStorage', '$uibModalInstance','VehiculoService','GLOBAL_CONSTANT',
        function ($scope, $state, $sessionStorage, $uibModalInstance,VehiculoService,GLOBAL_CONSTANT) {

            $scope.selectMarca = null;

            $scope.vehiculo = {
                vehiculo_id:null,
                vehiculo_placa:"",
                marca_vehiculo:{},
                vehiculo_modelo:"",
                vehiculo_ano:"",
                vehiculo_version:""
            }

            /**
             * busca marcas de automovil
             * @param filter
             * @returns {*}
             */
            $scope.searchMarcasVehiculosInTheSystem = function (filter) {

                var request={
                    JcrParameters:{
                        Marca:{
                            filter:filter
                        }
                    }
                };


                return VehiculoService.getMarcasVehiculos(request)
                    .then(function (resp) {
                        if (resp.JcrResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {
                            $scope.marcasFilter = [];
                            var array = resp.JcrResponse.object;
                            array.forEach(function (entry) {
                                var aux = {
                                    marca_vehiculo_id: entry.marca_vehiculo_id,
                                    marca_vehiculo_descripcion: entry.marca_vehiculo_descripcion
                                }
                                $scope.marcasFilter.push(aux);
                            });
                        } else {
                            $scope.marcasFilter = [];
                            console.info(resp.JcrResponse.message);
                        }
                        return $scope.marcasFilter;
                    }).catch(function (err) {
                        console.error("Error: " + err);
                    });
            };


            $scope.selectMarca = function (str) {
                if (str != undefined && str != null) {
                    $scope.vehiculo.marca_vehiculo.marca_vehiculo_id = str.originalObject.marca_vehiculo_id;
                    $scope.vehiculo.marca_vehiculo.marca_vehiculo_descripcion = str.originalObject.marca_vehiculo_descripcion;
                }
            }


            $scope.processVehiculo = function () {
                $uibModalInstance.close($scope.vehiculo);
            };

        }]);