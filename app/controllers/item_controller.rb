class ItemController < ApplicationController
	skip_before_action :verify_authenticity_token
	def new
		
	end

	def create
		item = Item.new(items_params)

		if item.save
		  	p "@"*50
		  	p "Salvou! #{item.name}"
		  	p "@"*50

		  	render json: { item: item }
		else
		  	p "@"*100
		  	p "ERRO! #{item.errors}"
		  	p "@"*100
		  	render json: { error: item.errors}
		end

	end

	#POST /items/:id
	def showItemsSelected
	  	list_id = params[:id]

		if list_id.present?
			items = Item.where(:list_id => list_id)
			render json: { itemsSelected: items }
		else
			puts "ERRO!"
			render json: { error: list_id.error }
		end
		
	end

	private
		def items_params
			params.require(:item).permit(:name, :list_id)
		end
end
