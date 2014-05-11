class CreateTodos < ActiveRecord::Migration
  def change
    create_table :todos do |t|
      t.string :content
      t.references :category, index: true
      t.references :user, index: true
      t.boolean :done
      t.integer :priority

      t.timestamps
    end
  end
end
