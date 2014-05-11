json.array!(@todos) do |todo|
  json.extract! todo, :id, :content, :category_id, :user_id, :completed, :order
  json.url todo_url(todo, format: :json)
end
