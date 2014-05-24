class TodosController < ApplicationController
  skip_before_filter :verify_authenticity_token ,:only=>[:get_todo]
  before_action :set_todo, only: [:show, :edit, :update, :destroy]

  before_action :api_key_filter, only: [:get_todo]

  # GET /todos
  # GET /todos.json
  def index
    @todos = Todo.all
  end

  # GET /todos/1
  # GET /todos/1.json
  def show
  end

  # GET /todos/new
  def new
    @todo = Todo.new
  end

  # GET /todos/1/edit
  def edit
  end

  # POST /todos
  # POST /todos.json
  def create
    @todo = Todo.new(todo_params)

    respond_to do |format|
      if @todo.save
        format.html { redirect_to @todo, notice: 'Todo was successfully created.' }
        format.json { render action: 'show', status: :created, location: @todo }
      else
        format.html { render action: 'new' }
        format.json { render json: @todo.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /todos/1
  # PATCH/PUT /todos/1.json
  def update
    respond_to do |format|
      if @todo.update(todo_params)
        format.html { redirect_to @todo, notice: 'Todo was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: 'edit' }
        format.json { render json: @todo.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /todos/1
  # DELETE /todos/1.json
  def destroy
    @todo.destroy
    respond_to do |format|
      format.html { redirect_to todos_url }
      format.json { head :no_content }
    end
  end

  def get_todo
    user = get_user(params[:api_key])
    update_todos(params[:todo],user) unless params[:todo].blank?
    respond_to do |format| 
      format.json {render :json => get_todos(user).to_json}
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_todo
      @todo = Todo.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def todo_params
      params.require(:todo).permit(:content, :category_id, :user_id, :completed, :order)
    end

    def api_key_filter
      if get_user(params[:api_key]).nil?
        respond_to do |format| 
          format.json {render :json => nil}
        end
      end
    end

    def get_user(api_key)
      user = User.find_by_api_key(api_key)
    end

    def get_todos(user)
      Todo.where(user_id: user.id.to_i)
    end

    def update_todos(todos,user)
      # before insert todos
      before_todos = get_user_todo_ids(user)
      # insert update
      todos.each do |todo|
        unless todo["id"].nil?
          Todo.update(todo["id"], :content => todo["content"], :category_id => todo["category_id"], :completed => todo["completed"], :order => todo["order"])
        else
          Todo.create(:content => todo["content"], :category_id => todo["category_id"], :user_id => user.id, :completed => todo["completed"], :order => todo["order"])
        end
      end
      # delete
      delete_todos(before_todos,todos,user)
    end

    def delete_todos(before_todos,todos,user)
      delete_todo_ids = before_todos - get_sent_todo(todos)
      Todo.destroy(delete_todo_ids)
    end

    def get_user_todo_ids(user)
      todo_ids_array = []
      get_todos(user).each do |todo|
        todo_ids_array << todo.id
      end
      todo_ids_array
    end

    def get_sent_todo(sent_todos)
      todo_ids_array = []
      sent_todos.each do |todo|
        todo_ids_array << todo["id"]
      end
      todo_ids_array
    end
end
