# Be sure to restart your server when you modify this file.

# Your secret key is used for verifying the integrity of signed cookies.
# If you change this key, all old signed cookies will become invalid!

# Make sure the secret is at least 30 characters and all random,
# no regular words or you'll be exposed to dictionary attacks.
# You can use `rake secret` to generate a secure secret key.

# Make sure your secret_key_base is kept private
# if you're sharing your code publicly.
#TodoApi::Application.config.secret_key_base = 'b74696cf3ee50ddb30eb1719b3f98683b2eaaefa02cf713f426273fb3d1172442ffb095e363e97ab8db358eb52142e3a2e26bf74f6becab29eccae76e157c90d'

def secure_token
  ((0..9).to_a + ("a".."z").to_a + ("A".."Z").to_a).sample(50).join
end

TodoApi::Application.config.secret_key_base = secure_token