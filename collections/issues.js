var app = app || {};

(function () {
  'use strict';

  //collection of issues
  var IssueList = Backbone.Collection.extend({

    model: app.Issue,

    localStorage: new Backbone.LocalStorage('j'), //set local storage

    //checks to see if an issue with given num exists in coll
    exists: function (num) {
      return this.filter(function (issue) {
        return issue.get('number') == num;
      })
    },

    //we need to keep the issues in a sequential order,
    //  and the way to do it would be by giving an "order"
    //  attribute to the model.
    nextOrder: function () {
      if (!this.length) {
        return 1;
      }
      return this.last().get('order') + 1;
    },

    //sort issues in collection by their "order"
    comparator: function (issue) {
      return issue.get('order');
    }
  });

  //ship it!
  app.Issues = new IssueList();
}());
