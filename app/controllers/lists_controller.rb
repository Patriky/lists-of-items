class ListsController < ApplicationController
	skip_before_action :verify_authenticity_token
	before_action :load_list, only:[:update, :get_list, :destroy]

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
	  	p "Editado! #{@list.name}"
	  	if @list.update(lists_params)
	  		render json: { list: @list, str: "Salvou - Retornando ao front-end"}
	  	else 
	  		render json: { error: @list.errors }
	  	end		
	end


	def create
		@list = List.new(lists_params)

		respond_to do |format|
		  if @list.save
		  	p "Salvou! #{@list.name}"
		    format.html { redirect_to action: "index" }
		    #format.json { render :show, status: :created, location: @list }
		  else
		  	p "Não salvou! #{@list.name}"
		 	format.html { redirect_to action: "index" }
		  end
		end
	end

	def destroy

		items = Item.where("list_id = " + @list._id )
		#items.each { |item| p item}	


		#@list.destroy

		#Só estava essa linha. Trocar tbm o routes e o listController_controller
		@list.destroy
	end


	private
		def load_list
			@list = List.find(params[:list_id])
		end
		def lists_params
			params.require(:list).permit(:name)
		end

end
