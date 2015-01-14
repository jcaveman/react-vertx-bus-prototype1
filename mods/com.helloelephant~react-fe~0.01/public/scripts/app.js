var COMMENT_APP = !function() {

  var API, converter, eventBus, initializeEventbus,  /* Globals          */
      Comment, CommentBox, CommentList, CommentForm; /* React components */

  converter = new Showdown.converter();

  initializeEventbus = function(component) {
    eventBus = new vertx.EventBus(
      window.location.protocol + '//' +
      window.location.hostname + ':' +
      window.location.port + '/eventbus'
    );
    eventBus.onopen = function() {
      component.fetchComments();

      eventBus.registerHandler('comments.all_comments', function(event) {
        component.renderComments(event.comments);
      });
    };
  }

  Comment = React.createClass({
    render: function() {
      var rawMarkup = converter.makeHtml(this.props.children.toString());
      return (
        <div className="comment">
          <h2 className="commentAuthor">
            {this.props.author}
          </h2>
          <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
        </div>
      );
    }
  });

  CommentBox = React.createClass({
    fetchComments: function () {
      var component = this;
      console.log('Fetching comments');
      eventBus.send('comments.get_comments', {}, function(result) {
      console.log('Fetch result:', result);
        if (result) { 
          component.renderComments(result.comments);
        }
      });
    },
    renderComments: function(comments) {
      this.setState({data: comments});
    },
    handleCommentSubmit: function(comment) {
      var comments = this.state.data;
      var newComments = comments.concat([comment]);
      eventBus.send('comments.create_comment', comment);
      this.setState({data: newComments});
    },
    getInitialState: function() {
      return {data: []};
    },
    componentDidMount: function() {
      var component = this;
      initializeEventbus(component);
      setInterval(this.fetchComments, this.props.pollInterval);
    },
    render: function() {
      return (
        <div className="commentBox">
          <h1>Comments</h1>
          <CommentList data={this.state.data} />
          <CommentForm onCommentSubmit={this.handleCommentSubmit} />
        </div>
      );
    }
  });

  CommentList = React.createClass({
    render: function() {
      var commentNodes = this.props.data.map(function(comment, index) {
        return (
          // `key` is a React-specific concept and is not mandatory for the
          // purpose of this tutorial. if you're curious, see more here:
          // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
          <Comment author={comment.author} key={index}>
            {comment.text}
          </Comment>
        );
      });
      return (
        <div className="commentList">
          {commentNodes}
        </div>
      );
    }
  });

  CommentForm = React.createClass({
    handleSubmit: function(e) {
      e.preventDefault();
      var author = this.refs.author.getDOMNode().value.trim();
      var text = this.refs.text.getDOMNode().value.trim();
      if (!text || !author) {
        return;
      }
      this.props.onCommentSubmit({author: author, text: text});
      this.refs.author.getDOMNode().value = '';
      this.refs.text.getDOMNode().value = '';
      return;
    },
    render: function() {
      return (
        <form className="commentForm" onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Your name" ref="author" />
          <input type="text" placeholder="Say something..." ref="text" />
          <input type="submit" value="Post" />
        </form>
      );
    }
  });

  React.render(
    <CommentBox url="comments.json" pollInterval={5000} />,
    document.getElementById('content')
  );

  return API; // reveal public methods or vars by attaching them to API

}();