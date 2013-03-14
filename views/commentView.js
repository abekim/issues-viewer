var app = app || {};

$(function () {
  'use strict';

  //viewing comments
  app.CommentView = Backbone.View.extend({

    //specify tr tag
    tagName: 'div',

    //load template
    template: _.template($('#comment-template').html()),

    initialize: function () {
      //listen for events
      this.listenTo(this.model, 'change', this.render);
    },

    render: function () {
      this.$el.html(this.template(this.model.toJSON()));

      return this;
    }
  });
});
