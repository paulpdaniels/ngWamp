/**
 * Created by Paul on 1/1/2015.
 */
angular.module('Simple', ['ngWamp'])
    .controller('SimpleController', function($wamp){

        var connection = $wamp('ws://localhost:9000');

    });