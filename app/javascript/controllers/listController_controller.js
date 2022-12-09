import { Controller } from 'stimulus'

export default class extends Controller {

	static targets = ['results', 'inputNewItemName', 'alerts', 'modalAlerts', 'inputItemName', 'inputItemId', 'inputListName', 'inputListId','inputListNameEdit', "isDone", "inputProgress", "inputDeadline", "inputPriority", "inputNote", "inputCreated", "inputAssignee", "inputEstimatedTime"]

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
			var priority = select.options[select.selectedIndex].getAttribute("inputPriority");
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
					var checked = ""
					var done = ""
					var color = ""
					//var valuenow = 3
					if (item.is_done) {
						checked = " checked ";
						color = "#E5F6BB"; 
						done = "table-success";
						//valuenow = 100;

					}

					const d = new Date();
					if(!item.is_done && d.toISOString() > item.deadline){ 
						color = "#F6BBBB"

					}

					listItemHtml += `<tr data-item-id="${item._id.$oid}" style='background-color: ${color}' >`
					listItemHtml += `<td><input type="checkbox" name="isDone" data-target="listController.isDone" data-action="listController#selectionItem" item-id="${item._id.$oid}" ${checked} class="custom-control-input"></td> `
					listItemHtml += `<td><label> ${item.name} </label></td> `
					// listItemHtml += `<td>`
					// listItemHtml += `<div class="progress" style="width: 100px">`
					// listItemHtml += `<div class="progress-bar" role="progressbar" style="width:${item.progress ? item.progress : 10}%" aria-valuenow="${item.progress ? item.progress : 10}" aria-valuemin="0" aria-valuemax="100"></div>`
					// listItemHtml += `</div>`
					// listItemHtml += `</td>`
					listItemHtml += `<td name="inputProgress" style="width: 150px"> <input type="range" class="form-control-range" id="formControlRange"  min="0" max="100" item-id="${item._id.$oid}" step="25" value="${item.progress ? item.progress : 0}" data-target="listController.inputProgress" data-action="click->listController#updateProgress" </td>` 
					listItemHtml += `<td name="inputCreated" item-id="${item._id.$oid}">${item.created_at ? item.created_at : ''} </td>`
					listItemHtml += `<td name="inputAssignee" item-id="${item._id.$oid}">${item.assignee ? item.assignee : ''} </td>`
					listItemHtml += `<td name="inputDeadline" item-id="${item._id.$oid}">${item.deadline ? item.deadline : ''} </td>`
					listItemHtml += `<td style="text-align: center;" name="inputEstimatedTime" item-id="${item._id.$oid}">${item.estimated_time ? item.estimated_time : ''} </td>`
					listItemHtml += `<td name="inputPriority" item-id="${item._id.$oid}">${item.priority ? item.priority : ''} </td>`
					listItemHtml += `<td><button type="button" name="editBt" data-action="click->listController#showItemDialog" item-id="${item._id.$oid}" class="btn btn-info">Details</td>`
					// listItemHtml += `<td><button name="deleteBt" data-action="click->listController#showItemDialog" item-id="${item._id.$oid}" class="btn btn-danger btn-sm">Delete</td>`

					// // Se no banco estiver true, concatena checked no html para que fique setado o checkbox
					// if (item.is_selected) {
					// 	listItemHtml += " checked "
					// }
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
		const d = new Date();
		var data = {
			is_done: checkedValue
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
			if(response.item.is_done){
				var color = '#E5F6BB'
			}
			else{
				if (d.toISOString() > response.item.deadline){
					var color = "#F6BBBB"
				}else{
					var color = 'transparent'
				}
			}
			$(`#tableItems tr[data-item-id="${item_id}"]`).css('background-color', `${color}`);
			
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
			var created_at = new Date();
			let data = {
				name: this.inputNewItemNameTarget.value,
				list_id: idListSelected,
				created_at: created_at,
				progress: 0
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
								var today = new Date();
								var create_at = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
								// var deadline = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+(today.getDate() + 7);

								this.showAlerts("create-success", false);
								//this.showAllItems()
								var listItemHtml = ""
								listItemHtml += `<tr data-item-id="${response.item._id.$oid}">`
								listItemHtml += `<td><input item-id="${response.item._id.$oid}" type="checkbox" name="isDone" data-target="listController.isDone" data-action="listController#selectionItem" class="custom-control-input"></td> `
								listItemHtml += `<td><label item-id="${response.item._id.$oid}"> <strong> ${response.item.name} </strong>   </td>`
								
								listItemHtml += `<td style="width: 150px"><input item-id="${response.item._id.$oid}" type="range" class="form-control-range" id="formControlRange" min="0" max="100" value=0 data-target="listController.inputProgress" data-action="click->listController#updateProgress"> </td>`
								listItemHtml += `<td item-id="${response.item._id.$oid}">${create_at} </td>`
								listItemHtml += `<td></td>`
								listItemHtml += `<td item-id="${response.item._id.$oid}"></td>`
								listItemHtml += `<td name="inputEstimatedTime" item-id="${response.item._id.$oid}"></td>`
								listItemHtml += `<td name="inputPriority" item-id="${response.item._id.$oid}"></td>`
								listItemHtml += `<td><button item-id="${response.item._id.$oid}" type="button" name="editBt" data-action="click->listController#showItemDialog" class="btn btn-info">Details</td>`
								// listItemHtml += `<td><button item-id="${response.item._id.$oid}" type="button" name="deleteBt" data-action="click->listController#showItemDialog" class="btn btn-danger btn-sm">Delete</td>`
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

	saveItemEdited(item_id){
		var existe = false
		

		// console.log(this.inputItemNameTarget.value)
		// console.log(this.inputProgressTarget.value)
		// console.log(this.inputDeadlineTarget.value)
		// console.log(this.inputPriorityTarget.value)
		// console.log(this.inputNoteTarget.value)
		// console.log(this.inputAssigneeTarget.value)
		// console.log(this.inputEstimatedTimeTarget.value)


		if (this.inputItemNameTarget.value < 1) {
			this.showAlerts("empty", true)
		} else {
			this.resultsTargets.forEach((item) => {
				console.log(item)
				// var strong = item.querySelectorAll("strong")
				// strong.forEach((item) => {
				// 	if(item.innerText.toUpperCase() === this.inputItemNameTarget.value.toUpperCase()){
				// 		existe = true;
				// 	}
				// })
				// if (existe == true) {
				// 	this.showAlerts("exist",true)			
				// } else {

					var itemId = this.inputItemIdTarget.value
					console.log(this.inputItemNameTarget.value)
					console.log(this.inputProgressTarget.value)
					let data = {
						name: `${this.inputItemNameTarget.value}`,
						progress: `${this.inputProgressTarget.value}`,
						deadline: `${this.inputDeadlineTarget.value}`,
						priority: `${this.inputPriorityTarget.value}`,
						note: `${this.inputNoteTarget.value}`,
						assignee: `${this.inputAssigneeTarget.value}`,
						estimated_time: `${this.inputEstimatedTimeTarget.value}`
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
				// }
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
				// this.testeProgressTarget.value = "testando"
				// console.log(this.testeProgressTarget.value)
				//this.inputProgressTarget.value = response.item.progress
				if(response.item.progress){
					this.inputProgressTarget.value = response.item.progress
					document.getElementById("progress").innerHTML = response.item.progress
				}else{
					document.getElementById("progress").innerHTML = 0
				}

				if(response.item.deadline){
					this.inputDeadlineTarget.value = response.item.deadline
				}else{
					this.inputDeadlineTarget.value = ""
				}

				if(response.item.priority){
					this.inputPriorityTarget.value = response.item.priority
				}else{
					this.inputPriorityTarget.value = ""
				}

				if(response.item.note){
					this.inputNoteTarget.value = response.item.note
				}else{
					this.inputNoteTarget.value = ""
				}

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
		var answer = window.confirm("REALLY?") // Pensar em um modal de confirmação
		if(answer){
			fetch(`/item/${itemId}`,{
				method: 'DELETE'
			}).then(response =>{
				// $('#modalDeleteItem').modal('toggle');
				//this.showAllItems()

				//Remove a specific row 
				$(`#tableItems tr[data-item-id="${itemId}"]`).remove()
				this.showAlerts('delete', false)
			})
		}
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


		// listItemHtml = `<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">`
		// 	listItemHtml += `<div class="toast-header">`
		// 		listItemHtml += `<button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">`
		// 			listItemHtml += `<span aria-hidden="true">&times;</span>`
		// 		listItemHtml += `</button>`
		// 	listItemHtml += `</div>`
		// 	listItemHtml += `<div class="toast-body">`
		// 		listItemHtml += `Hello, world! This is a toast message.`
		// 	listItemHtml += `</div>`
		// listItemHtml += `</div>`

		listItemHtml = `<div id= "alert" class="alert ${alertType} style="position: relative; min-height: 200px;" ">${message} `
		listItemHtml += "<button type='button' class='close' data-dismiss='alert'>"
		listItemHtml += "<span aria-hidden='true'>&times;</span>"
		listItemHtml += "</button>"
		listItemHtml += "</div>"

		setTimeout(function () { $('#alert').hide(); }, 2500); // O valor é representado em milisegundos.

		if (isModal == true) {
			this.modalAlertsTarget.innerHTML = listItemHtml

		} else {
			this.alertsTarget.innerHTML = listItemHtml
		}
	}


	updateProgress(e){
		var progressValue = e.target.value
		let item_id = e.target.getAttribute("item-id");
		var url = `items/${item_id}`

		var data = {
			progress: progressValue
		}

		fetch(url,{
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
			//console.log(response.item.progress);
		})


	}
}