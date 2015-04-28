var md5 = require('MD5');
var xmlrpc = require('xmlrpc');
var macaddress = require('macaddress');
var async = require('async');
var nconf = require('nconf');

// Login credentials
nconf.file({file: './config.json'});
nconf.defaults({
  "login_uri": "http://127.0.0.1:8002", // Default login_uri for a local OpenSimulator grid 
  "start": "last" // Can also be "home" or "uri:<region>&<x-coord>&<y-coord>&<z-coord>"
});

// Login parameters documentation: http://opensimulator.org/wiki/SimulatorLoginProtocol
function get_login_parameters (first_name, last_name, passwd, mac_address) {
    return {
        "first": first_name,
        "last": last_name,
        "passwd": '$1$' + md5(passwd),
        "mac": mac_address,
        "start" : nconf.get('start'),
        "version": "0.0.0",
        "channel": "node-openmv-bots",
        "platform": "Win",
        "id0": "00000000-0000-0000-0000-000000000000",
        "skipoptional": "true",
        "last_exec_event": 0,
        "options": []
    };
}

function login() {
    var xmlrpc_client = xmlrpc.createClient(nconf.get('login_uri'));
    var first, last;

    async.auto({
        get_mac_address: function getMacAddress(callback) {
            macaddress.one(function(err, m) {
                callback(err, m);
            });
        },

        login_parameters: ['get_mac_address', function loginParameters(callback, results) {
            var mac = results.get_mac_address;
            var first = nconf.get('credentials:first_name');
            var last = nconf.get('credentials:last_name');
            var pw = nconf.get('credentials:passwd');
            
            callback(null, get_login_parameters(first, last, pw, mac));
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
        }

        var first = results.client_login.first_name;
        var last = results.client_login.last_name;
        var agent_id = results.client_login.agent_id;

        console.log('Login successful for ' + first + ' ' + last + 
            ' (Agent ' + agent_id + ') on ' + nconf.get('login_uri'));
        return results.client_login;
    });
}

login();
