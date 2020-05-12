class List
  include Mongoid::Document
  field :name, type: String

  validates :name, :uniqueness => {:case_sensitive => false}
  validates_presence_of :name
  validates_uniqueness_of :name

  has_many :item, dependent: :destroy
end
