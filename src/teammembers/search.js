var authentication = require('../common/authentication.js');
var url = require('url');
var teammemberRes = new Array();
module.exports = {
  key: 'teammember_search',
  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: "team member",
  display: {
    important:true,
    label: "Find a Member in a Team",
    description: 'Finds an existing member in team.',
      },
  // `operation` is where we make the call to your API to do the search
  operation: {

    inputFields: [
     {
       key: 'conversation_id',
       type: 'integer',
       label: 'Team ID',
       required : true,
       //search: 'hiddensearch.id',
       helpText: 'perform search step to get the team id'
     },
     {
       key: 'email',
       type: 'string',
       label: 'Email',
       required : true,
       //search: 'hiddensearch.id',
       helpText: 'Search an existing user by email'
     }
   ],

    perform: (z, bundle) => {
      const promise = z.request({
        url: 'https://{{bundle.authData.subdomain}}/api/conversations/{{bundle.inputData.conversation_id}}/members.json',
        method: 'GET',
        params: {

          _token: bundle.authData.session_id,
          _secret: bundle.authData.session_hash,
          _user_id: bundle.authData.id, //must be int //user id obtained through postman
          query:bundle.inputData.email,

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
          throw new Error("\n\nNo Team member found!")
        } else if (response["ms_response"]) {

          throw new Error("\n\nNo Team member available!");
        } else if(response["json"]["ms_response"]["members"].length == 0){
          throw new Error("\n\nNo Team member found!");
        }
        else{
          var Teammember = response["json"]["ms_response"]["members"];
          var teammemberlength = Teammember.length - 1;
          for (i = 0; i <= teammemberlength; i++) {

            teammemberRes[i] =
              //selective fields
              {
                "id": Teammember[i]["id"],
                "name": Teammember[i]["name"],
                "email": Teammember[i]["email"],
              }
          }
          //z.console.log("res0",teammemberRes)
          return teammemberRes
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
    //canPaginate: true
  },
};
