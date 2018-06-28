//authentication
const authentication = require('./src/common/authentication');

//commonfiles
const hiddentask = require('./src/common/hiddentask');
const hidden_form = require('./src/common/hidden_form');
const hiddensearch = require('./src/common/hiddensearch');
const hiddenmilestone = require('./src/common/hiddenmilestone');
const hiddenusersearch = require('./src/common/hiddenusersearch');

//trigger files
const event_trigger = require('./src/event/trigger');
const post_trigger = require('./src/posts/trigger');
const task_trigger = require('./src/task/trigger');
const form_trigger = require('./src/formtrackers/trigger');
const opportunity_trigger = require('./src/opportunity/trigger');
const wiki_trigger = require('./src/wiki/trigger');

//Searches
const team_search = require('./src/team/search');
const user_search = require('./src/user/search');
const teammember_search = require('./src/teammembers/search');
const tracker_search = require('./src/formtrackers/search');
const milestone_search = require('./src/milestone/search');
//const task_key_search = require('./src/task/search_key');
//const task_key_value_search = require(./src/task/search_key_value');
//const opportunity_key_search = require(./src/opportunity/search_key');
//const opportunity_key_value_search = require(./src/opportunity/search_key_value');


//action files
const formtracker_action = require('./src/formtrackers/action');
const post_action = require('./src/posts/action');
const event_action = require('./src/event/action');
const task_action = require('./src/task/action');
const wiki_action = require('./src/wiki/action');

const App = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication, //Authentication


  beforeRequest: [],

  afterResponse: [],

  resources: {


  },

  triggers: { //performs triggers
    [task_trigger.key]:task_trigger,
    [event_trigger.key]:event_trigger,
    [post_trigger.key]:post_trigger,
    [hiddensearch.key]: hiddensearch,
    [hidden_form.key]: hidden_form,
    [hiddentask.key]:hiddentask,
	  [form_trigger.key]:form_trigger,
    [hiddenmilestone.key]:hiddenmilestone,
    [hiddenusersearch.key]:hiddenusersearch,
    [opportunity_trigger.key]:opportunity_trigger,
    [wiki_trigger.key]:wiki_trigger,
  // [update_trigger.key]:update_trigger,


  },
searches: {
  [team_search.key]:team_search,
  [user_search.key]:user_search,
  [teammember_search.key]:teammember_search,
  [tracker_search.key]:tracker_search,
  [milestone_search.key]:milestone_search,
  //[task_key_search.key]:task_key_search,
  //[ task_key_value_search.key]: task_key_value_search,
  //[opportunity_key_search.key]:opportunity_key_search,
  //[opportunity_key_value_search.key]:opportunity_key_value_search,

  },

  creates: { //performs actions
    [formtracker_action.key]:formtracker_action,
    [post_action.key]:post_action,
    [event_action.key]:event_action,
    [task_action.key]:task_action,
    [wiki_action.key]:wiki_action,

    }
};
module.exports = App;
