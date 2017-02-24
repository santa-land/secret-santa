/*
* @Author: Ali
* @Date:   2017-02-24 03:59:26
* @Last Modified by:   Ali
* @Last Modified time: 2017-02-24 07:33:37
*/
(function(){
    'use strict';
    angular.module('secretSantaApp').factory('santa', ['$http', function($http){
        var santa = {};
        santa.post = function(newSanta){
            return $http.post('/register', newSanta);
        };
        santa.getMatch = function(me){
            return $http.post('/myMatch', me);
        };
        return santa;
    }]);
}());
