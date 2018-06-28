//important modules
var authentication = require('../common/authentication.js');
var hiddenmilestone = require('../common/hiddenmilestone.js')
var taskRes = new Array();
module.exports = {
  key: 'task_trigger',
  noun: 'New  Task',
  display: {
    important:true,
    label: 'New Task',
    description: 'Triggers when a new task is assigned to a user.'
  },
  operation: {
    inputFields: [{
      key: 'filter',
      type: 'string',
      label: 'Filter',
      required: true,
      choices: {
        Completed_Tasks: "Completed Tasks",
        Tasks_as_creator: "Tasks as creator",
        Pending_Tasks: "Pending Tasks"
      },
    }, {
      key: 'project_id',
      type: 'string',
      label: 'Team',
      dynamic: 'hiddensearch.id.name',
      //altersDynamicFields: true //Will execute the next function to get milestone (name,id)
    }, (z, bundle) => {
      if (typeof bundle.inputData.project_id !== 'undefined') {
        return [{
          key: 'milestone',
          type: 'string',
          label: 'Milestone',
          dynamic: 'hiddenmilestone.id.name',
          description: 'Select a team before selecting a milestone.',
        }];
      }
    }],
    perform: (z, bundle) => { //perform call
        if (isNaN(bundle.inputData.project_id) == false) {
        const promise = z.request({
          url: 'https://{{bundle.authData.subdomain}}/api/tasks/new_index.json',
          method: 'GET',
          params: {
            _token: bundle.authData.session_id,
            _secret: bundle.authData.session_hash,
            _user_id: bundle.authData.id, //must be int //user id obtained through postman
            filter: bundle.inputData.filter,
            page: 1,
            limit: 100,
            milestone_id: bundle.inputData.milestone,
              project_id: bundle.inputData.project_id,
          },
          headers: {
            'content-type': 'application/json'
          },
        });
        return promise.then((response) => {
          if (response["json"]["ms_errors"]) {
            throw new Error("\n\nUnable to fetch a Task!");
          }
          else if (response.json.ms_response.tasks == null) {
            throw new Error("\n\nNo task found!");
          }
          else if (Array.isArray(response["json"]["ms_response"]["tasks"]["task"]) == true) {
            //z.console.log("nan",Number.isNaN(bundle.inputData.project_id));
            z.console.log("nan",bundle.inputData.project_id);
            var task = response["json"]["ms_response"]["tasks"]["task"];
            var tasklength = task.length - 1;
            for (i = 0; i <= tasklength; i++) {
              taskRes[i] = //selective response
                {
                  "id": task[i]["id"],
                  "assigned_to_name": task[i]["assigned_to_name"],
                  "created_at": task[i]["created_at"],
                  "creator_name": task[i]["creator_name"],
                  "due": task[i]["due"],
                  "due_on": task[i]["due_on"],
                  "finished_on": task[i]["finished_on"],
                  "task name": task[i]["name"],
                  "notes": task[i]["notes"],
                  "milestone":task[i]["milestone"],
                  "milestone_name":task[i]["milestone_name"],
                  "team_id": task[i]["project_id"],
                  "team_name": task[i]["conversation_name"],
                  "start_on": task[i]["start_on"],
                  "mlink": task[i]["mlink"],
                  "visibility": task[i]["visibility"],
                  "reviewer_id": task[i]["reviewers"]["reviewer"]["user_id"],
                  "reviewer_name": task[i]["reviewers"]["reviewer"]["user_name"],
                  "checklist": task[i]["sub_tasks"],
                  //"action": task[i]["next_actions"],
                };
            }
            return taskRes;
          }
          else {
            var task = JSON.parse(response.content);
            var taskres = [ //selective response
              {
                "id": task.ms_response.tasks.task.id,
                "accepted_on": task.ms_response.tasks.task.accepted_on,
                "created_at": task.ms_response.tasks.task.created_at,
                "creator_name": task.ms_response.tasks.task.creator_name,
                "delivered_on": task.ms_response.tasks.task.delivered_on,
                "due": task.ms_response.tasks.task.due,
                "due_on": task.ms_response.tasks.task.due_on,
                "finished_on": task.ms_response.tasks.task.finished_on,
                "milestone": task.ms_response.tasks.task.milestone,
                "milestone_name":task.ms_response.tasks.task.milestone_name,
                "task name": task.ms_response.tasks.task.name,
                "notes": task.ms_response.tasks.task.notes,
                "team_id": task.ms_response.tasks.task.project_id,
                "team_name": task.ms_response.tasks.task.conversation_name,
                "rejected_on": task.ms_response.tasks.task.rejected_on,
                "start_on": task.ms_response.tasks.task.start_on,
                "started_on": task.ms_response.tasks.task.start_on,
                "status": task.ms_response.tasks.task.status,
                "mlink": task.ms_response.tasks.task.mlink,
                "visibility": task.ms_response.tasks.task.visibility,
                "reviewer_id": task.ms_response.tasks.task.reviewer_id,
                "reviewer_name": task.ms_response.tasks.task.reviewer_name,
                "sub_task_name": task.ms_response.tasks.task.sub_tasks,
                //"action": task.ms_response.tasks.task.next_actions.action,
              }
            ];
            return taskres;
          }
        });
      }
      else {
        const promise = z.request({
          url: 'https://{{bundle.authData.subdomain}}/api/tasks/new_index.json',
          method: 'GET',
          params: {
            _token: bundle.authData.session_id,
            _secret: bundle.authData.session_hash,
            _user_id: bundle.authData.id, //must be int //user id obtained through postman
            filter: bundle.inputData.filter,
            page: 1,
            limit: 100,

          },
          headers: {
            'content-type': 'application/json'
          },
        });
        return promise.then((response) => {
          if (response["json"]["ms_errors"]) {
            throw new Error("\n\nUnable to fetch a Task!");
          }
          else if (response.json.ms_response.tasks == null) {
            throw new Error("\n\nNo Task found!");
          }
          else if (Array.isArray(response["json"]["ms_response"]["tasks"]["task"]) == true) {
            var task = response["json"]["ms_response"]["tasks"]["task"];

            var tasklength = task.length - 1;
            for (i = 0; i <= tasklength; i++) {
              taskRes[i] = //selective response
                {
                  "id": task[i]["id"],
                  "assigned_to_name": task[i]["assigned_to_name"],
                  "created_at": task[i]["created_at"],
                  "creator_name": task[i]["creator_name"],
                  "due": task[i]["due"],
                  "due_on": task[i]["due_on"],
                  "finished_on": task[i]["finished_on"],
                  "task name": task[i]["name"],
                  "notes": task[i]["notes"],
                  "team_id": task[i]["project_id"],
                  "team_name": task[i]["conversation_name"],
                  "milestone":task[i]["milestone"],
                  "milestone_name":task[i]["milestone_name"],
                  "start_on": task[i]["start_on"],
                  "mlink": task[i]["mlink"],
                  "visibility": task[i]["visibility"],
                  "reviewer_id": task[i]["reviewers"]["reviewer"]["user_id"],
                  "reviewer_name": task[i]["reviewers"]["reviewer"]["user_name"],
                  "checklist": task[i]["sub_tasks"],
                  //"action": task[i]["next_actions"],
                };
            }
            return taskRes;
          }
          else {
            var task = JSON.parse(response.content);
            var taskres = [ //selective response
              {
                "id": task.ms_response.tasks.task.id,
                "accepted_on": task.ms_response.tasks.accepted_on,
                "created_at": task.ms_response.tasks.task.created_at,
                "creator_name": task.ms_response.tasks.task.creator_name,
                "delivered_on": task.ms_response.tasks.task.delivered_on,
                "due": task.ms_response.tasks.task.due,
                "due_on": task.ms_response.tasks.task.due_on,
                "finished_on": task.ms_response.tasks.task.finished_on,
                "milestone": task.ms_response.tasks.task.milestone,
                "milestone_name":task.ms_response.tasks.task.milestone_name,
                "task name": task.ms_response.tasks.task.name,
                "notes": task.ms_response.tasks.task.notes,
                "project_id": task.ms_response.tasks.task.project_id,
                "team_name": task.ms_response.tasks.task.conversation_name,
                "rejected_on": task.ms_response.tasks.task.rejected_on,
                "start_on": task.ms_response.tasks.task.start_on,
                "started_on": task.ms_response.tasks.task.start_on,
                "status": task.ms_response.tasks.task.status,
                "mlink": task.ms_response.tasks.task.mlink,
                "visibility": task.ms_response.tasks.task.visibility,
                "reviewer_id": task.ms_response.tasks.task.reviewer_id,
                "reviewer_name": task.ms_response.tasks.task.reviewer_name,
                "sub_task_name": task.ms_response.tasks.task.sub_tasks,
                //"action": task.ms_response.tasks.task.next_actions.action,
              }
            ];

            return taskres;
            //}
          }
        });
      }
    },
    sample: {
      "id": 4123 //sample data
    },
  },
};
