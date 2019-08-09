Rails.application.routes.draw do
	root "lists#index"

	get "lists/new" => "lists#new"
	post "lists" => "lists#create"
	get "list/:list_id" => "lists#get_list"

	post 'list/:list_id' => "lists#update"

	#Return all items of list selected
	get 'items/:list_id' => "item#showItemsSelected"

	#Route for just one item
	get 'item/:item_id' => "item#get_item"
	
	post 'items/:item_id' => "item#update"

	delete 'item/:item_id' => "item#destroy"

	#Create new item
	post "items" => "item#create"

end
