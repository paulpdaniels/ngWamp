/**
 * Created by Paul on 12/31/2014.
 */

var module = angular.module('ngWamp', []);

module.provider('$wamp', function () {

    var UNKNOWN = 0;

    var connections = {};
    var defaultOpts = {
        reuseConnection: true,
        rootUri: ''
    };

    function detectVersion() {

        if (!autobahn)
            return UNKNOWN;

        return (typeof autobahn.version !== 'function' || (autobahn.version() !== "?.?.?" && !!autobahn.Connection)) ?
            2 : 1;
    }

    autobahn._connection_cls = autobahn.Connection || function (opts) {

        this.uri = typeof opts === 'object' ? opts.url : opts;
        this.isDisposed = false;
        this._session = null;

        this._onopen = function (session) {

            if (this._session)
                this._session.close();

            if (!this.isDisposed && this.onopen)
                this.onopen(session);

        };

        this.open = function () {
            autobahn.connect(this.uri, this._onopen.bind(this), this.onclose, opts);
        };

        this.close = function () {
            this.isDisposed = true;

            if (this._session)
                this._session.close();
        };

        this.onopen = null;
        this.onclose = null;

    };

    this._connection_factory = function(opts) {
        return new autobahn._connection_cls(opts);
    };

    var _globals = this;


    this.$get = ['$q', function ($q) {

        function Connection(opts) {
            this._connection = _globals._connection_factory(opts);
        }

        function Subscription(topic, handler, opts) {
            var deferred = $q.defer();

            this.promise = deferred.promise;
        }

        Subscription.prototype.unsubscribe = function () {
        };

        function Registration(procedure, callback) {
            var deferred = $q.defer();
            this.promise = deferred.promise;
            this.procedure = procedure;
            this.callback  = callback;
        }

        Registration.prototype.unregister = function () {
        };

        var connectionProto = Connection.prototype;

        var subscribe = connectionProto.subscribe = function (topic, handler) {
            return new Subscription(topic, handler).promise;
        };

        var publish = connectionProto.publish = function (topic, eventOrArgs, kwargs, opts) {

        };

        var register = connectionProto.register = function () {
            return new Registration().promise;
        };

        var call = connectionProto.call = function () {


        };

        function findExistingConnection(opts) {
            return connections[opts.url];
        }

        function buildConnection(opts, realm) {

            if (angular.isString(opts)) {
                opts = { url : opts, realm : realm };
            }

            var localOpts = angular.extend({version: detectVersion()}, defaultOpts, opts),
                url = localOpts.url,
                realm = localOpts.realm,
                connection;

            if (!localOpts.reuseConnection || !(connection = findExistingConnection(opts))) {
                connection = new Connection(opts);
            }

            return connection;
        }

        return buildConnection;

    }];

});