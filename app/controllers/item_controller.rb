class ItemController < ApplicationController

	def new
		
	end

	def create
	  	p "@"*50
	  	p "ENTROU NO LIST/CREATE"
	  	p "@"*50		
		@item = Item.new(items_params)

		respond_to do |format|
			if @item.save
			  	p "@"*50
			  	p "Salvou! #{@item.name}"
			  	p "@"*50
			  	format.html { redirect_to root_path }
			else
			  	p "@"*100
			  	p "ERRO! #{@item.errors}"
			  	p "@"*100
			  	format.html { redirect_to root_path }				
			end

		end
	end

	private
		def items_params
			params.require(:item).permit(:name, :list_id)
		end
end
