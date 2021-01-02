Rails.application.routes.draw do
	root "lists#index"
	get "lists" => "lists#index"

	get "lists/new" => "lists#new"
	post "lists" => "lists#create"
	get "list/:list_id" => "lists#get_list"
	post 'list/:list_id' => "lists#update"
	delete 'list/:list_id' => "lists#destroy"


	#Return all items of list selected
	get 'items/:list_id' => "item#showItemsSelected"
	#Route for just one item
	get 'item/:item_id' => "item#get_item"
	post 'items/:item_id' => "item#update"
	delete 'item/:item_id' => "item#destroy"


	get 'teste/:list_id' => "lists#destroy"

	#Create new item
	post "items" => "item#create"


	get "sobre" => "sobre#index"

end
