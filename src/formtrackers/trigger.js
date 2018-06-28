var url = require('url');
var authentication = require('../common/authentication.js');
var eventRes = new Array();
var form_fields;
var updated_form_fields; //to store updated response fields

module.exports = {
    key: 'formtrigger',
    noun: 'form',
    display: {
        label: "New Form Submission",
        description: 'Triggers when a new submission is added to a Form/Tracker.',

    },
    operation: {
        inputFields: [{
            key: 'form_id',
            required: true,
            type: 'string',
            label: "Form/Tracker Name",
            dynamic: 'hidden_form.id.name',
        }],
        perform: (z, bundle) => { //perform call

            const promise = z.request({
                url: 'https://{{bundle.authData.subdomain}}/api/trackers/forms/get_submissions/{{bundle.inputData.form_id}}.json',
                method: 'GET',
                params: {
                    _token: bundle.authData.session_id,
                    _secret: bundle.authData.session_hash,
                    _user_id: bundle.authData.id, //must be int
                },
                headers: {
                    'content-type': 'application/json'
                },
            });
            return promise.then((response) => {
                if (response["json"]["ms_errors"]) {
                    if(response["json"]["ms_errors"]["error"]["message"] == null){
                      throw new Error("\n\nNo Field found!");
                    }else{

                    var mess = JSON.parse(response.content);
                    var err = mess.ms_errors.error.message
                    throw new Error(err)
                  }
                } else if (response["json"]["ms_response"]["data"].length == 0) {
                    throw new Error("\n\nAt least one submission is required!");

                }
                else {
                    var events = response["json"]["ms_response"]["data"];
                    var eventlength = events.length - 1;
                    for (i = 0; i <= eventlength; i++)

                    {
                        form_fields = Object.assign({}, events[i]);
                        delete form_fields.RowId;
                        eventRes[i] = form_fields;
                        eventRes[i] =
                            //selective fields
                            {
                                "id": events[i]["RowId"],
                                "form_fields":form_fields
                            }
                    }
                    return eventRes; //Updated response
                }
            });

        },
        sample: {
            "id": 1234,
            "tracker_name": "post",
            "project": "nodejs",
            "team": "team"
        },
    },
};
