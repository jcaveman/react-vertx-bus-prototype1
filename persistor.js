const vertx = require('vertx');
const console = require('vertx/console');

console.log('persistor initialized');

var comments = [{author: 'Jon Caveman', text: 'Here\'s the default comment'}];

var eventBus = vertx.eventBus;

var getCommentsHandler = function(message, replier) {
  console.log('getCommentsHandler received this message: ' + message);
  replier({comments: comments});
};

var createCommentHandler = function(message, replier) {
  console.log('createCommentHandler received this message: ' + message);
  comments.push(message);
  eventBus.publish('comments.all_comments', {comments: comments});
}

eventBus.registerHandler('comments.get_comments', getCommentsHandler);
eventBus.registerHandler('comments.create_comment', createCommentHandler);