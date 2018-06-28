var authentication = require('./authentication.js');
var url = require('url');


module.exports = {
  key: 'hiddenusersearch',
  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'User',
  display: {
    label: "Find a User",
    description: 'Finds an existing User',
    hidden: true,
  },
  // `operation` is where we make the call to your API to do the search
  operation: {

    perform: (z, bundle) => {
      const promise = z.request({
        url: 'https://{{bundle.authData.subdomain}}/api/users.json',
        method: 'GET',
        params: {

          _token: bundle.authData.session_id,
          _secret: bundle.authData.session_hash,
          _user_id: bundle.authData.id, //must be int //user id obtained through postman

        },
        headers: {
          'content-type': 'application/json'
        },
      });

      return promise.then((response) => {
        if (response["json"]["ms_errors"]) {
          var mess = JSON.parse(response.content);
          var err = mess.ms_errors.error.message
          //z.console.log("mass", mass);
          throw new Error(err)
        } else if (response.status == 401) {
          throw new Error("\n\nNo User found!")
        } else if (response["ms_response"]) {

          throw new Error("\n\nNo User available!");
        } else if(response["json"]["ms_response"]["users"].length == 0){
          throw new Error("\n\nNo User found!");
        }
        else{


          var user = response["json"]["ms_response"]["users"];
          return user;
        }
      });

    },
    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of

    outputFields: [{
      key: 'query',
      label: 'ID'
    }],
    sample: {
      "id": 1234
    },
    canPaginate: true
  },
};
