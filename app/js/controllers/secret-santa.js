/*
* @Author: Ali
* @Date:   2017-02-23 22:56:03
* @Last Modified by:   Ali
* @Last Modified time: 2017-02-24 01:44:54
*/
(function(){
    'use strict';
    angular.module('secretSantaApp').controller('secretSantaCtrl', ['$scope', function($scope){
        $scope.santas = 0;
        $scope.lastSanta = "";
        $scope.registerStat = "";

        $scope.addGifter = function(){
            console.log($scope.gifter);
        };

        $scope.apply = function(){
            console.log("Lock the registration and make matches!");
        };

        $scope.getMatch = function(){
            console.log($scope.getter);
        };

    }]);
}());