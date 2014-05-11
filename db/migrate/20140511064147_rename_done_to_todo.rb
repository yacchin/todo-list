class RenameDoneToTodo < ActiveRecord::Migration
  def change
  	rename_column :todos, :done, :completed
  	rename_column :todos, :priority, :order
  end
end
