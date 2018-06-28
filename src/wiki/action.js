var authentication = require('../common/authentication.js');
var hiddensearch = require('../common/hiddensearch.js');

module.exports = {
  key: 'wiki_action',
  noun: 'Wiki',
  display: {
    label: 'Create Wiki',
    description: 'Creates a new wiki in a team.'
  },

  operation: {
    inputFields: [{
        key: 'title',
        required: true,
        type: 'string',
        label: 'Title',
        helpText: 'Enter title of the wiki'
    },
    {
        key: 'description',
        type: 'string',
        label: 'Description',
        helpText: 'Enter description of the wiki'
    },
    {
        key: 'conversation_id',
        required: true,
        type: 'string',
        label: 'Team ID',
        helpText: 'Search for team',
        dynamic: 'hiddensearch.id.name'
    }
  ],

  perform: (z, bundle) => {
    const promise = z.request({
      url: 'https://{{bundle.authData.subdomain}}/api/wikis.json',
      params: {
        _token: bundle.authData.session_id,
        _secret: bundle.authData.session_hash,
        _user_id: bundle.authData.id,
      },
      method: 'POST',
      body: JSON.stringify({
        "ms_request": {
          "wiki": {
            "title": bundle.inputData.title,
            "description": bundle.inputData.description,
            "conversation_id": bundle.inputData.conversation_id
          }
        }
       }),
      headers: {
        "content-type": "application/json"
      }
    });
    return promise.then((response) => {
      if (response["json"]["ms_errors"]) {
        var mess = JSON.parse(response.content);
        var err = mess.ms_errors.error.message;
        throw new Error(err);

      }

      else {
        //var wiki = response["json"]["ms_response"]["wiki"];
        var task = JSON.parse(response.content);
        var wikiRes =//no for loop because only 1 response at a time during action option
        {
          "id": task.ms_response.wiki.id,
          "message": task.ms_response.wiki.message,
        }
        return wikiRes;
      }
    });
  },
  sample:{
    "id": 121212,
    "message": "Hello World"
  },
  }
};
