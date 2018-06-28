var url = require('url');
var authentication = require('../common/authentication.js');
var hidden_form = require('../common/hidden_form.js');
var formRes = new Array();
module.exports = {
  key: 'formtracker_action', //key required to pass to index.js in creates field
  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'Form and Tracker',
  display: {
    label: 'Submit a Form',
    description: 'Update an existing form or a tracker.',
  },
  // `operation` is where the business logic goes.
  operation: {
    inputFields: [
      { //inputfields shown in zapier to accept user input
        key: 'form_id',
        type: 'string',
        label: 'Form/Tracker',
        required: true,
        altersDynamicFields: true, //Will execute the next function to get forms fields
        dynamic:'hidden_form.id.name',
        //search: 'tracker_search.id',
            },
      (z, bundle) => {
        const promise = z.request({
          url: 'https://{{bundle.authData.subdomain}}/api/trackers/get_my_forms.json',
          method: 'GET',
          params: {
            _token: bundle.authData.session_id,
            _secret: bundle.authData.session_hash,
            _user_id: bundle.authData.id,
            //conversation_id:bundle.inputData.conversation_id,
            //query:bundle.inputData.query //must be int
          },
          headers: {
            'content-type': 'application/json'
          }, // assuming an endpoint that returns fields for a form
        });
        return promise.then(res => res.json).then(json => {

          for (let i = 0; i < json.ms_response.forms.length; i++) {
            if (json.ms_response.forms[i].form_id == bundle.inputData.form_id) {
              return json.ms_response.forms[i].form_fileds.map(field => ({ // notice it's `form_fileds` like in your screenshot
                key: field, // required
                // without label they'll use key
                // without type they'll use `string`
              }))
            }
          }

        });

            },
        ],
    perform: (z, bundle) => { //perform call
      data = { //storing payload into data
        "ms_request": {
          "form_id": bundle.inputData.form_id,
          "conversation_id":bundle.inputData.conversation_id,
          "data": [
                        bundle.inputData
                  ]
        }
      }
      const promise = z.request({
        url: 'https://{{bundle.authData.subdomain}}/api/trackers/forms/add_submission_public.json',
        params: {
          _token: bundle.authData.session_id,
          _secret: bundle.authData.session_hash,
          _user_id: bundle.authData.id, //must be an integer
        },
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json'
        }
      });
      return promise.then((response) => {
        if (response["json"]["ms_errors"]) {
          var mess = JSON.parse(response.content);
          var err = mess.ms_errors.error.message
          throw new Error(err)
        }
        else {
          return JSON.parse(response.content);
        }
      });
    },
    sample: {
      "id": 12344,
    },
    outputFields: [{
        key: 'id',
        label: 'id'
            },
      {
        key: 'title',
        label: 'Title'
            },
      {
        key: 'description',
        label: 'Description'
            },
      {
        key: 'external_images',
        label: 'External images'
            }
        ]
  }
};
