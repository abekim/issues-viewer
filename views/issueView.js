var app = app || {};

$(function () {
  'use strict';

  //viewing issues
  app.IssueView = Backbone.View.extend({

    //specify tr tag
    tagName: 'tr',

    //load template
    template: _.template($('#issue-template').html()),

    initialize: function () {
      //listen for events
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'visible', this.toggleVisible);
    },

    render: function () {
      //add class issue-row & give a specific link so we can route correctly
      this.$el.addClass('issue-row').attr('href', '#/issue/' + this.model.get('number')).html(this.template(this.model.toJSON()));
      this.toggleVisible(); //show only 25 issues

      return this;
    },

    //change the visibility by checking if it should be hidden
    toggleVisible: function () {
      this.$el.toggleClass('hidden', this.isHidden());
    },

    //return true if it's outside the range of 25 I'm looking for
    isHidden: function () {
      var order = this.model.get('order');
      return order > app.page * 25 || order <= (app.page - 1) * 25;
    }
  });
});
