var app = app || {} //global app

$(function ($) {
  'use strict';

  app.AppView = Backbone.View.extend({

    el: '#container',

    //load templates
    home_template: _.template($('#home-template').html()),
    detail_template: _.template($('#detail-template').html()),
    comment_template: _.template($('#comment-template').html()),

    //events to look out for
    events: {
      'click .prev': 'previous',
      'click .next': 'next'
    },

    initialize: function () {
      //load home
      this.$el.html(this.home_template());


      app.url = window.document.URL;
      //if url started at a specific page, get the page #
      if (app.url.indexOf('#') >= 0) { 
        app.page = parseInt(app.url.substring(app.url.indexOf('#') + 2));
        //set app.url to [base]/index.html
        app.url = app.url.substring(0, app.url.indexOf('#'));
      } else { app.page = 1; } //otherwise, start from page 1\

      app.Comments.fetch();
      
      //listen for events
      this.listenTo(app.Issues, 'add', this.addIssue);
      this.listenTo(app.Issues, 'reset', this.addAllIssues);
      this.listenTo(app.Issues, 'detail', this.details);
      this.listenTo(app.Issues, 'all', this.render);
      this.listenTo(app.Comments, 'add', this.addComment);
      this.listenTo(app.Comments, 'reset', this.addAllComments);
      this.listenTo(app.Comments, 'all', this.details);

      //load existing collection/get new data from the API
      app.Issues.fetch();
      this.retrieveIssues();

      $('.brand').attr('href', app.url);
    },

    render: function () {
      //use router to navigate between different pages
      $('.prev').attr('href','#/' + (app.page - 1).toString());
      $('.next').attr('href','#/' + (app.page + 1).toString());

      if (app.page <= 1) { //if first page, no prev should be shown
        $('.prev').toggleClass('inv', true);
      } else {
        $('.prev').toggleClass('inv', false);
      }
    },

    //retrieve issues from github by making api call using jsonp
    retrieveIssues: function () {
      var create = this.createIssue; //i love functional programming

      $.jsonp({ url: "https://api.github.com/repos/rails/rails/issues?client_id=611cad28ff1b6d7b289f&client_secret=2217c60135cf990cb620903920eb33e2ba57520f&callback=?&page=" + app.page + "&per_page=25",
        success: function (res) {
          //once data is retrieved, add it to the collection
          _.each(res.data, create, this);
        }});
    },

    //if the issue exists in collection, 
    //  I need to make sure it doesn't get created again.
    createIssue: function (issue_schema) {
      //check if the issue already exists in collection
      if (app.Issues.exists(issue_schema.number).length) {
        return
      } else {
        //otherwise, add it & its comments
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
      $('#issues-list').html('<tr><th>#</th><th>Issue</th><th>Submitted by</th></tr>');
      app.Issues.each(this.addIssue, this);
    },

    //function call for navigating to previous page
    previous: function () {
      app.page--; //change the page number
      var index = app.url.lastIndexOf('#');

      if (index >= 0) {
        app.url = app.url.substring(0, index);
      }
      
      window.location = app.url + app.$prev.attr('href');

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
      
      window.location = app.url + app.$next.attr('href');

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
    },

    retrieveComments: function () {
      var make_comment = this.createComment;
      if (app.detail_num) {
        var comments_url = app.Issues.exists(app.detail_num)[0].get('comments_url');

        $.jsonp({ url: comments_url + '?client_id=611cad28ff1b6d7b289f&client_secret=2217c60135cf990cb620903920eb33e2ba57520f&callback=?',
          success: function (res) {
            _.each(res.data, make_comment, this);
          }});
      }
    },

    //create comments using the same method as issues
    createComment: function (comment_schema) {
      //check if the issue already exists in collection
      if (app.Comments.exists(comment_schema.id).length) {
        return
      } else {
        //otherwise, add it & its comments
        comment_schema.order = app.Comments.nextOrder();
        app.Comments.create(comment_schema);
      }
    },

    details: function () {
      this.retrieveComments();
      if (app.detail_num) {
        this.$el.html(this.detail_template(app.Issues.exists(app.detail_num)[0].toJSON()));

        this.addAllComments(app.detail_num);
      }
    },

    addComment: function (comment) {
      var view = new app.CommentView({ model: comment });
      $('#comments').append(view.render().el);
    },

    addAllComments: function (num) {
      $('#comments').html('');
      if (app.detail_num) {
        var detailed_issue = app.Issues.exists(app.detail_num)[0];
        var comments = app.Comments.filterByIssue(detailed_issue.get('url'));
        if (comments.length) {
          _.each(comments, this.addComment, this);
        }
      }
    }
  });
});
