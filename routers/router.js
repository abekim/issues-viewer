var app = app || {};

(function () {
  'use strict';

  //router
  var Workspace = Backbone.Router.extend({
    
    routes: {
      ':page': 'setPage' //change in pages
    },

    //change app.page to 
    setPage: function (param) {
      app.page = param.trim() || 1;
    }
  });

  app.Router = new Workspace();
  Backbone.history.start();
}());
