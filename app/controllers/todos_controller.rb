class TodosController < ApplicationController
  skip_before_filter :verify_authenticity_token ,:only=>[:get_todo]
  before_action :set_todo, only: [:show, :edit, :update, :destroy]

  before_action :api_key_filter, only: [:get_todo,:update_todo]
  before_action :todo_filter, only: [:update_todo]

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
    unless user.nil?
      todos = Todo.where(user_id: user.id.to_i)
      respond_to do |format| 
        format.json {render :json => todos.to_json}
      end
    else
      respond_to do |format| 
        format.json {render :json => nil} and return
      end
    end
  end

  def update_todo
    todo = params[:todo]
    puts todo
    respond_to do |format| 
      format.json {render :json => nil}
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

    def todo_filter
      if params[:todo].nil?
        respond_to do |format| 
          format.json {render :json => nil}
        end
      end
    end

end
