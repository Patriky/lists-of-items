class ListsController < ApplicationController
	before_action :load_list, only:[:update, :get_list]

	def index
		@lists = List.all
		@list = List.new
	end

	def new
	end

	#GET list/:list_id
	def get_list
		render json: { list: @list }
	end

	def update
	  	p "@"*100
	  	p "Editado! #{@list.name}"
	  	p "@"*100		
	  	if @list.update(lists_params)
	  		render json: { list: @list, str: "Salvou - Retornando ao front-end"}
	  	else 
	  		render json: { error: @list.error }
	  	end		
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
		 	render json: { error: @list.error}
		  end
		end
	end

	private
		def load_list
			@list = List.find(params[:list_id])
		end
		def lists_params
			params.require(:list).permit(:name)
		end

end
