var url = require('url');
//important modules
var authentication = require('../common/authentication.js');
var formRes = new Array();
module.exports = {
   key: 'hidden_form',
   noun: 'New Form',
   display:
   {
      label: 'Forms or Trackers',
      description: 'Search forms/trackers.',
      hidden: true,
   },
   operation:
   {

      perform: (z, bundle) =>
      { //perform call


            const promise = z.request(
            {
               url: 'https://{{bundle.authData.subdomain}}/api/trackers/get_my_forms.json',
               method: 'GET',
               params:
               {
                  _token: bundle.authData.session_id,
                  _secret: bundle.authData.session_hash,
                  _user_id: bundle.authData.id, //must be int //user id obtained through postman

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
                  throw new Error("\n\nUnable to fetch a Form!");
               }
               else if (response.json.ms_response.forms == null)
               {
                  throw new Error("\n\nNo Form found!");
               }

               else
               {
                 var form_length = response["json"]["ms_response"]["forms"].length
                 var form = response["json"]["ms_response"]["forms"]
                 for (i=0;i<form_length;i++)
                 {
                  formRes[i] = //selective response
                   {
                     "id":form[i]["form_id"],
                     "name":form[i]["name"],

                 }
               }
                 return formRes;
               }
            });
         },
         sample:
         {
            "id": 4123 //sample data
         },
      },

   };
