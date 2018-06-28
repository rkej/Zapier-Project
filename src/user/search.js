var authentication = require('../common/authentication.js');
var url = require('url');
var hiddenusersearch = require('../common/hiddenusersearch.js');
var userRes = new Array();


module.exports = {
  key: 'user_search',
  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'User',
  display: {
    label: "Find a User",
    description: 'Finds an existing user.',
      },
  // `operation` is where we make the call to your API to do the search
  operation: {

    inputFields: [
     {
       key: 'name',
       type: 'string',
       label: 'User',
       required : true,
       helpText: 'Search user using email address'
     }
   ],

    perform: (z, bundle) => {
      const promise = z.request({
        url: 'https://{{bundle.authData.subdomain}}/api/users/colleagues.json',
        method: 'GET',
        params: {

          _token: bundle.authData.session_id,
          _secret: bundle.authData.session_hash,
          _user_id: bundle.authData.id, //must be int //user id obtained through postman
          query:bundle.inputData.name
        },
        headers: {
          'content-type': 'application/json'
        },
      });

      return promise.then((response) => {
        if (response["json"]["ms_errors"]) {
          var mess = JSON.parse(response.content);
          var err = mess.ms_errors.error.message

          throw new Error(err)
        } else if (response.status == 401) {
          throw new Error("\n\nNo User found!")
        } else if (response["ms_response"]) {

          throw new Error("\n\nNo User available!");
        } else if(response["json"]["ms_response"]["users"].length == 0){
          throw new Error("\n\nNo User found!");
        }
        else{
          var User = response["json"]["ms_response"]["users"];
          var userlength = User.length - 1;
          for (i = 0; i <= userlength; i++) {

            userRes[i] =
              //selective fields
              {
                "id": User[i]["id"],
                "name": User[i]["name"],
                "email": User[i]["email"],
              }
          }
          return userRes;
        }
      });

    },
    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of

   outputFields: [{
      key: 'name',
      label: 'User'
    }],
    sample: {
      "id": 1234,
      "name": 'abc'
    },

  },
};
