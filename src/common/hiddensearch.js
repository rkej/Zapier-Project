var authentication = require('./authentication.js');
var url = require('url');


module.exports = {
  key: 'hiddensearch',
  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'User',
  display: {
    label: "Find Project",
    description: 'Finds an existing project.',
    hidden: true,
  },
  // `operation` is where we make the call to your API to do the search
  operation: {


    perform: (z, bundle) => {
      const promise = z.request({
        url: 'https://{{bundle.authData.subdomain}}/api/teams/search.json',
        method: 'GET',
        params: {

          _token: bundle.authData.session_id,
          _secret: bundle.authData.session_hash,
          _user_id: bundle.authData.id, //must be int //user id obtained through postman
          limit: 1000,
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
          throw new Error("\n\nNo Project found!")
        } else if (response["ms_response"]) {

          throw new Error("\n\nNo Project available!");
        } else if(response["json"]["ms_response"]["teams"].length == 0){
          throw new Error("\n\nNo Team found!");
        }
        else{


          var Team = response["json"]["ms_response"]["teams"];
          return Team;
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
