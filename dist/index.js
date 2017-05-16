'use strict';

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _twitter = require('twitter');

var _twitter2 = _interopRequireDefault(_twitter);

var _opn = require('opn');

var _opn2 = _interopRequireDefault(_opn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CONSUMER_KEY = 'p5qURsUwMRxOw4AiN3yMkSuwg';
var SECRET = 'uVWQhRBl3cqsgJsoBpblKpG6kfgeUffFInanfGEoRpQybx2Bcx';
var REQUEST_TOKEN = "https://api.twitter.com/oauth/request_token";
var AUTHORIZE = "https://api.twitter.com/oauth/authorize";
var ACCESS_TOKEN = "https://api.twitter.com/oauth/access_token";

var HOMEDIR = process.env[process.platform == 'WIN32' ? 'USERPROFILE' : 'HOME'];
var tweety_folder = ".tweety";

try {
    var getAuthURL = function getAuthURL(cb) {
        var oauth = {
            consumer_key: CONSUMER_KEY,
            consumer_secret: SECRET,
            callback: "oob"
        };
        _request2.default.post({
            oauth: oauth,
            url: REQUEST_TOKEN
        }, function (error, rsp, body) {
            var auth_tokens = _querystring2.default.parse(body);
            var url = AUTHORIZE + "?oauth_token=" + auth_tokens.oauth_token;
            cb(url, auth_tokens.oauth_token);
        });
    };

    var getAccessToken = function getAccessToken(token, pin, cb) {
        var oauth = {
            consumer_secret: SECRET,
            consumer_key: CONSUMER_KEY,
            token: token,
            verifier: pin
        };

        _request2.default.post({
            oauth: oauth,
            url: ACCESS_TOKEN
        }, function (error, rsp, body) {
            var params = _querystring2.default.parse(body);
            saveConfig(params);
            cb(params);
        });
    };

    var saveConfig = function saveConfig(params) {
        if (!_fs2.default.existsSync(HOMEDIR + "/" + tweety_folder)) {
            _fs2.default.mkdir(HOMEDIR + "/" + tweety_folder);
        }
        _fs2.default.writeFileSync(HOMEDIR + "/" + tweety_folder + "/user-config.json", (0, _stringify2.default)(params));
    };

    getAuthURL(function (url, auth_token) {
        (0, _opn2.default)(url);
        var PIN = '';
        console.log('Enter the PIN here: ');
        process.stdin.resume();
        process.stdin.setEncoding("utf8");
        process.stdin.once("data", function (chunk) {
            PIN = chunk.toString().trim();
            var token = getAccessToken(auth_token, PIN, function (params) {
                console.log('Done');
                process.exit();
            });
        });
    });

    ;
} catch (e) {
    console.log(e);
}