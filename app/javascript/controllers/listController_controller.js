import { Controller } from 'stimulus'

export default class extends Controller {

	static targets = ['results', 'newItem']

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
				listItemHtml = "<ul>"
				response.itemsSelected.forEach((item) => {
					listItemHtml += `<li> <strong> ${item.name} </strong> </li>`
				})
				listItemHtml += "</ul>"
				this.resultsTarget.innerHTML = listItemHtml
			} else {
				this.resultsTarget.innerHTML = "<p>Vazio... </p>"
			}
		});
	}

	createItem(e){
		var e = document.getElementById("lista");

		try{
			var idList = e.options[e.selectedIndex].getAttribute("data-list-id");
			//console.log("ID: " + idList)
			//console.log("Item: " + this.newItemTarget.value)

			let data = {
				name: this.newItemTarget.value,
				list_id: idList
			}
			this.newItemTarget.value = ""

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
					var ul = this.resultsTarget.querySelector("ul")

					if (ul !== null) {
						ul.innerHTML += `<li> <strong> ${response.item.name} </strong> </li>`
					} else {
						this.resultsTarget.innerHTML = `<ul> <li> <strong> ${response.item.name} </strong>  </li> <ul>`
					}
				}
				else{
					console.log("Server error: " + response.item.errors)
				}
			})
		} catch(e){
			alert("Não foi possível cadastrar!")
		}
	}
}