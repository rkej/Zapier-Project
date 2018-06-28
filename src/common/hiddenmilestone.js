var authentication = require('./authentication.js');
var url = require('url');


module.exports = {
  key: 'hiddenmilestone',
  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'User',
  display: {
    label: "Find Milestone",
    description: 'Finds a milstone.',
    hidden: true,
  },
  // `operation` is where we make the call to your API to do the search
  operation: {


    perform: (z, bundle) => {
      const promise = z.request({
        url: 'https://{{bundle.authData.subdomain}}/api/projects/{{bundle.inputData.project_id}}/milestones.json',
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
        z.console.log("res",response)
        if (response.status == 403) {
            var mess = JSON.parse(response.content);
            throw new Error(mess)
        }
        else if (response["json"]["ms_errors"]) {
          var mess = JSON.parse(response.content);
          throw new Error(mess)
        }
         else if (response.status == 401) {
          throw new Error("\n\nUnauthorised access!")
        } else if (response["ms_response"]) {

          throw new Error("\n\nNo Milestone available!");
        } else if(response["json"]["ms_response"]["milestones"].length == 0){
          throw new Error("\n\nNo Milestone found!");
        }
        else{


          var Milestone = response["json"]["ms_response"]["milestones"];
          return Milestone;
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
