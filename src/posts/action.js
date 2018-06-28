
var authentication = require('../common/authentication.js');
var hiddensearch = require('../common/hiddensearch.js');
//var checkUrl = require('valid_url');
module.exports = {
  key: 'post_action', //key required to pass to index.js in creates field
  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'Post',
  display: {
    important: true,
    label: 'Create Post',
    description: 'Creates a new post in a team or company.'
  },

  // `operation` is where the business logic goes.
  operation: {
    inputFields: [{ //inputfields shown in zapier to accept user input
        key: 'title',
        required: true,
        type: 'string',
        label: 'Title'
      },
      {
        key: 'description',
        required: true,
        type: 'string',
        label: 'Description'
      },
      {
        key: 'conversation_id',
        type: 'integer',
        label: 'Team ID',
        helpText:'If you do not select a Team, then by default post will be created in company',
        dynamic:'hiddensearch.name.id',
        search: 'team_search.id'
      },
      {
        key: 'external_images',
        type: 'string',
        label: 'Attachment',
        helpText: 'Select a link of an image'

      }
    ],

    perform: (z, bundle) => { //perform call
  if (typeof bundle.inputData.external_images !== 'undefined') {
      const promise = z.request({
      url: 'https://{{bundle.authData.subdomain}}/api/posts.json',
      params: {
        _token: bundle.authData.session_id,
        _secret: bundle.authData.session_hash,
        _user_id: bundle.authData.id, //must be an integer
      },
      method: 'POST',
      body: JSON.stringify({
        "ms_request": {
          "post": {
            "title": bundle.inputData.title,
            "description": bundle.inputData.description,
            "external_images":[bundle.inputData.external_images],
            "conversation_id":bundle.inputData.conversation_id

          }
        }
      }),
      headers: {
        'content-type': 'application/json'
      }
    });
    return promise.then((response) => {

      if (response["json"]["ms_errors"]) {

        var mess = JSON.parse(response.content);
        var err = mess.ms_errors.error.message

        throw new Error(err)
      } else {

        var posts = response["json"]["ms_response"]["posts"];

        var postRes = //selective response
          {
            "id": posts[0]["id"],
            "title": posts[0]["title"],
            "description": posts[0]["description"],
            "team_id": posts[0]["conversation_id"],
            "team_name": posts[0]["conversation_name"],
            "Attachment":posts[0]["external_images"],
          }
        //  var one = checkUrl.external_images;
        //z.console.log("Test3",[bundle.inputData.external_images]);

        return postRes;
      }
    });
  }
  else{
    const promise = z.request({
    url: 'https://{{bundle.authData.subdomain}}/api/posts.json',
    params: {
      _token: bundle.authData.session_id,
      _secret: bundle.authData.session_hash,
      _user_id: bundle.authData.id, //must be an integer
    },
    method: 'POST',
    body: JSON.stringify({
      "ms_request": {
        "post": {
          "title": bundle.inputData.title,
          "description": bundle.inputData.description,
          "conversation_id":bundle.inputData.conversation_id
        }
      }
    }),
    headers: {
      'content-type': 'application/json'
    }
  });
  return promise.then((response) => {

    if (response["json"]["ms_errors"]) {

      var mess = JSON.parse(response.content);
      var err = mess.ms_errors.error.message

      throw new Error(err)
    } else {

      var posts = response["json"]["ms_response"]["posts"];

      var postRes = //selective response
        {
          "id": posts[0]["id"],
          "title": posts[0]["title"],
          "description": posts[0]["description"],
          "team_id": posts[0]["conversation_id"],
          "team_name": posts[0]["conversation_name"],
          "Attachment":posts[0]["external_images"],
        }

      return postRes;
    }
  });
  }
},
      sample: {
      "id": 12344,
      "title": "abc",
      "description": "this is a sample post",
      "external_images": "abc.com/image.jpg",
      "conversation_id": 12345
    },

  }
};
