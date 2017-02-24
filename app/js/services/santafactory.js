/*
* @Author: Ali
* @Date:   2017-02-24 03:59:26
* @Last Modified by:   Ali
* @Last Modified time: 2017-02-24 04:14:12
*/
(function(){
    'use strict';
    angular.module('secretSantaApp').factory('santa', ['$http', function($http){
        var santa = {};
        santa.post = function(newSanta){
            return $http.post('/register', newSanta);
        };
        return santa;
    }]);
}());
