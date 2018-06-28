var authentication = require('../common/authentication.js');
var url = require('url');
var _ = require('lodash');
//var hiddenusersearch = require('../common/hiddenusersearch.js');
var trackerRes = new Array();
var milestone = new Array();

module.exports = {
  key: 'milstone_search',
  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'User',
  display: {
    important:true,
    label: "Find a Milestone",
    description: 'Finds an existing milestone.',
      },
  // `operation` is where we make the call to your API to do the search
  operation: {

    inputFields: [
     {
       key: 'conversation_id',
       type: 'integer',
       label: 'Team ID',
       required : true,
       helpText:'perform search step to get the team id'
     },
     {
       key: 'milestone',
       type: 'string',
       label: 'Milestone',
       required : true,

     }

   ],

    perform: (z, bundle) => {
      const promise = z.request({
        url: 'https://{{bundle.authData.subdomain}}/api/projects/{{bundle.inputData.conversation_id}}/milestones.json?',
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

          throw new Error(err)
        } else if (response.status == 401) {
          throw new Error("\n\nNo User found!")
        } else if (response["ms_response"]) {

          throw new Error("\n\nNo User available");
        } else if(response["json"]["ms_response"]["milestones"].length == 0){
          throw new Error("\n\nNo User found!");
        }
        else{
          var Milestone = response["json"]["ms_response"]["milestones"];
          var milestonelength = Milestone.length - 1;
          for (i = 0; i <= milestonelength; i++) {

            trackerRes[i] =
              //selective fields
              {
                "id": Milestone[i]["id"],
                "name": Milestone[i]["name"],
              }
          }
          for (var i = 0, len = trackerRes.length; i < len; i++) {
          if (trackerRes[i].name == bundle.inputData.milestone) {

            milestone[i] =
              {
                "id": trackerRes[i].id,
                "name": trackerRes[i].name,
              }

            return  _.compact(milestone)

          }

        }
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

    },

  },
};
