class ItemController < ApplicationController
	skip_before_action :verify_authenticity_token
	before_action :load_item, only: [:update, :destroy, :get_item]
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

	#POST /items/:item_id
	def showItemsSelected
	  	list_id = params[:list_id]

		if list_id.present?
			items = Item.where(:list_id => list_id)
			render json: { itemsSelected: items }
		else
			puts "ERRO!"
			render json: { error: list_id.error }
		end
		
	end


	def update

	  	if @item.update(items_params)
	  		render json: { item: @item, str: "Salvou - Retornando ao front-end"}
	  	else 
	  		render json: { error: @item.error, str: "NÃO SALVOU - Retornando ao front-end"}
	  	end

	end

	def get_item
		render json: { item: @item}
	end

	def destroy
		@item.destroy
	end

	private
	    def load_item
	      @item = Item.find(params[:item_id])
	    end

		def items_params
			params.require(:item).permit(:name, :list_id)
		end
end
