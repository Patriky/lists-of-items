class Item
  include Mongoid::Document
  field :name, type: String
  
  belongs_to :list
end
