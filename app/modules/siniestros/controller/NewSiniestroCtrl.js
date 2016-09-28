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
            $scope.polizaListFinal=[];
            $scope.showTablePoliza=false;

            $scope.setUserSession(MENU_JCR_SEGUROS_ACTIVE.CODE_SINIESTRO_MENU);

            $scope.init = function(){

                console.info("Iniciando controlador NewSiniestroCtrl...");
                console.info("Mode edit: " + $stateParams.edit);
                console.info("Id del usuario: " + $stateParams.id_user);
            }

            $scope.init();


            $scope.choices = [{id:1,fecha:"",pieza:"",observacion:""}];

            $scope.addNewChoice = function(){
                var newItemNo = $scope.choices.length+1;
                $scope.choices.push({id:newItemNo});
                console.log($scope.choices);
            }


            $scope.removeChoice = function() {
                var lastItem = $scope.choices.length-1;
                if(lastItem != 0){
                    $scope.choices.splice(lastItem);
                }
            };

            $scope.open1 = function () {$scope.popup1.opened = true;};
            $scope.popup1 = {opened: false};

            $scope.open2 = function () {$scope.popup2.opened = true;};
            $scope.popup2 = {opened: false};


            $scope.open3 = function () {$scope.popup3.opened = true;};
            $scope.popup3 = {opened: false};

            $scope.open4 = function () {$scope.popup4.opened = true;};
            $scope.popup4 = {opened: false};

            $scope.open5 = function () {$scope.popup5.opened = true;};
            $scope.popup5 = {opened: false};

            $scope.open5 = function () {$scope.popup5.opened = true;};
            $scope.popup5 = {opened: false};

            $scope.openModalPoliza = function(){openModalSearchPoliza();}


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
                }

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

    // controlador comportamiento del model
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