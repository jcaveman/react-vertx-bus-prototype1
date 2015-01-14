const container = require('vertx/container');
const vertx = require('vertx');
const console = require('vertx/console');

var config = container.config;
var eventBus = vertx.eventBus;

var persistorConfig = {
  address: config.address,
  db_name: config.db_name,
  host: config.host,
  port: config.port
}

container.deployModule('io.vertx~mod-mongo-persistor~2.1.0', persistorConfig, 1, function(err, deployId) {
  if (err != null) {
    err.printStackTrace();
  } else {
    console.log('mod-mongo-persistor deployed. ID: ' + deployId);
  }
});

var getCommentsHandler = function(message, replier) {
  console.log('getCommentsHandler received this message: ' + message);

  var response = {
    'action': 'find',
    'collection': 'comments'
  };

  eventBus.send('comments.persistor', response, function(response) {
    console.log('Response received');
    replier({comments: response.results});
  });
};

var createCommentHandler = function(message, replier) {
  console.log('createCommentHandler received this message: ' + message.author);

  var response = {
    'action': 'save',
    'collection': 'comments',
    'document': message
  };

  eventBus.send('comments.persistor', response, function(response) {
    console.log('Document sent');
    var response = {
      'action': 'find',
      'collection': 'comments'
    };
    eventBus.send('comments.persistor', response, function(response) {
      console.log('Response received');
      eventBus.publish('comments.all_comments', {comments: response.results});
    });
  });
}

eventBus.registerHandler('comments.get_comments', getCommentsHandler);
eventBus.registerHandler('comments.create_comment', createCommentHandler);

