class Item
  include Mongoid::Document
  field :name, type: String
  field :is_done, type: Boolean
  field :progress, type: Integer
  field :deadline, type: Date
  field :created_at, type: Date
  
  belongs_to :list
end
