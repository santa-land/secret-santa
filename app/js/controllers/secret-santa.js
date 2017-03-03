/*
* @Author: Ali
* @Date:   2017-02-23 22:56:03
* @Last Modified by:   Ali
* @Last Modified time: 2017-03-03 09:44:39
*/
(function(){

    /**
     * secretSantaCtrl Controller that get info from santa factory.
     *
     * @function secretSantaCtrl
     * @param {Object}  $scope    provided by  AngularJs 
     * @param {Object}  santa     injected factory written by me.
     */
    'use strict';
    angular.module('secretSantaApp').controller('secretSantaCtrl', ['$scope', 'santa', function($scope, santa){

    /**
     * It used for initialization of app at the begining and after each change.
     *
     * @function init
     */
        function init(){
            $scope.santas = 0;
            $scope.lastSanta = "N/A";
            $scope.match = "N/A";
            $scope.passAlert = false;
            $scope.duplicatedAlert = false;
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

        /**
         * Adds new Santa, and send it server and mongoDB. It is connected to the SIGNUP BUTTOM
         *
         * @function addSanta
         */
        $scope.addSanta = function(){
            /** Name for Santa which is assumed to be unique 
            * @default "" 
            * @type {string}
            */
            $scope.santa.name = $scope.santa.name || '';
            /** @default "" */
            $scope.santa.spouse = $scope.santa.spouse || '';
            if ($scope.santa.name.length !==0){
                console.log("addSanta: Good to talk to server");
                santa.post($scope.santa).then(function(response){
                    console.log('New Santa is added');
                    init();
                }, function(error){
                    console.log('Error from server: %s', error.data);
                    $scope.duplicatedAlert = true;
                });
            }

        };

        /**
         * If admin enter right email/password the he/she can terminate this round of giftitng. It is connected to the TERMINATE &MAKE MATCHES
         * email is admin@smith.com
         * password is 123
         * @function makeMatch
         */
        $scope.makeMatch = function(){
            /** @default "" */
            $scope.admin.email = $scope.admin.email || '';
            /** @default "" */
            $scope.admin.pass = $scope.admin.pass || '';
            santa.matchMaker($scope.admin).then(function(response){
                $scope.passAlert = false;
                $scope.terminate = true;
            },function(error){
                console.log('Error from server: %s', error.data);
                $scope.passAlert = true;
            });
        };

        /**
         * If admin enter right email/password the he/she can DELETE this round of giftitng. It is connected to the DELETE & RENEW button
         * email is admin@smith.com
         * password is 123
         *
         * @function deleteRenew
         */
        $scope.deleteRenew = function(){
            /** @default "" */
            $scope.admin.email = $scope.admin.email || '';
            /** @default "" */
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

        /**
         * Shows the Santa his/her match to buy gift 
         * 
         * @function getMatch
         */
        $scope.getMatch = function(){
            /** @default "" */
            $scope.gifter.name = $scope.gifter.name || '';
            if ($scope.gifter.name.length !==0){
                santa.getMatch($scope.gifter).then(function(response){
                    if (response.data) {
                        if (response.data.match.length !==0){
                            $scope.match = response.data.match.charAt(0).toUpperCase() + response.data.match.substr(1).toLowerCase();
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