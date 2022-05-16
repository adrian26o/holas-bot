class Command {
	name:string = "";
	exec;

	constructor(name:string, exec: Function) {
		this.exec = exec;
		this.name = name;
	}
}

export {Command}
