class List
  include Mongoid::Document
  field :name, type: String

  has_many :item
end
