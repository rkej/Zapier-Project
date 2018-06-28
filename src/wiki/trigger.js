var url = require('url');
var authentication = require('../common/authentication.js');
var wikiRes = new Array();

module.exports = {
  key: 'wiki_trigger',
  noun: 'Wiki',
  display: {
    label: 'New Wiki',
    description: 'Triggers when new wiki is added.'
  },
   operation: {
     inputFields: [
       {
       key: 'project_id',
       type: 'string',
       label: 'Team',
       helpText: 'Search team name',
       required: true,
       dynamic: 'hiddensearch.id.name',
     }
   ],

     perform: (z, bundle) => {
       const promise = z.request ({
         url: 'https://{{bundle.authData.subdomain}}/api/wikis.json',
         method: 'GET',
         params: {
           _token: bundle.authData.session_id,
           _secret: bundle.authData.session_hash,
           _user_id: bundle.authData.id,
           conversation_id: bundle.inputData.project_id
         },

         headers: {
           'content-type': 'application/json'
         },
       });

       return promise.then((response) => {
         var errors = JSON.parse(response.content);
        if (errors.ms_errors) {
          var mess = JSON.parse(response.content);
          var err = mess.ms_errors.error.message;
          throw new Error(err);
        }
        else if (response["json"]["ms_response"]["wikis"].length == 0) {
          throw new Error("No wiki found!");
        }
        else {
          var wiki = response["json"]["ms_response"]["wikis"];
          var wikilength = wiki.length - 1;
          for (i = 0; i <= wikilength; i++) {
            wikiRes[i] =// for loop because all the request is send at the same time during trigger option
            {
              "id": wiki[i]["id"],
              "title": wiki[i]["title"],
              "stripped_description": wiki[i]["stripped_description"],
              "tile_content": wiki[i]["tile"]["tile_content"],
              "creator_by": wiki[i]["creator_by"],
              "created_name": wiki[i]["created_name"],
              "team_id": wiki[i]["conversation_id"],
              "mlink": wiki[i]["mlink"]
            }
          }
          return wikiRes;
        }
      });

        },
        sample: {
             "id": 1234,
             "title": "wiki",
             "description_chunks": "Hello World",
             "stripped_description": "Jump to navigation Jump to search",
             "tile_content": "Jump to navigation Jump to search",
             "creator_by": 112233,
             "created_name": "John",
             "team_id": 0011224,
             "description": "this is a asample wiki"
        },
     }

   };
