import request from 'request';
import qs from 'querystring';
import fs from 'fs';
import twitter from 'twitter';
import browser from 'opn';

const CONSUMER_KEY = '';
const SECRET = '';
const REQUEST_TOKEN = "https://api.twitter.com/oauth/request_token";
const AUTHORIZE = "https://api.twitter.com/oauth/authorize";
const ACCESS_TOKEN = "https://api.twitter.com/oauth/access_token";

const HOMEDIR = process.env[(process.platform == 'WIN32') ? 'USERPROFILE' : 'HOME'];
const tweety_folder = ".tweety";

try {
    getAuthURL(function (url, auth_token) {
        browser(url);
        let PIN = '';
        console.log('Enter the PIN here: ');
        process.stdin.resume();
        process.stdin.setEncoding("utf8");
        process.stdin.once("data", function (chunk) {
            PIN = chunk.toString().trim();
            const token = getAccessToken(auth_token, PIN, function (params) {
                console.log('Done');
                process.exit();
            });
        });
    });

    function getAuthURL(cb) {
    	const oauth = {
    		consumer_key: CONSUMER_KEY,
    		consumer_secret: SECRET,
    		callback: "oob"
    	};
    	request.post({
    		oauth: oauth,
    		url: REQUEST_TOKEN
    	}, function (error, rsp, body) {
    		var auth_tokens = qs.parse(body);
    		var url = AUTHORIZE + "?oauth_token=" + auth_tokens.oauth_token;
    		cb(url, auth_tokens.oauth_token);
    	} )
    }

    function getAccessToken(token, pin, cb) {
    	const oauth = {
    		consumer_secret: SECRET,
    		consumer_key: CONSUMER_KEY,
    		token: token,
    		verifier: pin
    	};

    	request.post({
    		oauth: oauth,
    		url: ACCESS_TOKEN
    	}, function  (error, rsp, body) {
    		const params = qs.parse(body);
    		saveConfig(params);
    		cb(params);
    	});
    };


    function saveConfig(params) {
        if(!fs.existsSync(HOMEDIR + "/" + tweety_folder)) {
    	fs.mkdir(HOMEDIR + "/" + tweety_folder);
        }
        fs.writeFileSync(HOMEDIR + "/" + tweety_folder + "/user-config.json", JSON.stringify(params));
    }
} catch (e) {
    console.log(e);
}
