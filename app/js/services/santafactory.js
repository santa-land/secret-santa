/*
* @Author: Ali
* @Date:   2017-02-24 03:59:26
* @Last Modified by:   Ali
* @Last Modified time: 2017-02-25 12:10:11
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

        santa.lastSanta = function(){
            return $http.get('/lastsanta');
        };

        santa.count = function(){
            return $http.get('/countsanta');
        };

        santa.matchMaker = function(admin){
            return $http.post('/makeMatch', admin);
        };

        santa.removeFamily = function(admin){
            return $http.delete('/deletefamily', admin);
        };

        return santa;
    }]);
}());
