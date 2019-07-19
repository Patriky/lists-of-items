Rails.application.routes.draw do
	root "lists#index"

	get "lists/new" => "lists#new"
	post "lists" => "lists#create"

	post "items" => "item#create" 
end
