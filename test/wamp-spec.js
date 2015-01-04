/**
 * Created by Paul on 1/1/2015.
 */
describe('API', function(){

    var module = angular.module('Test', ['ngWamp']);
    module.controller('TestController', function($wamp){
        var connection = $wamp("ws://localhost:9000");

        connection.open().then(function(){

        });
    });

    describe('Build Connection', function(){
        it('should inject wamp into the controller', function(){
        });
    });

});