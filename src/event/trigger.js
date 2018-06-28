var url = require('url');
var authentication = require('../common/authentication.js');
var eventRes = new Array();
var moment = require('moment');
var momentToday = moment(Date.now()).format('YYYY-MM-DD');
var todayTime = new Date(momentToday).getTime();
//var next30days = (todayTime+(30 * 24 * 60 * 60 * 1000));
var starttime= Math.floor(todayTime/1000);
//var endtime = Math.floor(next30days/1000);

module.exports = {
  key: 'event_trigger',
  noun: 'event',
  display: {
    label: 'New Event',
    description: 'Triggers when a new event is created.',
    important: true,
  },

  operation: {
    inputFields: [{
        key: 'filter',
        type: 'string',
        label: 'visibility',
        required: true,
        altersDynamicFields: true,
        choices: {
          Public: 'Public',
          Team: 'Team'
        },
      },
      function(z, bundle) {
        if (bundle.inputData.filter === 'Team') {
          return [{
            key: 'conversation',
            required: true,
            type: 'string',
            label: 'Team',
            dynamic: 'hiddensearch.id.name'
          }];
        }
      }
    ],

    perform: (z, bundle) => { //perform call
      if (bundle.inputData.filter === 'Team') {
        const promise = z.request({
          url: 'https://{{bundle.authData.subdomain}}/api/v2/conversations/{{bundle.inputData.conversation}}/events.json',
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

            var mess = JSON.parse(response.content);
            var err = mess.ms_errors.error.message

            throw new Error(err)
          } else if (response["json"]["ms_response"]["events"].length == 0) {
            throw new Error("\n\nNo Event found!");

          } else {
            var events = response["json"]["ms_response"]["events"];
            var eventlength = events.length - 1;
            for (i = 0; i <= eventlength; i++) {

              eventRes[i] =
                //selective fields
                {
                  "id": events[i]["id"],
                  "title": events[i]["title"],
                  "team_id": events[i]["conversation_id"],
                  "team_name": events[i]["conversation_name"],
                  "location": events[i]["location"],
                  "start_datetime": events[i]["start_datetime"],
                  "created_at": events[i]["created_at"],
                  "end_datetime": events[i]["end_datetime"],
                  "agenda": events[i]["agenda"],

                }
            }
            return eventRes;

          }
        });
      } else {


        const promise = z.request({
          url: 'https://{{bundle.authData.subdomain}}/api/v2/reminders/calendar.json',
          method: 'GET',
          params: {
            _token: bundle.authData.session_id,
            _secret: bundle.authData.session_hash,
            _user_id: bundle.authData.id, //must be int
            mode: 'all',
            start:starttime,

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
          } else if (response["json"].length == 0) {

            throw new Error("\n\nNo Event found!");

          } else {

            var events = response["json"];
            var eventlength = events.length - 1;
            for (i = 0; i <= eventlength; i++) {

              eventRes[i] =
                //selective fields
                {
                  "id": events[i]["id"],
                  "title": events[i]["title"],
                  "event_location": events[i]["event_location"],
                  "start": events[i]["start"],
                  "agenda": events[i]["description"],
                  "end": events[i]["end"],

                }
            }
            return eventRes;

          }
        });

      }
    },
    sample: {
      "id": 1234, //sample data
      "Title": "event",
      "created_by_user_name": "John",
      "creator_by": 112233,
      "team_id": 001122,
      "team": "team",
      "Description": "this is a sample event"
    },
  },
};
