class List
  include Mongoid::Document
  field :name, type: String

  validates :name, :uniqueness => {:case_sensitive => false}
  validates_presence_of :name, message: "Insira uma lista"
  validates_uniqueness_of :name, message: 'Já existe'

  has_many :item, dependent: :destroy
end
