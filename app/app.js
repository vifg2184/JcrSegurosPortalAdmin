/**
 * Created by VladimirIlich G&G on 4/4/2016.
 */
var interval = null;
var environment = 'http://localhost:8080/SeguroJCR/jcrSegurosCloud/';

angular.module('App', ['ui.router',
        'angularSpinners',
        'ngStorage',
        'ngTouch',
        'ngAnimate',
        'angucomplete-alt',
        'ui.bootstrap',
        'angular-growl',
        'angular-confirm'])



    //Aqui lo primero que se ejecuta en angular como el document Ready en jquery
    .run(['$templateCache', '$rootScope', '$interval', function ($templateCache, $rootScope, $interval) {


        $templateCache.put('sort-by.html', '<a ng-click="sort(sortvalue)"><span ng-transclude=""></span><span ng-show="sortedby == sortvalue">&nbsp;&nbsp;<i ng-class="{true: \'fa fa-sort-up\', false: \'fa fa-sort-desc\'}[sortdir == \'asc\']"></i></span></a>');

        $rootScope.welcomePage = 'app/home/views/content.html';

        //controllar el intervalo del proceso del tracking
        $rootScope.$on('$stateChangeStart', function () {
            $interval.cancel(interval);
        });

    }])


    //Configurando componentes
    .config(['growlProvider',
        function (growlProvider) {
            growlProvider.globalTimeToLive(5000);

        }])

