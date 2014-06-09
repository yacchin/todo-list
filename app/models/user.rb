class User < ActiveRecord::Base
  def self.create_with_omniauth(auth)
    create!do |user|
      user.provider = auth["provider"]
      user.uid = auth["uid"]

      user.api_key = ((0..9).to_a + ("a".."z").to_a + ("A".."Z").to_a).sample(32).join

      user.name = auth["extra"]["access_token"].params[:screen_name] if user.provider == "twitter"
      user.name = auth["extra"]["raw_info"]["login"] if user.provider == "github"
    end
  end
end
