/**
 * Created by Eduardo Luttinger on 05/04/2016.
 */
angular.module('App')

    .factory('UserLookup',['$http','$q','CONST_PROXY_URL',function ($http, $q, CONST_PROXY_URL) {

        var lookup = {};
        var userIdFound = 0;
        var userData = {};
        var userJson = {
            users: {},
            totalPages: 0,
            totalRecords: 0
        };


        /**
         *
         * @returns {IPromise<TResult>|*}
         */
        lookup.allUsers = function (filterCriteria) {

            var defered = $q.defer();
            var promise = defered.promise;


            $http({
                method: 'POST',
                data: JSON.stringify(filterCriteria),
                url: CONST_PROXY_URL.PROXY_URL_ALL_USER_WITH_PAGINATE,
            }).success(function (response) {
                userJson.users = response.JcrResponse.object;
                userJson.totalPages = response.JcrResponse.totalPages;
                userJson.totalRecords = response.JcrResponse.totalRecords;
                defered.resolve(userJson);
            }).error(function (err) {
                defered.reject(err);
            })

            return promise;
        };




        /**
         * search a user by his ID
         */
        lookup.userById = function (userId) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify({JcrParameters: {User: {user_id: userId}}}),
                url: CONST_PROXY_URL.PROXY_URL_USER_BY_ID,
            }).success(function (response) {
                //userIdFound = jsonObj[0].user_id;
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            })

            return promise;
        };

        /**
         * Get User with filter
         * @param filters
         * @returns {*}
         */
        lookup.allUserWithFilter = function (filters) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: CONST_PROXY_URL.PROXY_URL_ALL_USER_WITH_FILTER,
                data: JSON.stringify(filters),
                headers: {'Content-Type': 'application/json;charset=UTF-8'}
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        };



        /**
         * get User Types
         * @returns {*}
         */
        lookup.allUsersType = function () {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'GET',
                url: CONST_PROXY_URL.PROXY_URL_ALL_USERS_TYPE
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }




        /**
         * create new user
         * @param obj
         * @returns {*}
         */
        lookup.newUser = function (obj) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: CONST_PROXY_URL.PROXY_URL_CREATE_NEW_USER,
                data: JSON.stringify(obj),
                headers: {'Content-Type': 'application/json;charset=UTF-8'}
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }





        /**
         * Delete User
         * @param id_user
         * @returns {d.promise|*|promise}
         */
        lookup.deleteUser = function(id_user){

            var defered = $q.defer();
            var promise = defered.promise;


            $http({
                method: 'POST',
                url: CONST_PROXY_URL.PROXY_URL_DELETE_USER,
                data: JSON.stringify({ReaxiumParameters:{Users:{user_id:id_user}}}),
                headers: {'Content-Type': 'application/json;charset=UTF-8'}
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }


        return lookup;

    }])

    .service('UserService',['UserLookup',function (UserLookup) {

        var objModeEdit = {
            isModeEdit: false,
            idUser: 0
        };


        var showGrowl = {
            isShow: false,
            message: ""
        };

        var objUserById = {};

        this.cleanGrowl = function(){
            this.setShowGrowlMessage({isShow:false,message:""});
        }

        this.cleanModeEdit = function(){
            this.setModeEdit({isModeEdit:false,idUser:0});
        }

        this.getObjUserById = function () {
            return objUserById;
        }

        this.setObjUserById = function (obj) {
            objUserById = obj;
        }


        this.getModeEdit = function () {
            return objModeEdit;
        };
        this.setModeEdit = function (mode) {
            objModeEdit = mode;
        };

        this.getUsers = function (filter) {
            return UserLookup.allUsers(filter);
        };

        this.getUsersById = function (userId) {
            return UserLookup.userById(userId);
        };

        this.getUserIdFound = function () {
            return UserLookup.getUserIdFound();
        };

        this.getUsersFilter = function (filters) {
            return UserLookup.allUserWithFilter(filters);
        };


        this.getAllUsersType = function () {
            return UserLookup.allUsersType();
        };



        this.createNewUser = function (objNewUser) {
            return UserLookup.newUser(objNewUser);
        }



        this.getShowGrowlMessage = function () {
            return showGrowl;
        }

        this.setShowGrowlMessage = function (obj) {
            showGrowl = obj;
        }



        this.deleteUser = function(id_user){
            return UserLookup.deleteUser(id_user);
        }



    }]);