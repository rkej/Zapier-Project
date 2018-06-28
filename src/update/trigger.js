var url = require('url');
var authentication = require('../common/authentication.js');
var feedRes = new Array();
module.exports = {
  key: 'update_trigger',
  noun: 'New Update',
  display:
  {
    label: 'Update',
    description: 'Triggers when a new update is added.'
  },
  operation:
  {
  inputFields: [
    {
      key: 'group_id',
      type: 'string',
      label: 'Team',
      dynamic: 'hiddensearch.id.name'

    }],
    perform: (z, bundle) =>
    { //perform call
      if (Number.isNaN(bundle.inputData.group_id))
      { //API call with project_id(Team)
        const promise = z.request(
        {
            url:'https://{{bundle.authData.subdomain}}/api/projects/{{bundle.inputData.group_id}}/wall.json',

          method: 'GET',
          params:
          {
            _token: bundle.authData.session_id,
            _secret: bundle.authData.session_hash,
            _user_id: bundle.authData.id
          },
          headers:
          {
            'content-type': 'application/json'
          },
        });

        return promise.then((response) =>
        {
          if (response["json"]["ms_errors"])
          {
            throw new Error("Unable to fetch an update!");
          }
          else if (response["json"]["ms_response"]["feeds"].length == 0)
          {
            throw new Error("No update found!");
          }
          else if (Array.isArray(response) == false)
          {

            var feed = response["json"]["ms_response"]["feeds"];
            var feedlength = feed.length - 1;
            for (i = 0; i <= feedlength; i++) {
             feedRes[i] =  //selective response
              {
                "id": feed[i]["id"],
                "body": feed[i]["body"],
                "visibility": feed[i]["visibility"],
                "group_id": feed[i]["group_id"],
                "group_name": feed[i]["group_name"],
                "mlink": feed[i]["mlink"]
              }
}
            return feedRes;
          }

        });
      }else
      { //API call without project_id(Team)
        const promise = z.request({
        url: 'https://{{bundle.authData.subdomain}}/api/feeds/whats_new.json',
          method: 'GET',
          params:
          {
            _token: bundle.authData.session_id,
            _secret: bundle.authData.session_hash,
            _user_id: bundle.authData.id
          },
          headers:
          {
            'content-type': 'application/json'
          },
        });

        return promise.then((response) =>
        {
          if (response["json"]["ms_errors"])
          {
            throw new Error("Unable to fetch an update!");
          }
          else if (response["json"]["ms_response"]["feeds"].length == 0)
          {
            throw new Error("No update found!");
          }
         else if (Array.isArray(response) == false)
          {
            var feed = response["json"]["ms_response"]["feeds"];
            var feedlength = feed.length - 1;
            for (i = 0; i <= feedlength; i++) {
             feedRes[i] =  //selective response
              {
                "id": feed[i]["id"],
                "body": feed[i]["body"],
                "visibility": feed[i]["visibility"],
                "group_id": feed[i]["group_id"],
                "group_name": feed[i]["group_name"],
                "mlink": feed[i]["mlink"],
              }
            }

            return feedRes;
          }
          else
          {
            var feed = JSON.parse(response.content);
            var feedres = [ //selective response
              {
                "id": feed.ms_response.feed.id,
                "body": feed.ms_response.feed.body,
                "visibility": feed.ms_response.feed.visibility,
                "group_id": feed.ms_response.feed.group_id,
                "group_name": feed.ms_response.feed.group_name,
                "mlink": feed.ms_response.feed.mlink,
              }
            ]
            return feedres;
          }
        });
      }
    },

    sample:
    {
      "id": 4123 //sample data
    },
  },
};
