json.array!(@users) do |user|
  json.extract! user, :id, :name, :password, :api_key
  json.url user_url(user, format: :json)
end
