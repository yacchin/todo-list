Rails.application.config.middleware.use OmniAuth::Builder do
  provider :twitter, Settings.twitter.consumer_key, Settings.twitter.consumer_secret
  provider :github, Settings.github.consumer_key, Settings.github.consumer_secret
end

