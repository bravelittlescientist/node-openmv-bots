# Open-MV bots

Node.js 3D virtual world client bots inspired by [LibOpenMetaverse](https://github.com/openmetaversefoundation/libopenmetaverse)

# Dependencies

This code relies on a running instance of [OpenSimulator](http://opensimulator.org/). The default configuration assumes a local grid is running.

# Getting Started

    $ npm install openmv-bots

At minimum, this code requires a running instance of OpenSimulator and an existing user account. Update the example config file to contain your credentials.

    $ cp config.json.example config.json

Take a look at config.json

```json
{
  "credentials": {
    "first_name": "first_name",
    "last_name": "last_name",
    "passwd": "moonmoon"
  },
  "login_uri": "127.0.0.1:8002",
  "start": "last"
}
```

Update your login credentials and settings (name, login server, start position). Here is [login protocol documentation](http://opensimulator.org/wiki/SimulatorLoginProtocol).

```json
{
  "credentials": {
    "first_name": "Hermione",
    "last_name": "Granger",
    "passwd": "t1m3turn3r!"
  },
  "login_uri": "127.0.0.1:8002",
  "start": "last"
}
```

Now, run the login script.

    $ node index.js
