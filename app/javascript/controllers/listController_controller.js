import { Controller } from 'stimulus'

export default class extends Controller {

	static targets = ['results', 'newItem', 'alerts']

	connect(){
		//console.log("Conected..")
	}
	selectList(e){
		e.preventDefault();
		let listId = e.target.getAttribute("data-list-id")

		fetch(`/items/${listId}`, {
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
				//listItemHtml = "<tr>"
				response.itemsSelected.forEach((item) => {
					listItemHtml += `<tr id="${item._id.$oid}"> <td><strong> ${item.name} </strong> </td>`
					listItemHtml += `<td><button type="button" data-toggle="modal" data-target="#ModalEditItem" class="btn btn-primary btn-sm">Editar</td>`
					listItemHtml += `<td><button class="btn btn-primary btn-sm">Excluir</td>`
					listItemHtml += `</tr>`
				})
				//listItemHtml += "</tr>"
				this.resultsTarget.innerHTML = listItemHtml
			} else {
				this.resultsTarget.innerHTML = "<p>Vazio... </p>"
			}
		});
	}

	createItem(){
		var e = document.getElementById("lista");
		var existe = false;
		try{
			var idList = e.options[e.selectedIndex].getAttribute("data-list-id");
			//console.log("ID: " + idList)
			//console.log("Item: " + this.newItemTarget.value)

			let data = {
				name: this.newItemTarget.value,
				list_id: idList
			}

			this.resultsTargets.forEach((item) => {
				var strong = item.querySelectorAll("strong")
				strong.forEach((item) => {
					if(item.innerText.toUpperCase() === this.newItemTarget.value.toUpperCase()){
						existe = true;
					}
				})	
				if (existe == true) {
					var listItemHtml = ""
					listItemHtml = "<div class='alert alert-warning'> Item já existente!"
					listItemHtml += "<button type='button' class='close' data-dismiss='alert' aria-label='Fechar'>"
					listItemHtml += "<span aria-hidden='true'>&times;</span>"
					listItemHtml += "</button>"
					listItemHtml += "</div>"

					this.alertsTarget.innerHTML = listItemHtml;

				}else{
					if (this.newItemTarget.value<1) {
						var listItemHtml = ""
						listItemHtml = "<div class='alert alert-warning'> Campo vazio. Insira um item!"
						listItemHtml += "<button type='button' class='close' data-dismiss='alert' aria-label='Fechar'>"
						listItemHtml += "<span aria-hidden='true'>&times;</span>"
						listItemHtml += "</button>"
						listItemHtml += "</div>"

						this.alertsTarget.innerHTML = listItemHtml;
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
								//var closest = this.resultsTarget.closest("ul")
								var tr = this.resultsTarget.querySelector("tr")

								if (tr !== null) {
									//Se tiver algum elemento
									var listItemHtml = ""
									listItemHtml += `<tr><td> <strong> ${response.item.name} </strong></td>`
									listItemHtml += `<td><button type="button" class="btn btn-primary btn-sm">Editar</td>`
									listItemHtml += `<td><button type="button" class="btn btn-primary btn-sm">Excluir</td>`
									listItemHtml += `</tr>`

									this.resultsTarget.innerHTML += listItemHtml
								} else {
									//Se não tiver nenhum elemento na tabela
									var listItemHtml = ""
									listItemHtml = `<tr><td> <strong> ${response.item.name} </strong> <td>`
									listItemHtml+= `<td><button type="button" class="btn btn-primary btn-sm">Editar</td>`
									listItemHtml += `<td><button type="button" class="btn btn-primary btn-sm">Excluir</td>`
									listItemHtml += `<tr>`
									
									this.resultsTarget.innerHTML = listItemHtml
								}
								var listItemHtml = ""
								listItemHtml = "<div class='alert alert-success'> Cadastrado com sucesso"
								listItemHtml += "<button type='button' class='close' data-dismiss='alert' aria-label='Fechar'>"
								listItemHtml += "<span aria-hidden='true'>&times;</span>"
								listItemHtml += "</button>"
								listItemHtml += "</div>"
								this.alertsTarget.innerHTML = listItemHtml
							}
							else{
								var listItemHtml = `<div class='alert alert-warning'>Erro no servidor: ${response.item.errors}`
								listItemHtml += "<button type='button' class='close' data-dismiss='alert' aria-label='Fechar'>"
								listItemHtml += "<span aria-hidden='true'>&times;</span>"
								listItemHtml+= "</button>"								
								listItemHtml += "</div>"
								this.alertsTarget.innerHTML = listItemHtml
							}
						})
					}
				}			
			})
			this.newItemTarget.value = ""
		} catch(e){
			var listItemHtml = ""
			listItemHtml = "<div class='alert alert-warning'> Clique em alguma lista e insira o item desejado"
			listItemHtml += "<button type='button' class='close' data-dismiss='alert' aria-label='Fechar'>"
			listItemHtml += "<span aria-hidden='true'>&times;</span>"
			listItemHtml += "</button>"								
			listItemHtml += "</div>"
			this.alertsTarget.innerHTML = listItemHtml
		}
	}

	editItem(e){
		e.preventDefault();
		console.log("Editar")

		var idItem = this.resultsTargets;
		console.log(idItem)
	}
}