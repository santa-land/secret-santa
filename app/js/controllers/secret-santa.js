/*
* @Author: Ali
* @Date:   2017-02-23 22:56:03
* @Last Modified by:   Ali
* @Last Modified time: 2017-02-25 13:14:37
*/
(function(){
    'use strict';
    angular.module('secretSantaApp').controller('secretSantaCtrl', ['$scope', 'santa', function($scope, santa){

        function init(){
            $scope.santas = 0;
            $scope.lastSanta = "N/A";
            $scope.match = "N/A";
            $scope.passAlert = false;
            $scope.admin = {};
            $scope.santa = {};
            $scope.getter = {};
            $scope.terminate = false;
            santa.lastSanta().then(function(response){
                var lastSanta = "N/A";
                if (response.data.length !== 0 ) { 
                    var last = response.data[0].name;
                    lastSanta = last.charAt(0).toUpperCase() + last.substr(1).toLowerCase();
                }
                $scope.lastSanta = "" || lastSanta;
            });
            santa.count().then(function(response){
                $scope.santas = response.data;
            });
        }
        init();

        $scope.addSanta = function(){
            $scope.santa.name = $scope.santa.name || '';
            $scope.santa.spouse = $scope.santa.spouse || '';
            if ($scope.santa.name.length !==0){
                // console.log("addSanta: Good to talk to server");
                santa.post($scope.santa).then(function(response){
                    // console.log('New Santa is added');
                });
            }
            init();
        };

        $scope.makeMatch = function(){
            $scope.admin.email = $scope.admin.email || '';
            $scope.admin.pass = $scope.admin.pass || '';
            santa.matchMaker($scope.admin).then(function(response){
                $scope.passAlert = false;
                $scope.terminate = true;
            },function(error){
                console.log('Error from server: %s', error.data);
                $scope.passAlert = true;
            });
        };

        $scope.deleteRenew = function(){
            $scope.admin.email = $scope.admin.email || '';
            $scope.admin.pass = $scope.admin.pass || '';
            santa.removeFamily($scope.admin).then(function(response){
                $scope.terminate = false;
                $scope.passAlert = false;
                init();
            }, function(error){
                console.log('Error from server: %s', error.data);
                $scope.passAlert = true;
            });
        };

        $scope.getMatch = function(){
            $scope.gifter.name = $scope.gifter.name || '';
            if ($scope.gifter.name.length !==0){
                santa.getMatch($scope.gifter).then(function(response){
                    if (response.data) {
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