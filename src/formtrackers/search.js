var authentication = require('../common/authentication.js');
var url = require('url');
//var hiddenusersearch = require('../common/hiddenusersearch.js');
var trackerRes = new Array();
var tracker = new Array();
var _ = require('lodash');

module.exports = {
  key: 'tracker_search',
  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'tracker',
  display: {
    important:true,
    label: "Find a Tracker",
    description: 'Finds an existing tracker.',
      },
  // `operation` is where we make the call to your API to do the search
  operation: {
    inputFields: [
     {
       key: 'name',
       type: 'string',
       label: 'Tracker Name',
       required : true,
      //   dynamic : 'hiddenusersearch.id.name',
       helpText: 'Search an existing tracker'
     },
     {
       key: 'conversation_id',
       type: 'integer',
       label: 'Team ID',
      required:true,
      //   dynamic : 'hiddenusersearch.id.name',
      dynamic:'hiddensearch.id.name',
      search: 'team_search.id',
       helpText: 'perform search step to get the team id.'
     }
   ],

    perform: (z, bundle) => {
      const promise = z.request({
        url: 'https://{{bundle.authData.subdomain}}/api/trackers/get_my_forms.json',
        method: 'GET',
        params: {

          _token: bundle.authData.session_id,
          _secret: bundle.authData.session_hash,
          _user_id: bundle.authData.id, //must be int //user id obtained through postman
          query:bundle.inputData.name,
          conversation_id:bundle.inputData.conversation_id
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
          throw new Error("\n\nNo Tracker found!")
        } else if (response["ms_response"]) {

          throw new Error("\n\nNo Tracker available!");
        } else if(response["json"]["ms_response"]["forms"].length == 0){
          throw new Error("\n\nNo Tracker found!");
        }
        else{
          var Tracker = response["json"]["ms_response"]["forms"];
          var trackerlength = Tracker.length - 1;
          for (i = 0; i <= trackerlength; i++) {

            trackerRes[i] =
              //selective fields
              {
                "id": Tracker[i]["form_id"],
                "name": Tracker[i]["name"],
              }
            }
              for (var i = 0, len = trackerRes.length; i < len; i++) {
              if (trackerRes[i].name == bundle.inputData.name) {

                tracker[i] =
                  {
                    "id": trackerRes[i].id,
                    "name": trackerRes[i].name,
                  }

                return  _.compact(tracker)

              }

            }


        }
      });

    },
    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of

   outputFields: [{
      key: 'name',
      label: 'Tracker '
    }],
    sample: {
      "id": 1234,

    },

  },
};
