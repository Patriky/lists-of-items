import { Controller } from 'stimulus'

export default class extends Controller {

	static targets = ["name", "city"]

	connect(){
		// console.log("Conected..")
	}

	printName(){
		console.log(`${this.nameTarget.value} - ${this.cityTarget.value}`)
	}

}