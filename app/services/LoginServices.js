/**
 * Created by VladimirIlich on 5/4/2016 .
 */

angular.module('App')

.factory('LoginLookup',['$http','$log','$q','CONST_PROXY_URL',function($http,$log,$q,CONST_PROXY_URL){

    var lookup = {};

    lookup.sendLogin = function(username,password){

        var defered = $q.defer();
        var promise = defered.promise;

        var data = {
            JcrParameters:{
                SystemAccess:{
                    user_name:username,
                    pass_user:password
                }
            }
        };

        $http({
            method: 'POST',
            data: JSON.stringify(data),
            url: CONST_PROXY_URL.PROXY_URL_LOGIN,
        }).success(function (response) {
            defered.resolve(response);
        }).error(function (err) {
            defered.reject(err);
        });


        return promise;
    }


    lookup.getMenu = function(user_type_id){

        var defered = $q.defer();
        var promise = defered.promise;

        $http({
            method: 'POST',
            data: JSON.stringify({JcrParameters:{SystemMenu:{type_user:user_type_id}}}),
            url: CONST_PROXY_URL.PROXY_URL_MENU_SHOW,
        }).success(function (response) {
            defered.resolve(response);
        }).error(function (err) {
            defered.reject(err);
        });

        return promise;

    }

    return lookup;
}])

.service('loginServices',['LoginLookup',function(LoginLookup){

  this.proxyLogin = function(username,password){
      return LoginLookup.sendLogin(username,password);
  }

  this.menuApplication = function(user_type_id){
      return LoginLookup.getMenu(user_type_id);
  }

}]);