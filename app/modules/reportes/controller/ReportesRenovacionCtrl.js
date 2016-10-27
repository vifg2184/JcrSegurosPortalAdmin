/**
 * Created by VladimirIlich on 7/10/2016.
 */

angular.module("App")
    .controller("ReporteRenovacionesInfoCtrl", ['$scope',
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


            $scope.totalPages = 0;

            //default criteria that will be sent to the server
            $scope.filterCriteria = {
                JcrParameters: {
                    Reports:{
                        page: 1,
                        limit: 10,
                        start_date:"",
                        end_date:"",
                        aseguradora_id:null
                    }
                }
            };

            //Search on the menu
            $scope.menuOptions = {searchWord: ''};

            $scope.totalItems = 0;
            $scope.currentPage = 1;
            $scope.pageSize = 10;

            $scope.report = {
                start_date: "",
                end_date: "",
                aseguradora_id: null
            }

            $scope.showTableDevicesInfo = false;

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

                console.info("Iniciando controlador DeviceRelRouteCtrl");
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
            $scope.searchRenovacionesInfo = function(){

                $scope.filterCriteria.JcrParameters.Reports.start_date = formatDateAttendance($scope.report.start_date) + " 00:00:00";
                $scope.filterCriteria.JcrParameters.Reports.end_date = formatDateAttendance($scope.report.end_date) + " 23:59:59";
                $scope.filterCriteria.JcrParameters.Reports.aseguradora_id = $scope.report.aseguradora_id;

                $scope.getAllRenovaciones();
            }



            $scope.getAllRenovaciones = function(){

                spinnerService.show("spinnerUserList");

                ReportesServices.getInfoRenovaciones($scope.filterCriteria).then(function(resp){

                    spinnerService.hide("spinnerUserList");

                    if(resp.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){

                        $scope.listDeviceDetailsInfo = [];
                        $scope.totalPages = resp.totalPages;
                        $scope.totalRecords = resp.totalRecords;
                        console.log(resp);

                        var renovacion = null;

                        resp.renovaciones.forEach(function(entry){

                            renovacion = {};

                            renovacion.poliza_id = entry.poliza_id;
                            renovacion.numero_poliza = entry.numero_poliza;
                            renovacion.nombre_cliente = entry.asegurado.nombre_cliente;
                            renovacion.apellido_cliente = entry.asegurado.apellido_cliente;
                            renovacion.documento_id_cliente = entry.asegurado.documento_id_cliente;
                            renovacion.agente = entry.agente;

                            if(entry.ramo.ramo_id == 4 || entry.ramo.ramo_id == 3){
                                renovacion.placa = entry.vehiculos[0].vehiculo_placa;
                            }else{
                                renovacion.placa="N/A";
                            }

                            renovacion.prima_total = entry.prima_total;
                            renovacion.fecha_vencimiento = entry.fecha_vencimiento;
                            renovacion.ramo_name = entry.ramo.ramo_nombre;
                            renovacion.suma_aseguarada = entry.suma_asegurada[0].descripciones_cobertura[0].monto;
                            renovacion.aseguradora = entry.aseguradora;
                            $scope.listDeviceDetailsInfo.push(renovacion);

                        });

                        $scope.showTableDevicesInfo = true;
                    }
                    else{
                        console.log("Error repuesta servicio: "+resp.message);
                        growl.error(resp.message);
                    }

                }).catch(function(err){
                    console.error("Error a invocar servicio: "+err);
                    spinnerService.hide("spinnerUserList");
                    growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                });

            }

            //called when navigate to another page in the pagination
            $scope.selectPage = function () {
                $scope.getAllRenovaciones();
            };

            /**
             * invocar servicio para crear reportes
             */
            $scope.exportPdfReport = function(){

                spinnerService.show("spinnerUserList");

                var request = {
                    JcrParameters:{
                        Reports:{
                            start_date: formatDateAttendance($scope.report.start_date),
                            end_date: formatDateAttendance($scope.report.end_date),
                            aseguradora_id:$scope.report.aseguradora_id
                        }
                    }
                };


                ReportesServices.getCreateReporteRenovaciones(request)
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

            /**
             * invocar servicio para crear notificaciones
             */
            $scope.sendNotificationEmail = function(){

                spinnerService.show("spinnerUserList");

                var request = {
                    JcrParameters:{
                        Reports:{
                            start_date: formatDateAttendance($scope.report.start_date),
                            end_date: formatDateAttendance($scope.report.end_date),
                            aseguradora_id:$scope.report.aseguradora_id
                        }
                    }
                };


                ReportesServices.enviarReportesRenovacion(request)
                    .then(function(resp){

                        spinnerService.hide("spinnerUserList");

                        if(resp.JcrResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){
                            growl.success("Correos de notificacion enviados correctamente.");
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
