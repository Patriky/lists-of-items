import { Controller } from 'stimulus'

export default class extends Controller {

	static targets = ["progress"]

	connect(){
		// console.log("Conected..")
	}

	greet(){
		console.log(this.progressTarget.value)
	}

}