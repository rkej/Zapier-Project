var url = require('url');
var authentication = require('../common/authentication.js');


module.exports = {
  key: 'event_action',
  noun: 'Creates a new Event',
  display: {
    important: true,
    label: 'Create Event',
    description: 'Create an event in a team or company.'
  },

  // `operation` is where the business logic goes.
  operation: {

    // `inputFields` can define the fields a user could provide,
    // we'll pass them in as `bundle.inputData` later.
    inputFields: [{
        key: 'title',
        type: 'string',
        label: 'Title',
        required: true,
        helpText: 'Enter title here',
      },
      {
        key: 'location',
        type: 'string',
        label: 'Location',
        required: true,
        helpText: 'Enter location here',
      },
      {
        key: 'start_datetime',
        type: 'datetime',
        label: 'Start Date',
        required: true,
        helpText: 'Enter starting date and time',
      },
      {
        key: 'end_datetime',
        type: 'datetime',
        label: 'End Date',
        required: true,
        helpText: 'Enter ending date and time',
      },
      {
        key: 'privacy',
        type: 'string',
        label: 'Privacy',
        required: true,
        helpText: 'Maybe public ',
      },

      {
        key: 'personal_note',
        type: 'string',
        label: 'Personal note',
      },
      {
        key: 'agenda',
        type: 'string',
        label: 'Agenda',
      },
      {
        key: 'events_members_ids',
        type: 'integer',
        label: 'Attendees',
        helpText: 'perform search step to get the user id',
        dynamic:'hiddenusersearch.id.name',
        search: 'user_search.id',
        list: true
      },
      {
        key: 'conversation_id',
        type: 'integer',
        label: 'Team ID',
        helpText: 'perform search step to get the team id',
        dynamic:'hiddensearch.id.name',
        search: 'team_search.id'
      }
    ],

//performing call wiht request body
    perform: (z, bundle) => {
      const promise = z.request({
        url: 'https://{{bundle.authData.subdomain}}/api/events.json',
        params: {
          _token: bundle.authData.session_id,
          _secret: bundle.authData.session_hash,
          _user_id: bundle.authData.id, //must be int
        },
        method: 'POST',
        body: JSON.stringify({
          "ms_request": {
            "event": {
              "title": bundle.inputData.title,
              "location": bundle.inputData.location,
              "start_datetime": bundle.inputData.start_datetime,
              "end_datetime": bundle.inputData.end_datetime,
              "privacy": bundle.inputData.privacy,
              "personal_note": bundle.inputData.personal_note,
              "agenda": bundle.inputData.agenda,
              "conversation_id":bundle.inputData.conversation_id,
              "events_members_ids":bundle.inputData.events_members_ids//[]
            }
          }
        }),
        headers: {
          'content-type': 'application/json'
        },

      });
      return promise.then((response) => {

        if (response["json"]["ms_errors"]) {

          var mess = JSON.parse(response.content);
          var err = mess.ms_errors.error.message

          throw new Error(err)
        } else {

          var events = response["json"]["ms_response"]["event"];
          return events
         var eventRes = //selective response
            {
              "id":events[0]["id"],
              "title": events[0]["title"],
              "location": events[0]["location"],
              "start_datetime":events[0]["start_datetime"],
              "end_datetime":events[0]["end_datetime"],
              "agenda":events[0]["agenda"],
              "attendees":events[0]["events_members_ids"]
          }
          return eventRes;
        }
      });
    },

    sample: {

      "agenda": "Agenda 012"

    },
    outputFields: [{
        key: 'title',
        label: 'Title'
      },
      {
        key: 'location',
        label: 'Location'
      },
      {
        key: 'start_datetime',
        label: 'Start date and time'
      },
      {
        key: 'end_datetime',
        label: 'End date and time'
      },
      {
        key: 'privacy',
        label: 'Privacy'
      },
      {
        key: 'events_members_ids',
        label: 'Event member id'
      },
      {
        key: 'personal_note',
        label: 'Personal note'
      },
      {
        key: 'agenda',
        label: 'Agenda'
      },
      //  {key: 'conversation_id', label: 'Project Id'}
    ]
  },
};
