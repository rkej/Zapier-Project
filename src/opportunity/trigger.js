
var url = require('url');
var authentication = require('../common/authentication.js');
var teamRes = new Array();
module.exports = {
  key: 'opportunity_search',
  noun: 'Opportunity',
  display: {
    label: 'New Opportunity',
    description: 'Triggers when a new opportunity is added to the company.',

  },
  operation: {

    perform: (z, bundle) => { //perform call

      const promise = z.request({
        url: 'https://{{bundle.authData.subdomain}}/api/teams/get_all_teams.json',
        method: 'GET',
        params: {

          _token: bundle.authData.session_id,
          _secret: bundle.authData.session_hash,
          _user_id: bundle.authData.id, //must be an integer
          conv_sub_type: 'opportunities',
          limit:1000
        },

        headers: {
          'content-type': 'application/json'
        },
      });

      return promise.then((response) => {
        var errors = JSON.parse(response.content);
        if (errors.ms_errors) {
          var mess = JSON.parse(response.content);
          var err = mess.ms_errors.error.message;
          throw new Error(err)
        } else if (response["json"]["ms_response"]["teams"].length==0) {
          throw new Error("\n\nNo Opportunity found!");
        } else {

          var team = response["json"]["ms_response"]["teams"];

            var teamlength = team.length - 1;
            for (i = 0; i <= teamlength; i++) {

              teamRes[i] =
                //selective fields
                {
                  "id": team[i]["id"],
                  "name": team[i]["name"],
                  "creator_id": team[i]["creator_id"],
                  "created_at": team[i]["created_at"],
                  "updated_at": team[i]["updated_at"],
                  "member_access": team[i]["member_access"],
                  "description": team[i]["description"],
                }

            }
              return teamRes;
          //}
}
      });
    },
sample: {
      "id": 1234 ,//sample data
      "name": "post",
      "created_name":"John",
      "created_at": 112233,

    },
  },
};
