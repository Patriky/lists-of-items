class Item
  include Mongoid::Document
  field :name, type: String
  field :is_selected, type: Boolean
  
  belongs_to :list
end
