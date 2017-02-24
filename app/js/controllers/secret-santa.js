/*
* @Author: Ali
* @Date:   2017-02-23 22:56:03
* @Last Modified by:   Ali
* @Last Modified time: 2017-02-24 12:35:32
*/
(function(){
    'use strict';
    angular.module('secretSantaApp').controller('secretSantaCtrl', ['$scope', 'santa', function($scope, santa){

        function init(){
            $scope.santas = 0;
            $scope.lastSanta = "";
            $scope.registerStat = "";
            $scope.match = "N/A";
            $scope.matchalert = false;
            $scope.gifter = {};
            $scope.getter = {};
            santa.lastSanta().then(function(response){
                var last = response.data[0].name;
                var lastSanta = last.charAt(0).toUpperCase() + last.substr(1).toLowerCase();
                $scope.lastSanta = "" || lastSanta;
            });
            santa.count().then(function(response){
                $scope.santas = response.data;
            });
        }
        init();

        $scope.addGifter = function(){
            $scope.gifter.name = $scope.gifter.name || '';
            $scope.gifter.spouse = $scope.gifter.spouse || '';
            $scope.gifter.email = $scope.gifter.email || '';
            $scope.gifter.pass = $scope.gifter.pass || '';
            if ($scope.gifter.name.length !==0 && $scope.gifter.email.length !==0 && $scope.gifter.pass.length !==0){
                console.log("addGifter: Good to talk to server");
                santa.post($scope.gifter).then(function(response){
                    console.log('New Santa is added');
                });
            }
        };

        $scope.apply = function(){
            console.log("Lock the registration and make matches!");
        };

        $scope.getMatch = function(){
            $scope.getter.email = $scope.getter.email || '';
            $scope.getter.pass = $scope.getter.pass || '';
            if ($scope.getter.email.length !==0 && $scope.getter.pass.length !==0){
                console.log("getMatch: Good to talk to server");
                santa.getMatch($scope.getter).then(function(response){
                    if (response.data) {
                        console.log('Your match is ...');
                        if (response.data.match.length !==0){
                            $scope.match = response.data.match;
                            $scope.matchalert = false;
                        }else{
                            $scope.match = "N/A";
                            $scope.matchalert = false;
                        }
                    }else{
                        $scope.matchalert = true;
                    }
                });
            }
        };

    }]);
}());