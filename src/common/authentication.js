var url = require('url');
require('dotenv').config();

const Auth = (z, bundle) => {

    var string = bundle.authData.password;
    var buffer = new Buffer(string);
    var toBase64 = buffer.toString('base64'); //converting password into base64
    const promise = z.request({
        url: 'https://{{bundle.authData.subdomain}}/api/login.json',
        method: 'POST',
        body: JSON.stringify({
            "ms_request": {
                "user": {
                    "api_key": '{{process.env.API_KEY}}', // API key hardcoded in zapier env
                    "username": bundle.authData.username,
                    "password": toBase64, //accepting base64 password.
                }
            }
        }),
    });

    return promise.then((response) => {
        return response
    });


}

const getSessionKey = (z, bundle) => {

    var string = bundle.authData.password;
    var buffer = new Buffer(string);
    var toBase64 = buffer.toString('base64'); //converting password into base64

    const promise = z.request({
        url: 'https://{{bundle.authData.subdomain}}/api/login.json',
        method: 'POST',
        body: JSON.stringify({
            "ms_request": {
                "user": {
                    "api_key": '{{process.env.API_KEY}}', // API key
                    "username": bundle.authData.username,
                    "password": toBase64, //accepting base64 password.
                }
            }
        }),
    });

    return promise.then((response) => {

        // This prints the error message and stack trace to `stderr`.

        if (response["json"]["ms_errors"]) {
            throw new Error('\n\nInvalid Username/Password!');
        } else {
            return response["json"]["ms_response"]["user"]; //returning response(session_id,session_hash,user_) to getSessionKey
        }


    });
};
module.exports = {
    type: 'session', //authentication type
    fields: [
        //UI feilds for connect account

        {
            key: 'username',
            label: 'Username',
            required: true,
            type: 'string',
            helpText: 'The username or email you use to login to MangoApps'
        },
        {
            key: 'password',
            label: 'Password',
            required: true,
            type: 'password'
        },
        {
            key: 'subdomain',
            label: 'Your MangoApps domain',
            required: true,
            type: 'string',
            helpText: 'Example: abc.mangoapps.com'
        },
    ],
    test: Auth,
    sessionConfig: {
        perform: getSessionKey
    },
    connectionLabel:

        (z, bundle) => {

          return ' {{bundle.authData.subdomain}} | {{bundle.authData.username}}'
        }
};
