var app = app || {} //global app

$(function ($) {
  'use strict';

  app.AppView = Backbone.View.extend({

    el: '#container',

    //load templates

    //events to look out for
    events: {
      'click .prev': 'previous',
      'click .next': 'next'
    },

    initialize: function () {
      app.url = window.document.URL;
      //if url started at a specific page, get the page #
      if (app.url.indexOf('#') >= 0) app.page = parseInt(app.url.substring(app.url.indexOf('#') + 2));
      //otherwise, start from page 1
      else app.page = 1;
      app.issues_list = this.$('#issues-list');
      app.prev = this.$('.prev');
      app.next = this.$('.next');
      
      //listen for events
      this.listenTo(app.Issues, 'add', this.addIssue);
      this.listenTo(app.Issues, 'reset', this.addAllIssues);
      this.listenTo(app.Issues, 'all', this.render);

      //load existing collection/get new data from the API
      app.Issues.fetch();
      this.retrieveIssues();
    },

    render: function () {
      //use router to navigate between different pages
      app.prev.attr('href','#/' + (app.page - 1).toString());
      app.next.attr('href','#/' + (app.page + 1).toString());

      if (app.page <= 1) { //if first page, no prev should be shown
        $('.prev').toggleClass('inv', true);
      } else {
        $('.prev').toggleClass('inv', false);
      }
    },

    //retrieve issues from github by making api call using jsonp
    retrieveIssues: function () {
      var create = this.createIssue; //i love functional programming

      $.jsonp({ url: "https://api.github.com/repos/rails/rails/issues?callback=?&page=" + app.page,
        success: function (res) {
          var retrieved_issues = res.data;
          //once data is retrieved, add it to the collection
          _.each(retrieved_issues, create, this);
        }});
    },

    //if the issue exists in collection, 
    //  I need to make sure it doesn't get created again.
    createIssue: function (issue_schema) {
      //check if the issue already exists in collection
      if (app.Issues.exists(issue_schema.number).length) {
        return
      } else { //otherwise, add it
        issue_schema.order = app.Issues.nextOrder();
        app.Issues.create(issue_schema);
      }
    },

    //add a single issue to the view
    addIssue: function (issue) {
      var view = new app.IssueView({ model: issue });
      $('#issues-list').append(view.render().el);
    },

    //add all the issues in collection to the view
    addAllIssues: function () {
      //reset existing table...
      app.issues_list.html('<tr><th>#</th><th>Issue</th><th>Submitted by</th></tr>');
      app.Issues.each(this.addIssue, this);
    },

    //function call for navigating to previous page
    previous: function () {
      app.page--; //change the page number
      var index = app.url.lastIndexOf('#');

      if (index >= 0) {
        app.url = app.url.substring(0, index);
      }
      
      window.location = app.url + app.prev.attr('href');

      //toggle the visibility of the issues
      this.toggleAll();
    },

    //function call for next page
    next: function () {
      app.page++; //change the page number
      var index = app.url.lastIndexOf('#');

      if (index >= 0) {
        app.url = app.url.substring(0, index);
      }
      
      window.location = app.url + app.next.attr('href');

      //I only need to retrieve issues from github 
      //  for going to the next page since I know 
      //  I already have all the issues in
      //  the collection for previous pages
      this.retrieveIssues();
      //toggle the visibility of the issues
      this.toggleAll();
    },

    //toggle the visibility of a single issue
    toggleIssue: function (issue) {
      issue.trigger('visible');
    },

    //toggle the visibility of all the issues in collection
    toggleAll: function () {
      app.Issues.each(this.toggleIssue, this);
    }
  });
});
