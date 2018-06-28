var authentication = require('../common/authentication.js');
var url = require('url');
var teamRes = new Array();
var team = new Array();
var _ = require('lodash')
module.exports = {
  key: 'team_search',
  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'Team',
  display: {
    label: "Find a Team",
    description: 'Finds an existing team.',
      },
  // `operation` is where we make the call to your API to do the search
  operation: {

    inputFields: [
     {
       key: 'query',
       type: 'string',
       label: 'Team',
       required : true,
       helpText: 'Search a team name'
     }
   ],

    perform: (z, bundle) => {
      const promise = z.request({
        url: 'https://{{bundle.authData.subdomain}}/api/teams/search.json',
        method: 'GET',
        params: {

          _token: bundle.authData.session_id,
          _secret: bundle.authData.session_hash,
          _user_id: bundle.authData.id, //must be int //user id obtained through postman
          limit: 1000,
          query:bundle.inputData.query,
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
          throw new Error("\n\nNo Team found!")
        } else if (response["ms_response"]) {

          throw new Error("\n\nNo Team available!");
        } else if(response["json"]["ms_response"]["teams"].length == 0){
          throw new Error("\n\nNo Team found!");
        }
        else{
          var Team = response["json"]["ms_response"]["teams"];
          var teamlength = Team.length - 1;
          for (i = 0; i <= teamlength; i++) {

            teamRes[i] =
              //selective fields
              {
                "id": Team[i]["id"],
                "name": Team[i]["name"],
              }
          }
          for (var i = 0, len = teamRes.length; i < len; i++) {
          if (teamRes[i].name == bundle.inputData.query) {

            team[i] =
              {
                "id": teamRes[i].id,
                "name": teamRes[i].name,
              }

            return  _.compact(team)
          }
          else{
            throw new Error("\n\nNo Team found!");
          }

        }

        }

      });
    },
    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of


    sample: {
      "id": 1234
    },
    //canPaginate: true
  },
};
