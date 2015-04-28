var md5 = require('MD5');
var xmlrpc = require('xmlrpc');
var macaddress = require('macaddress');
var async = require('async');

exports = module.exports = function login(options) {
    return new Login(options);
};

function Login(options) {
    var self = this;

    this.first_name = options.first_name || '';
    this.last_name = options.last_name || '';
    this.passwd = options.passwd || '';
    this.login_uri = options.login_uri || 'http://127.0.0.1:8002';
    this.start = options.start || 'last';
    this.login_response = {};

    // Login parameters documentation: http://opensimulator.org/wiki/SimulatorLoginProtocol
    var login_params = function (mac_address) {
        return {
            "first": self.first_name,
            "last": self.last_name,
            "passwd": '$1$' + md5(self.passwd),
            "mac": mac_address,
            "start" : self.start,
            "version": "0.0.1",
            "channel": "node-openmv-bots",
            "platform": "Win",
            "id0": "00000000-0000-0000-0000-000000000000",
            "skipoptional": "true",
            "last_exec_event": 0,
            "options": []
        };
    };

    var xmlrpc_client = xmlrpc.createClient(this.login_uri);

    async.auto({
        get_mac_address: function getMacAddress(callback) {
            macaddress.one(function(err, m) {
                callback(err, m);
            });
        },

        login_parameters: ['get_mac_address', function loginParameters(callback, results) {
            var mac = results.get_mac_address;
            
            callback(null, login_params(mac));
        }],

        // Response documentation: http://opensimulator.org/wiki/SimulatorLoginProtocol
        client_login: ['login_parameters', function clientLogin(callback, results) {
            xmlrpc_client.methodCall('login_to_simulator', [results.login_parameters], function(error, value) {
                callback(error, value);
            });
        }]
    }, function (err, results) {
        if (err) {
            console.log('Error: ' + err);
            return;
        } else {
            self.login_response = results.client_login;
        }
    });
}
