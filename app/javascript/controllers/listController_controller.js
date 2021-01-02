import { Controller } from 'stimulus'

export default class extends Controller {

	static targets = ['results', 'inputNewItemName', 'alerts', 'modalAlerts', 'inputItemName', 'inputItemId', 'inputListName', 'inputListId','inputListNameEdit', "isSelected"]

	connect(){
		//console.log("Conected..")
	}
	showAllItems(e){
		var url = ""

		//Se o metodo foi chamado por outra função que não seja o click (através do deleteItem()) por exemplo, o evento vem como undefined
		if (e == undefined) {
			//Faz a mesma coisa que pegar o id através do e.target.
			var select = document.getElementById("selectList");
			var listId = select.options[select.selectedIndex].getAttribute("data-list-id");
			url = `/items/${listId}`
		} else {
			//get list_id selected in <select>
			let listId = e.target.getAttribute("data-list-id")
			url = `/items/${listId}`

		}

		fetch(url, {
			method: "GET"
		})
		.then(response => {
			return response.json();
		})
		.then(response => {
			//console.log(response);
			//$("#results p").remove(); //jquery code for clean p tag

			//this.resultsTarget.innerHTML = "" //clean tag
			var listItemHtml = ""
			if (response.itemsSelected.length > 0){
				response.itemsSelected.forEach((item) => {
					listItemHtml += `<tr data-item-id="${item._id.$oid}"> <td><strong> ${item.name} </strong> </td>`
					listItemHtml += `<td><button type="button" name="editBt" data-action="click->listController#showItemDialog" item-id="${item._id.$oid}" class="btn btn-warning btn-sm">Editar</td>`
					listItemHtml += `<td><button name="deleteBt" data-action="click->listController#showItemDialog" item-id="${item._id.$oid}" class="btn btn-danger btn-sm">Excluir</td>`
					listItemHtml += `<td><input type="checkbox" name="isSelected" data-target="listController.isSelected" data-action="listController#selectionItem" item-id="${item._id.$oid}" `

					// Se no banco estiver true, concatena checked no html para que fique setado o checkbox
					if (item.is_selected) {
						listItemHtml += " checked "
					}

					listItemHtml += `class="custom-control-input"><strong> Concluída</strong></td>`
					listItemHtml += `</tr>`
				})
				this.resultsTarget.innerHTML = listItemHtml
			} else {
				this.resultsTarget.innerHTML = "<p>Vazio... </p>"
			}

		});
	}

	//Ao clicar 2 vezes em algum option, o e.target pega o id clicado
	editListSelected(event){
		var listId = event.target.getAttribute("data-list-id")
		this.inputListIdTarget.value = listId
		fetch(`list/${listId}`,{
			method: "GET"
		})
		.then(response => {
			return response.json()
		})
		.then(response =>{
			if (response.list) {
//				$('#divNewList').hide()
//				$("#tableItems").hide()
//				$("#selectList").hide()
//				$('#divEditList').show()
				$('#divDeleteList').show()

				//Preenche o input com o nome dentro do modal
				this.inputListNameEditTarget.value = response.list.name
				$("#modalEditList").modal();
				$('#inputListNameEdit').select()
			} else {
				console.log("Não encontrado")
			}
		})
	}

	//É chamado após clicar em Salvar, dentro do modal.
	saveListEdited(){
		var exist = false
		var inputListName = this.inputListNameEditTarget.value
		var inputListId =  this.inputListIdTarget.value

		if (inputListName < 1 ) {
			this.showAlerts('empty', false)
		} else {
			//Verifica se já existe algum option com o mesmo nome dentro do select
			$('#selectList').find('option').each(function(){
				if (inputListName.toUpperCase() == $(this).val().toUpperCase()) {
					exist = true
				}
			})

			if (exist == true) {
				this.showAlerts("exist", false)
			} else {

				var data = {
					name: inputListName
				}

				fetch(`list/${this.inputListIdTarget.value}`, {
					method: 'POST',
					//Content Negotiation 
					headers: {
						'Content-Type': 'application/json',
						'X-CSRF-Token': Rails.csrfToken()
					},
					body: JSON.stringify(data)
				})
				.then(response => {
					return response.json()
				})
				.then(response => {
					if (response.list) {
						//Procura pelo option editado e seta o texto com o response.list.name
						$('#selectList').find('option').each(function(){
							if ($(this).attr("data-list-id") == inputListId) {
								//console.log($(this).attr("data-list-id"))
								$(this).text(response.list.name)
							}
						})
						$('#modalEditList').modal('toggle');
						this.showAlerts("edit-success", false)
						this.showGridDefault()

					} else {
						this.showAlerts("serverError", false)
						console.log("Error: " + response.error)
					}
				})

			}
		}
	}


	selectionItem(e){
		var checkedValue = e.target.checked;

		let item_id = e.target.getAttribute("item-id");

		var url = `items/${item_id}`;

		var data = {
			is_selected: checkedValue
		}

		fetch(url, {
			method: "POST",
			//Content Negotiation 
			headers: {
				'Content-Type': 'application/json',
				'X-CSRF-Token': Rails.csrfToken()
			},
			body: JSON.stringify(data)
		})
		.then(response => {
			return response.json()
		})
		.then(response =>{
			//console.log(response.item.is_selected);
		})
	}



	showGridDefault(){
		$('#divEditList').hide()		
		$('#divDeleteList').hide()
		$('#divNewList').show()
		$("#tableItems").show()
		$("#selectList").show()
	}

	createItem(){
		var selectSelected = document.getElementById("selectList");
		var exist = false;
		try{
			//Verifica qual option está selecionado. 
			var idListSelected = selectSelected.options[selectSelected.selectedIndex].getAttribute("data-list-id");
			//console.log("ID: " + idListSelected)
			//console.log("Item: " + this.newItemTarget.value)

			let data = {
				name: this.inputNewItemNameTarget.value,
				list_id: idListSelected
			}

			this.resultsTargets.forEach((tbodyRow) => {
				var strong = tbodyRow.querySelectorAll("strong")
				strong.forEach((item) => {
					if(item.innerText.toUpperCase() === this.inputNewItemNameTarget.value.toUpperCase()){
						exist = true;
					}
				})	
				if (exist == true) {

					this.showAlerts("exist", false)

				}else{
					if (this.inputNewItemNameTarget.value<1) {

						this.showAlerts("empty", false)

					} else {
						fetch(`/items`,{
							method: 'POST',
							//Content Negotiation 
							headers: {
								'Content-Type': 'application/json',
								'X-CSRF-Token': Rails.csrfToken()
							},
							body: JSON.stringify(data)
						})
						.then(response => {
							return response.json()
						})
						.then(response => {
							if (response.item) {

								this.showAlerts("create-success", false);
								//this.showAllItems()
								var listItemHtml = ""
								listItemHtml += `<tr data-item-id="${response.item._id.$oid}"> <td><strong> ${response.item.name} </strong> </td>`
								listItemHtml += `<td><button type="button" name="editBt" data-action="click->listController#showItemDialog" item-id="${response.item._id.$oid}" class="btn btn-warning btn-sm">Editar</td>`
								listItemHtml += `<td><button type="button" name="deleteBt" data-action="click->listController#showItemDialog" item-id="${response.item._id.$oid}" class="btn btn-danger btn-sm">Excluir</td>`
								listItemHtml += `<td><input type="checkbox" name="isSelected" data-target="listController.isSelected" data-action="listController#selectionItem" item-id="${response.item._id.$oid}" class="custom-control-input"><strong> Concluída</strong></td>`
								listItemHtml += `</tr>`

								//console.log(this.resultsTarget.innerHTML)
								//console.log(this.resultsTarget.innerText)
								if (this.resultsTarget.innerText.length > 8) {
									this.resultsTarget.innerHTML += listItemHtml
								} else {
									this.resultsTarget.innerHTML = listItemHtml
								}
							}
							else{
								this.showAlerts("serverError", false)
							}
						})
					}
				}			
			})
			this.inputNewItemNameTarget.value = ""
		} catch(e){
			this.showAlerts("emptyList", false)
		}
	}

	saveItemEdited(){
		var existe = false

		if (this.inputItemNameTarget.value < 1) {
			this.showAlerts("empty", true)
		} else {
			this.resultsTargets.forEach((item) => {
				var strong = item.querySelectorAll("strong")
				strong.forEach((item) => {
					if(item.innerText.toUpperCase() === this.inputItemNameTarget.value.toUpperCase()){
						existe = true;
					}
				})
				if (existe == true) {
					this.showAlerts("exist",true)			
				} else {

					var itemId = this.inputItemIdTarget.value
					let data = {
						name: `${this.inputItemNameTarget.value}`
					}

					fetch(`/items/${itemId}`,{
						method: 'POST',
						//Content Negotiation 
						headers: {
							'Content-Type': 'application/json',
							'X-CSRF-Token': Rails.csrfToken()
						},
						body: JSON.stringify(data)
					})
					.then(response => {
						return response.json()
					})
					.then(response => {
						if (response.error) {
							console.log("Erro no banco")
						} else {
							$('#modalEditItem').modal('toggle');
							this.showAllItems()
							this.showAlerts("edit-success", false)
						}
					})					
				}
			})				
		}
	}

	showItemDialog(e){
		let itemId = e.target.getAttribute("item-id")
		this.inputItemIdTarget.value = itemId
		

		if (e.target.getAttribute("name") === "editBt") {
			fetch(`/item/${itemId}`,{
				method: 'GET',
			}).then(response =>{
				return response.json()
			}).then(response => {
				//preenche o input no modal com no nome
				this.inputItemNameTarget.value = response.item.name
				//chamar modal
				$('#modalEditItem').modal()

			})
		} else {
			if (e.target.getAttribute("name") === "deleteBt") {
				$('#modalDeleteItem').modal()
			} else {
				console.log("ERRO")
			}
		}
	}

	deleteItem(){
		var itemId = this.inputItemIdTarget.value
		fetch(`/item/${itemId}`,{
			method: 'DELETE'
		}).then(response =>{
			$('#modalDeleteItem').modal('toggle');
			//this.showAllItems()

			//Remove a specific row 
			$(`#tableItems tr[data-item-id="${itemId}"]`).remove()
			this.showAlerts('delete', false)
		})
	}

	deleteList(){
		var listId = this.inputListIdTarget.value
		fetch(`/teste/${listId}`,{  // /list/${listId}
			method: 'GET' // DELETE
		}).then(response =>{
			//this.showAllItems()
			this.showGridDefault()
			//this.showAllItems()

			//Remove a specific row
			$(`#selectList option[data-list-id="${listId}"]`).remove()
			this.showAlerts('delete', false)
		})		
	}

	showAlerts(type, isModal){
		var listItemHtml = ""
		var alertType = ""
		var message = ""

		switch (type){
			case 'empty':
				alertType = "alert-warning"
				message = "Campo vazio!"
				break;

			case 'emptyList':
				alertType = "alert-warning"
				message = "Selecione uma lista e insira um item!"
				break;

			case 'create-success':
				alertType = "alert-success"
				message = "Cadastrado com sucesso!"
				break;

			case 'edit-success':
				alertType = "alert-success"
				message = "Editado com sucesso!"
				break;

			case 'exist':
				alertType = "alert-warning"
				message = "Item já existente!"
				break;

			case 'delete':
				alertType = "alert-danger"
				message = "Item deletado!"
				break;

			case 'serverError':
				alertType = "alert-warning"
				message = "Erro inesperado no servidor. Atualize a página e tente novamente"
				break;

			default:
				console.log('Sorry');
		}

		listItemHtml = `<div id= "alert" class="alert ${alertType} ">${message}`
		listItemHtml += "<button type='button' class='close' data-dismiss='alert'>"
		listItemHtml += "<span aria-hidden='true'>&times;</span>"
		listItemHtml+= "</button>"
		listItemHtml += "</div>"

		setTimeout(function () { $('#alert').hide(); }, 2500); // O valor é representado em milisegundos.

		if (isModal == true) {
			this.modalAlertsTarget.innerHTML = listItemHtml

		} else {
			this.alertsTarget.innerHTML = listItemHtml
		}
	}
}