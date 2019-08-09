import { Controller } from 'stimulus'

export default class extends Controller {

	static targets = ['results', 'inputNewItemName', 'alerts', 'modalAlerts', 'inputItemName', 'inputItemId', 'inputListName', 'inputListId']

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
					listItemHtml += `</tr>`
				})
				this.resultsTarget.innerHTML = listItemHtml
			} else {
				this.resultsTarget.innerHTML = "<p>Vazio... </p>"
			}
		});

	}

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
				$('#divNewList').hide()
				$("#tableItems").hide()
				$("#selectList").hide()
				$('#divEditList').show()
				this.inputListNameTarget.value = response.list.name
			} else {
				console.log("Não encontrado")
			}
		})
	}

	saveListEdited(){
		var exist = false
		var inputListName = this.inputListNameTarget.value

		if (inputListName < 1 ) {
			this.showAlerts('empty', false)
		} else {
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
						console.log("Editado com sucesso: " + response.list.name)
					} else {
						console.log("Error: " + response.error)
					}
				})

				this.showAlerts("edit-success", false)
				this.showDivTableSelect()
			}
		}
	}

	showDivTableSelect(){
		$('#divEditList').hide()		
		$('#divNewList').show()
		$("#tableItems").show()
		$("#selectList").show()
	}

	createItem(){
		var selectSelected = document.getElementById("selectList");
		var exist = false;
		try{
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
								this.showAllItems()
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
		fetch(`/item/${this.inputItemIdTarget.value}`,{
			method: 'DELETE'
		}).then(response =>{
			$('#modalDeleteItem').modal('toggle');
			this.showAllItems()
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

		listItemHtml = `<div class='alert ${alertType} '>${message}`
		listItemHtml += "<button type='button' class='close' data-dismiss='alert' aria-label='Fechar'>"
		listItemHtml += "<span aria-hidden='true'>&times;</span>"
		listItemHtml+= "</button>"
		listItemHtml += "</div>"

		if (isModal == true) {
			this.modalAlertsTarget.innerHTML = listItemHtml

		} else {
			this.alertsTarget.innerHTML = listItemHtml
		}
	}
}