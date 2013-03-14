var app = app || {};

(function () {
  'use strict';

  //collection of comments
  var CommentList = Backbone.Collection.extend({

    model: app.Comment,

    localStorage: new Backbone.LocalStorage('j-comments'), //set local storage

    exists: function (id) {
      return this.filter(function (comment) {
        return comment.get('id') == id;
      });
    },

    //get comments of a specific issue
    filterByIssue: function (url) {
      return this.filter(function (comment) {
        return comment.get('issue_url') == url;
      });
    },

    //comments should be in order of datetime.
    //  however, since the api request already gets the comments
    //  in order of datetime, we'll implement the order feature again.
    nextOrder: function () {
      if (!this.length) {
        return 1;
      }
      return this.last().get('order') + 1;
    },

    //sort comments in collection by their "order/datetime"
    comparator: function (comment) {
      return comment.get('order');
    }
  });

  app.Comments = new CommentList();
}());
