var authentication = require('../common/authentication.js');
var url = require('url');



module.exports = {
  key: 'task_action',
  noun: 'Task',
  display: {
    label: 'Create Task',
    description: 'Creates a new Task in a team or company.',
    important: true
  },

  // `operation` is where the business logic goes.
  operation: {

    // `inputFields` can define the fields a user could provide,
    // we'll pass them in as `bundle.inputData` later.
    // for users. Zapier will put them into the UX
    inputFields: [{
        key: 'name',
        type: 'string',
        label: 'Name',
        required: true,
        helpText: 'Enter task '
      },
      {
        key: 'conversation_id',
        type: 'integer',
        label: 'Team ID',
        required: true,
        helpText:'perform search step to get the team id',
        dynamic:'hiddensearch.id.name',
        search: 'team_search.id'
      },
      {
        key: 'notes',
        type: 'string',
        label: 'Notes',
      },
      {
        key: 'start_on',
        type: 'string',
        label: 'Start on',
      },
      {
        key: 'due_on',
        type: 'string',
        label: 'Due on',
      },
      {
        key: 'assigned_to',
        type: 'integer',
        label: 'Assigned to',
        helpText:'You will get the user ID from search step',
        dynamic:'hiddenusersearch.id.name',
        search: 'user_search.id'
      },
      {
        key: 'milestone_name',
        type: 'string',
        label: 'Milestone',
          helpText:'You will get the milestone ID from search step',
          dynamic:'hiddenmilestone.id.name',
          search: 'milstone_search.id'
      },
      {
        key: 'type',
        type: 'string',
        label: 'Type',
      },
    ],


    perform: (z, bundle) => {
      if (isNaN(bundle.inputData.conversation_id) == false) {
        const promise = z.request({
          url: 'https://{{bundle.authData.subdomain}}/api/tasks.json',
          params: {
            _token: bundle.authData.session_id,
            _secret: bundle.authData.session_hash,
            _user_id: bundle.authData.id, //must be int
          },
          method: 'POST',
          body: JSON.stringify({
            "ms_request": {
              "task": {
                //"to_felix_user_id": bundle.authData.id,
                "name": bundle.inputData.name,
                "visibility": "public", // bundle.inputData.visibility,
                "project_id": bundle.inputData.conversation_id,
                "notes": bundle.inputData.notes,
                "start_on": bundle.inputData.start_on,
                "due_on": bundle.inputData.due_on,
                "type": bundle.inputData.type,
                "assigned_to": bundle.inputData.assigned_to,
                "milestone_id": bundle.inputData.milestone_name
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
            var tasks1 =  JSON.parse(response.content);


           var taskres = //selective response
              {
                "id": tasks1.ms_response.task.id,
                "assigned_to_name": tasks1.ms_response.task.assigned_to_name,
                "name": tasks1.ms_response.task.name,
                "notes": tasks1.ms_response.task.notes,
                "start_on": tasks1.ms_response.task.start_on,
                "milestone_name": tasks1.ms_response.task.milestone_name,
                "type": tasks1.ms_response.task.type,
                "conversation_name": tasks1.ms_response.task.conversation_name,
                "visibility": tasks1.ms_response.task.visibility,
              };
              return taskres;
          }
        });
      } else {
        const promise = z.request({
          url: 'https://{{bundle.authData.subdomain}}/api/tasks.json',
          params: {
            _token: bundle.authData.session_id,
            _secret: bundle.authData.session_hash,
            _user_id: bundle.authData.id, //must be int
          },
          method: 'POST',
          body: JSON.stringify({
            "ms_request": {
              "task": {
                "to_felix_user_id": bundle.authData.id,
                "name": bundle.inputData.name,
                "visibility": "public", // bundle.inputData.visibility,
                "notes": bundle.inputData.notes,
                "start_on": bundle.inputData.start_on,
                "due_on": bundle.inputData.due_on,
                "type": bundle.inputData.type,
                "assigned_to": bundle.inputData.assigned_to,
                "milestone_id": bundle.inputData.milestone_name

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

            var tasks1 =  JSON.parse(response.content);
            //z.console.log("tasks1",tasks1);

           var taskres = //selective response
              {
                "id": tasks1.ms_response.task.id,
                "assigned_to_name": tasks1.ms_response.task.assigned_to_name,
                "name": tasks1.ms_response.task.name,
                "notes": tasks1.ms_response.task.notes,
                "start_on": tasks1.ms_response.task.start_on,
                "milestone_name": tasks1.ms_response.task.milestone_name,
                "type": tasks1.ms_response.task.type,
                "conversation_name": tasks1.ms_response.task.conversation_name,
                "visibility": tasks1.ms_response.task.visibility,
              };


            return taskres;
//z.console.log("tasks response",taskres);
          }


        });
      }
    },

    sample: {

      "name": "1234"

    },
    outputFields: [{
        key: 'name',
        label: 'Name'
      },
      {
        key: 'notes',
        label: 'Notes'
      },
      {
        key: 'start_on',
        label: 'Start On'
      },
      {
        key: 'due_on',
        label: 'Due On'
      },

    ]
  },
};
