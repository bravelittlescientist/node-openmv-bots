var test = require('tape');
var nconf = require('nconf');
var openmvbots = require('../index');

// Credentials and server configuration
nconf.file({file: './config.json'});
nconf.defaults({
    "login_uri": "http://127.0.0.1:8002", // Default login_uri for a local OpenSimulator grid 
    "start": "last" // Can also be "home" or "uri:<region>&<x-coord>&<y-coord>&<z-coord>"
});

test('test login to running OpenSimulator grid', function(t) {
    var bot;
    var credentials;
    var login_options = {
        "login_uri": nconf.get("login_uri"),
        "start": nconf.get("start")
    };

    t.ok(nconf.get("credentials"), "found OpenSimulator server credentials");
    var credentials = nconf.get("credentials") || {};
    login_options.first_name = credentials.first_name || "";
    login_options.last_name = credentials.last_name || "";
    login_options.passwd = credentials.passwd || "";
    
    bot = openmvbots.login(login_options);
    setTimeout(function() {
        t.ok(bot.login_response.agent_id, 'successful login resulted in agent ID from simulation server');
    }, 1000);

    t.end();
});
