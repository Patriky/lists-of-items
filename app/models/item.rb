class Item
  include Mongoid::Document
  field :name, type: String
  field :is_done, type: Boolean
  field :progress, type: Integer
  
  belongs_to :list
end
