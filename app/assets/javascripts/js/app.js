var app = app || {};
var todos = [];

(function() {
  'use strict';
  app.Todo = Backbone.Model.extend({
    defaults: {
      content: '',
      completed: false
    },
    toggle: function() {
      this.set('completed', !this.get('completed'));
    },
    storage: function() {
      app.todos = app.today.toJSON().concat(app.later.toJSON()).concat(app.schedule.toJSON());
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

      // ajax vers
      var JSONdata = {
        api_key: gon.current_user_api_key,
        todos: JSON.parse(JSON.stringify(app.todos))
      };
      console.log(JSONdata);

      $.ajax({
        type: 'post',
        //url: 'http://ancient-chamber-4185.herokuapp.com/api.json',
        url: 'http://192.168.56.101:3000/api.json',
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
      var num = 0;
      var collection = this.model.collection;
      this.model.destroy();
      collection.each(function(todo) {
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
      this.model.collection.each(function(todo) {
        if (todo.get('order') == startOrder) {
          todo.set('order', endOrder);
        } else if (todo.get('order') >= loopstart && todo.get('order') <= loopend) {
          todo.set('order', (+todo.get('order') + sortNum));
        }
      }, this);
      this.model.collection.sort();
    }
  });
})($);

(function($) {
  'use strict';
  app.CardView = Backbone.View.extend({
    tagName: 'section',
    className: 'card',
    template: _.template($('#card-template').html()),
    events: {
      'tap .add-button': 'create',
      'tap .todo-list': 'createByList'
    },
    initialize: function(collection, category) {
      var categoryName = ['today', 'later', 'schedule'];
      this.collection = collection;
      this.$el.html(this.template({
        category: category,
        categoryName: categoryName[category]
      }));
      this.$el.addClass(categoryName[category]);
      $('#todoapp').append(this.el);

      this.listenTo(collection, 'add', this.addOne);
      this.listenTo(collection, 'sort', this.addAll);
      this.collection.sort();
    },
    addAll: function() {
      this.$el.children('.todo-list').html('');
      this.collection.each(this.addOne, this);
    },
    addOne: function(todo) {
      var view = new app.TodoView({
        model: todo
      });
      this.$el.children('.todo-list').append(view.render().el);
    },
    newAttributes: function(evt) {
      return {
        content: '',
        completed: false,
        order: this.collection.nextOrder(),
        category_id: $(evt.target).attr('data-category')
      };
    },
    create: function(evt) {
      this.collection.add(this.newAttributes(evt));
      $(this.$el.find('label')[this.$el.find('label').length - 1]).trigger('tap');
    },
    createByList: function(evt) {
      $($('.add-button')[$(evt.target).attr('data-category')]).trigger('tap');
    }
  });
})($);

(function($) {
  'use strict';
  app.AppView = Backbone.View.extend({
    el: '#todoapp',
    initialize: function() {
      var TodayView = new app.CardView(app.today, 0);
      var LaterView = new app.CardView(app.later, 1);
      var ScheduleView = new app.CardView(app.schedule, 2);
    }
  });
})($);

var ENTER_KEY = 13;
$(function() {
  'use strict';
  var JSONdata = {
    api_key: gon.current_user_api_key
  };
  $.ajax({
    type: 'post',
    //url: 'http://ancient-chamber-4185.herokuapp.com/api.json',
    url: 'http://192.168.56.101:3000/api.json',
    data: JSON.stringify(JSONdata),
    contentType: 'application/JSON',
    dataType: 'json',
    scriptCharset: 'utf-8',
    // aync: false,
    success: function(data) {
      console.log('success', data);
      var Todos = Backbone.Collection.extend({
        model: app.Todo,
        nextOrder: function() {
          return (!this.length) ? 0 : this.length;
        }
      });
      todos = (data) ? data : JSON.parse(localStorage.getItem('todos'));
      app.today = new Todos(todos.filter(function(todo) {
        return todo.category_id == 0;
      }));
      app.later = new Todos(todos.filter(function(todo) {
        return todo.category_id == 1;
      }));
      app.schedule = new Todos(todos.filter(function(todo) {
        return todo.category_id == 2;
      }));
      app.today.comparator = app.later.comparator = app.schedule.comparator = function(model) {
        return model.get('order');
      };

      var AppView = new app.AppView();
    }
  });
});
