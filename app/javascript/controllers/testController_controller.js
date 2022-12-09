import { Controller } from 'stimulus'

export default class extends Controller {

	static targets = ["progress"]

	connect(){
		// console.log("Conected..")
	}

	greet(){
		console.log(this.progressTarget.value)
							const d = new Date();
					console.log(d.toISOString())
					if(d.toISOString() > '2022-04-28'){
						console.log("Maior")
					}else{
						console.log("Menor")
					}
	}

}