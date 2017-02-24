/*
* @Author: Ali
* @Date:   2017-02-23 22:56:03
* @Last Modified by:   Ali
* @Last Modified time: 2017-02-24 03:50:31
*/
(function(){
    'use strict';
    angular.module('secretSantaApp').controller('secretSantaCtrl', ['$scope', function($scope){
        $scope.santas = 0;
        $scope.lastSanta = "";
        $scope.registerStat = "";
        $scope.gifter = {};
        $scope.getter = {};

        $scope.addGifter = function(){
            $scope.gifter.name = $scope.gifter.name || '';
            $scope.gifter.spouse = $scope.gifter.spouse || '';
            $scope.gifter.email = $scope.gifter.email || '';
            $scope.gifter.pass = $scope.gifter.pass || '';
            if ($scope.gifter.name.length && $scope.gifter.email.length && $scope.gifter.pass.length){
                console.log("addGifter: Good to talk to server");
            }
        };

        $scope.apply = function(){
            console.log("Lock the registration and make matches!");
        };

        $scope.getMatch = function(){
            $scope.getter.email = $scope.getter.email || '';
            $scope.getter.pass = $scope.getter.pass || '';
            if ($scope.getter.email.length && $scope.getter.pass.length){
                console.log("getMatch: Good to talk to server");
            }
        };

    }]);
}());