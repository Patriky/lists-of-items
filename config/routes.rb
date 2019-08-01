Rails.application.routes.draw do
	root "lists#index"

	get "lists/new" => "lists#new"
	post "lists" => "lists#create"

	get 'items/:id' => "item#showItemsSelected"
	post "items" => "item#create"

end
