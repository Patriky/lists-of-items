class ListsController < ApplicationController

	def index
		@lists = List.all
		@list = List.new
		@items = Item.all
		@item = Item.new
	end

	def new
	end

	def create
		@list = List.new(lists_params)

		respond_to do |format|
		  if @list.save
		  	p "@"*100
		  	p "Salvou! #{@list.name}"
		  	p "@"*100
		    format.html { redirect_to action: "index" }
		    #format.json { render :show, status: :created, location: @list }
		  else
		    format.html { render :new }
		    format.json { render json: @list.errors, status: :unprocessable_entity }
		  end
		end
	end

	private
		def lists_params
			params.require(:list).permit(:name)
		end

end
