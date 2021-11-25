class Item
  include Mongoid::Document
  
  field :name, type: String
  field :is_done, type: Boolean
  field :progress, type: Integer
  field :created_at, type: Date
  field :deadline, type: Date
  field :priority, type: String
  field :assignee, type: String
  field :note, type: String
  
  belongs_to :list
end
