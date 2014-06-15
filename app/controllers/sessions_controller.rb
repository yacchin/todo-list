class SessionsController < ApplicationController
  def create
    auth = request.env["omniauth.auth"]
    user = User.find_by_provider_and_uid(auth["provider"], auth["uid"]) || User.create_with_omniauth(auth)
    session[:user_id] = user.id
    redirect_to_todos
  end

  def destroy
    session[:user_id] = nil
    redirect_to :action => 'new'
  end

  def new
    redirect_to_todos if session[:user_id]
  end

  private
  def redirect_to_todos
    redirect_to :controller => 'todos', :action => 'index'
  end

end
