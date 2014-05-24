require "spec_helper"

describe TodosController do
  describe "routing" do
    it "routes to post #api" do 
      #delete("/todos/1").should route_to("todos#destroy", :id => "1")
      post("/api").should nil
    end

    it "routes to get #api" do 
      #delete("/todos/1").should route_to("todos#destroy", :id => "1")
      get("/api").should nil
    end
  end
end
