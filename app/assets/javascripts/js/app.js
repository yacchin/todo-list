var app = app || {};

(function() {
  'use strict';
  app.Todo = Backbone.Model.extend({
    defaults: {
      category_id: 1,
      content: '',
      completed: false
    },
    toggle: function() {
      this.set('completed', !this.get('completed'));
    },
    storage: function() {
      localStorage.setItem('todos', JSON.stringify(app.todos));
    }
  });
})();

(function($) {
  'use strict';
  app.TodoView = Backbone.View.extend({
    tagName: 'li',
    template: _.template($('#item-template').html()),
    events: {
      'tap label': 'edit',
      'swipeRight label': 'toggleCompleted',
      'swipeLeft label': 'clear',
      'keypress .edit': 'updateOnEnter',
      'blur .edit': 'close',
      'swipeUp label': 'sortTodos',
      'swipeDown label': 'sortTodos'
    },
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
      this.listenTo(this.model, 'all', this.save);
    },
    save: function() {
      this.model.storage();
      var JSONdata = {
        api_key: "abcdefg",
        todos: JSON.parse(JSON.stringify(app.todos))
      };
      console.log(JSONdata);

      $.ajax({
        type: 'post',
        url: 'http://ancient-chamber-4185.herokuapp.com/api.json',
        //url: 'http://192.168.56.101:3000/api.json',
        data: JSON.stringify(JSONdata),
        contentType: 'application/JSON',
        dataType: 'json',
        scriptCharset: 'utf-8',
        aync: false,
        success: function(data) {
          console.log('success', data);
        }
      });
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.toggleClass('completed', this.model.get('completed'));
      this.$input = this.$('.edit');
      return this;
    },
    toggleCompleted: function() {
      this.model.toggle();
    },
    edit: function() {
      this.$el.addClass('editing');
      this.$input.focus();
    },
    close: function() {
      var trimmedValue = this.$input.val().trim();
      this.$input.val(trimmedValue);
      if (trimmedValue) {
        this.model.set('content', trimmedValue);
      } else {
        this.clear();
      }
      this.$el.removeClass('editing');
    },
    updateOnEnter: function(e) {
      if (e.which === ENTER_KEY) {
        this.close();
      }
    },
    clear: function() {
      this.model.destroy({silent: true});
      var num = 0;
      app.todos.each(function(todo) {
        todo.set('order', num);
        num++;
      }, this);
    },
    sortTodos: function(evt) {
      var startOrder = this.model.get('order');
      var endOrder = $(document.elementFromPoint(evt.clientXend, evt.clientYend)).attr('data-order');
      var loopstart, loopend, sortNum;
      if (!endOrder) return;
      (startOrder < endOrder) ? (loopstart = startOrder, loopend = endOrder, sortNum = -1) : (loopstart = endOrder, loopend = startOrder, sortNum = 1);
      app.todos.each(function(todo) {
        if (todo.get('order') == startOrder) {
          todo.set('order', endOrder);
        } else if (todo.get('order') >= loopstart && todo.get('order') <= loopend) {
          todo.set('order', (+todo.get('order') + sortNum));
        }
      }, this);
      app.todos.sort();
    }
  });
})($);

(function($) {
  'use strict';
  app.AppView = Backbone.View.extend({
    el: '#todoapp',
    events: {
      'tap .add-button': 'create'
    },
    initialize: function() {
      this.listenTo(app.todos, 'add', this.addOne);
      this.listenTo(app.todos, 'sort', this.addAll);
      app.todos.sort();
    },
    addOne: function(todo) {
      var view = new app.TodoView({
        model: todo
      });
      $('.todo-list').append(view.render().el);
    },
    addAll: function() {
      $('.todo-list').html('');
      app.todos.each(this.addOne, this);
    },
    newAttributes: function() {
      return {
        content: '',
        completed: false,
        order: app.todos.nextOrder()
      };
    },
    create: function() {
      app.todos.add(this.newAttributes());
      $($('label')[$('label').length - 1]).trigger('tap');
    }
  });
})($);

var ENTER_KEY = 13;
$(function() {
  'use strict';

  var JSONdata = {
    api_key: "abcdefg"
  };
  $.ajax({
    type: 'post',
    url: 'http://ancient-chamber-4185.herokuapp.com/api.json',
    //url: 'http://192.168.56.101:3000/api.json',
    data: JSON.stringify(JSONdata),
    contentType: 'application/JSON',
    dataType: 'json',
    scriptCharset: 'utf-8',
    // aync: false,
    success: function(data) {
      console.log('success', data);

      var Todos = Backbone.Collection.extend({
        model: app.Todo,
        url: 'api.json',
        nextOrder: function() {
          return (!this.length) ? 0 : this.length;
        }
      });
      app.todos = new Todos(data);
      // app.todos = (localStorage.getItem('todos')) ? new Todos(JSON.parse(localStorage.getItem('todos'))) : new Todos();
      app.todos.comparator = function(model) {
        return model.get('order');
      };

      new app.AppView();
      console.log(JSON.parse(JSON.stringify(app.todos)));
    }
  });
});