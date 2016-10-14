/**
 * Created by VladimirIlich on 21/4/2016.
 */

angular.module("App")

    //Configurando enrutado de la aplicacion
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state("login", {
                url: '/login',
                templateUrl: 'app/login/views/login.html',
                controller: 'loginController'
            })
            .state("logout",{
                url: '/logout',
                controller: 'logoutCtrl'
            })
            .state("forgetPass",{
                url: '/forgetPass',
                templateUrl:'app/login/views/forgetPassword.html',
                controller: 'forgetPassController'
            })

            .state("home", {
                url: '/home',
                controller: 'HomeController',
                views: {
                    '': {templateUrl: 'app/home/views/home.html'},
                    'header@home': {templateUrl: 'app/home/views/header.html'},
                    'menu@home': {templateUrl: 'app/home/views/menu.html'},
                    'footer@home':{templateUrl: 'app/home/views/footer.html'}
                }
            })
            //usuarios navegacion
            .state("verUsuarios",{
                url: '/verUsuarios',
                controller:'UserController',
                views: {
                    '': {templateUrl: 'app/modules/usuarios/views/UserDashboard.html'},
                    'header@verUsuarios': {templateUrl: 'app/home/views/header.html'},
                    'menu@verUsuarios': {templateUrl: 'app/home/views/menu.html'},
                    'footer@verUsuarios':{templateUrl: 'app/home/views/footer.html'}
                }
            })

            .state("crearUsuarios",{
                url: '/crearUsuarios',
                controller:'UserNewCtrl',
                params:{edit:false,id_user: null},
                views: {
                    '': {templateUrl: 'app/modules/usuarios/views/UserNewRegister.html'},
                    'header@crearUsuarios': {templateUrl: 'app/home/views/header.html'},
                    'menu@crearUsuarios': {templateUrl: 'app/home/views/menu.html'},
                    'footer@crearUsuarios':{templateUrl: 'app/home/views/footer.html'}
                }
            })

            //polizas navegacion
            .state('verPolizas',{
                url: '/verPolizas',
                controller:'PolizaController',
                params:{edit:false,poliza_id: null},
                views: {
                    '': {templateUrl: 'app/modules/polizas/views/PolizaDashBoard.html'},
                    'header@verPolizas': {templateUrl: 'app/home/views/header.html'},
                    'menu@verPolizas': {templateUrl: 'app/home/views/menu.html'},
                    'footer@verPolizas':{templateUrl: 'app/home/views/footer.html'}
                }
            })

            .state('crearPoliza',{
                url: '/crearPoliza',
                controller:'NewPolizaCtrl',
                params:{edit:false,poliza_id: null},
                views: {
                    '': {templateUrl: 'app/modules/polizas/views/NewPoliza.html'},
                    'header@crearPoliza': {templateUrl: 'app/home/views/header.html'},
                    'menu@crearPoliza': {templateUrl: 'app/home/views/menu.html'},
                    'footer@crearPoliza':{templateUrl: 'app/home/views/footer.html'}
                }
            })

            //siniestro navegacion
            .state('verSiniestro',{
                url: '/verSiniestro',
                controller:'SiniestroController',
                params:{edit:false,siniestro_id: null},
                views: {
                    '': {templateUrl: 'app/modules/siniestros/views/SiniestroDashBoard.html'},
                    'header@verSiniestro': {templateUrl: 'app/home/views/header.html'},
                    'menu@verSiniestro': {templateUrl: 'app/home/views/menu.html'},
                    'footer@verSiniestro':{templateUrl: 'app/home/views/footer.html'}
                }
            })

        //vehiculos navegacion

            .state('verVehiculos',{
                url: '/verVehiculos',
                controller:'VehiculoController',
                params:{edit:false,vehiculo_id: null},
                views: {
                    '': {templateUrl: 'app/modules/vehiculos/views/VehiculoDashBoard.html'},
                    'header@verVehiculos': {templateUrl: 'app/home/views/header.html'},
                    'menu@verVehiculos': {templateUrl: 'app/home/views/menu.html'},
                    'footer@verVehiculos':{templateUrl: 'app/home/views/footer.html'}
                }
            })

            //aseguradora navegacion

            .state('verAseguradora',{
                url: '/verAseguradora',
                controller:'AseguradoraController',
                params:{edit:false,aseguradora_id: null},
                views: {
                    '': {templateUrl: 'app/modules/aseguradoras/views/AseguradoraDashBoard.html'},
                    'header@verAseguradora': {templateUrl: 'app/home/views/header.html'},
                    'menu@verAseguradora': {templateUrl: 'app/home/views/menu.html'},
                    'footer@verAseguradora':{templateUrl: 'app/home/views/footer.html'}
                }
            })


            //cobertura navegacion

            .state('verCobertura',{
                url: '/verCobertura',
                controller:'CoberturaController',
                params:{edit:false,aseguradora_id: null},
                views: {
                    '': {templateUrl: 'app/modules/coberturas/views/CoberturasDashBoard.html'},
                    'header@verCobertura': {templateUrl: 'app/home/views/header.html'},
                    'menu@verCobertura': {templateUrl: 'app/home/views/menu.html'},
                    'footer@verCobertura':{templateUrl: 'app/home/views/footer.html'}
                }
            })

            //cobertura navegacion

            .state('crearAseguradora',{
                url: '/crearAseguradora',
                controller:'AseguradoraNewCtrl',
                params:{edit:false,aseguradora_id: null},
                views: {
                    '': {templateUrl: 'app/modules/aseguradoras/views/NewAseguradora.html'},
                    'header@crearAseguradora': {templateUrl: 'app/home/views/header.html'},
                    'menu@crearAseguradora': {templateUrl: 'app/home/views/menu.html'},
                    'footer@crearAseguradora':{templateUrl: 'app/home/views/footer.html'}
                }
            })


            .state('crearSiniestro',{
                url: '/crearSiniestro',
                controller:'NewSiniestroCtrl',
                params:{edit:false,siniestro_id: null,tipo_siniestro_id:null},
                views: {
                    '': {templateUrl: 'app/modules/siniestros/views/NewSiniestro.html'},
                    'header@crearSiniestro': {templateUrl: 'app/home/views/header.html'},
                    'menu@crearSiniestro': {templateUrl: 'app/home/views/menu.html'},
                    'footer@crearSiniestro':{templateUrl: 'app/home/views/footer.html'}
                }
            })

            .state('accesoUsuario',{
                url: '/accesoUsuario',
                controller:'SuperUserCtrl',
                views: {
                    '': {templateUrl: 'app/modules/super_user/views/SuperUserAccess.html'},
                    'header@accesoUsuario': {templateUrl: 'app/home/views/header.html'},
                    'menu@accesoUsuario': {templateUrl: 'app/home/views/menu.html'},
                    'footer@accesoUsuario':{templateUrl: 'app/home/views/footer.html'}
                }
            })

            .state('reportRenovacion',{
                url: '/reportRenovacion',
                controller:'ReporteRenovacionesInfoCtrl',
                views: {
                    '': {templateUrl: 'app/modules/reportes/views/ReportesRenovacion.html'},
                    'header@reportRenovacion': {templateUrl: 'app/home/views/header.html'},
                    'menu@reportRenovacion': {templateUrl: 'app/home/views/menu.html'},
                    'footer@reportRenovacion':{templateUrl: 'app/home/views/footer.html'}
                }
            })

        $urlRouterProvider.otherwise("/login");

    }]);
