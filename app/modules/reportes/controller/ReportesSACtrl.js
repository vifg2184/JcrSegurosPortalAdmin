/**
 * Created by VladimirIlich on 7/10/2016.
 */

angular.module("App")
    .controller("ReporteSAInfoCtrl", ['$scope',
        '$state',
        '$sessionStorage',
        '$rootScope',
        'ReportesServices',
        'AseguradoraService',
        'growl',
        'spinnerService',
        '$stateParams',
        '$timeout',
        '$window',
        'GLOBAL_CONSTANT',
        'GLOBAL_MESSAGE',
        'MENU_JCR_SEGUROS_ACTIVE',
        '$controller',
        function ($scope,
                  $state,
                  $sessionStorage,
                  $rootScope,
                  ReportesServices,
                  AseguradoraService,
                  growl,
                  spinnerService,
                  $stateParams,
                  $timeout,
                  $window,
                  GLOBAL_CONSTANT,
                  GLOBAL_MESSAGE,
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

            $scope.totalPages = 0;

            //default criteria that will be sent to the server
            $scope.filterCriteria = {
                JcrParameters: {
                    Reports:{
                        page: 1,
                        limit: 10,
                        start_date:"",
                        end_date:"",
                        aseguradora_id:null,
                        monto:""

                    }
                }
            };


            $scope.report = {
                start_date: "",
                end_date: "",
                aseguaradora_id:null,
                monto:""

            }

            $scope.showTableDevicesInfo = false;
            $scope.selectAseguradora = null;

            $scope.listDeviceDetailsInfo = [];
            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'MM/dd/yyyy', 'shortDate'];
            $scope.format = $scope.formats[2];
            $scope.altInputFormats = ['M!/d!/yyyy'];

            $scope.selectBusiness = null;

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



            $scope.init = function(){

                console.info("Iniciando controlador ReporteSiniestroInfoCtrl");
                $scope.setUserSession(MENU_JCR_SEGUROS_ACTIVE.CODE_REPORTES_MENU);
            }

            $scope.init();

            /**
             * Open calendar
             */
            $scope.open_start_date = function () {
                $scope.popup_start_date.opened = true;
            };

            $scope.popup_start_date = {
                opened: false
            };


            $scope.open_end_date = function () {
                $scope.popup_end_date.opened = true;
            };

            $scope.popup_end_date = {
                opened: false
            };


            /**
             * busca negocios en el sistema de manera filtrada
             * @param filter
             * @returns {*}
             */
            $scope.searchTheAseguradoraInTheSystem = function (filter) {

                var request={JcrParameters:{Aseguradora:{filter:filter}}};

                return AseguradoraService.searchWithFilterAseguradora(request)
                    .then(function (resp) {
                        if (resp.JcrResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {
                            $scope.AseguradoraFilter = [];
                            var array = resp.JcrResponse.object;
                            array.forEach(function (entry) {
                                var aux = {
                                    aseguradora_id: entry.aseguradora_id,
                                    aseguradora_nombre: entry.aseguradora_nombre
                                }
                                $scope.AseguradoraFilter.push(aux);
                            });
                        } else {
                            $scope.AseguradoraFilter = [];
                            console.info(resp.JcrResponse.message);
                        }
                        return $scope.AseguradoraFilter;
                    }).catch(function (err) {
                        console.error("Error: " + err);
                    });
            };


            $scope.selectAseguradora = function (str) {
                if (str != undefined && str != null) {
                    console.log(str);
                    $scope.report.aseguradora_id = str.originalObject.aseguradora_id;
                }
                else{
                    $scope.report.aseguradora_id = null;
                }
            }

            /**
             * Metodo para obtener informacion de los dispositivos
             */
            $scope.searchSAInfo = function(){

                $scope.filterCriteria.JcrParameters.Reports.start_date = formatDateAttendance($scope.report.start_date) + " 00:00:00";
                $scope.filterCriteria.JcrParameters.Reports.end_date = formatDateAttendance($scope.report.end_date) + " 23:59:59";
                $scope.filterCriteria.JcrParameters.Reports.aseguradora_id =  $scope.report.aseguradora_id;
                $scope.filterCriteria.JcrParameters.Reports.monto = $scope.report.monto;

                $scope.getAllSiniestros();

            }



            /**
             * Call service all user
             */
            $scope.getAllSiniestros= function () {

                spinnerService.show("spinnerUserList");

                ReportesServices.getInfoSumaAsegurada($scope.filterCriteria).then(function (resp) {

                    spinnerService.hide("spinnerUserList");

                    if(resp.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){

                        $scope.listDeviceDetailsInfo = [];
                        $scope.totalPages = resp.totalPages;
                        $scope.totalRecords = resp.totalRecords;
                        console.log(resp);

                        var poliza = null;

                        resp.polizas.forEach(function(entry){

                            poliza = {};

                            poliza.poliza_id = entry.poliza_id;
                            poliza.numero_poliza = entry.numero_poliza;
                            poliza.nombre_cliente = entry.asegurado.nombre_cliente;
                            poliza.apellido_cliente = entry.asegurado.apellido_cliente;
                            poliza.documento_id_cliente = entry.asegurado.documento_id_cliente;
                            poliza.agente = entry.agente;

                            if(entry.ramo.ramo_id == 4 || entry.ramo.ramo_id == 3){
                                poliza.placa = entry.vehiculos[0].vehiculo_placa;
                            }
                            else{
                                poliza.placa="N/A";
                            }

                            poliza.prima_total = entry.prima_total;
                            poliza.fecha_vencimiento = entry.fecha_vencimiento;
                            poliza.ramo_name = entry.ramo.ramo_nombre;

                            entry.suma_asegurada.forEach(function(entry){

                                if(entry.descripciones_cobertura[0].monto < $scope.filterCriteria.JcrParameters.Reports.monto){
                                    poliza.suma_aseguarada = entry.descripciones_cobertura[0].monto;
                                }
                            });

                            //poliza.suma_aseguarada = entry.suma_asegurada[0].descripciones_cobertura[0].monto;
                            poliza.aseguradora = entry.aseguradora;
                            $scope.listDeviceDetailsInfo.push(poliza);

                        });

                        $scope.showTableDevicesInfo = true;
                    }
                    else{
                        console.log("Error repuesta servicio: "+resp.message);
                        growl.error(resp.message);
                    }

                }).catch(function (err) {
                    console.error("Error invocando servicio getAllUsers " + err);
                    $scope.listSiniestros = [];
                    $scope.totalPages = 0;
                    $scope.totalRecords = 0;
                    spinnerService.hide("spinnerUserList");
                    growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                });
            }


            //called when navigate to another page in the pagination
            $scope.selectPage = function () {
                $scope.getAllSiniestros();
            };


            /**
             * invocar servicio para crear reportes
             */
            $scope.exportPdfReport = function(){

                spinnerService.show("spinnerUserList");

                var request = {
                    JcrParameters:{
                        Reports:{
                            start_date: $scope.filterCriteria.JcrParameters.Reports.start_date,
                            end_date: $scope.filterCriteria.JcrParameters.Reports.end_date,
                            aseguradora_id: $scope.filterCriteria.JcrParameters.Reports.aseguradora_id,
                            numero_poliza: $scope.filterCriteria.JcrParameters.Reports.numero_poliza,
                            ramo_id: $scope.filterCriteria.JcrParameters.Reports.ramo_id
                        }
                    }
                };


                ReportesServices.getCreateReporteSiniestralidad(request)
                    .then(function(resp){

                        spinnerService.hide("spinnerUserList");

                        if(resp.JcrResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){
                            $window.open(resp.JcrResponse.url_pdf, '_blank', '');
                        }
                        else{
                            console.log("Error invocando el servicio: " + resp.JcrResponse.message);
                            growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                        }

                    }).catch(function(err){
                    console.error("Error a invocar servicio: "+err);
                    spinnerService.hide("spinnerUserList");
                    growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                });



            }

        }]);
