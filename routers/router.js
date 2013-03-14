var app = app || {};

(function () {
  'use strict';

  //router
  var Workspace = Backbone.Router.extend({
    
    routes: {
      ':page': 'setPage', //change in pages
      'issue/:number': 'loadDetails' //issue details page
    },

    //change app.page to the parameter
    setPage: function (param) {
      app.page = param.trim() || 1;
    },

    loadDetails: function (param) {
      app.detail_num = param.trim() || '';
      //trigger a *detail* event in Issues colletion. 
      //  this is what kick starts the details page.
      app.Issues.trigger('detail');
    }
  });

  app.Router = new Workspace();
  Backbone.history.start();
}());
