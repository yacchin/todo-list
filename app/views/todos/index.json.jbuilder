json.array!(@todos) do |todo|
  json.extract! todo, :id, :content, :category_id, :user_id, :done, :priority
  json.url todo_url(todo, format: :json)
end
