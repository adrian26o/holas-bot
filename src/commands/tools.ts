import {Message, User} from "discord.js";

function comp(msg: Message,command: string | Array<string>) {
	if(msg.client.user == null) return true;
    if(typeof(command)=="string"){
        if(
			msg.content.split(" ")[0]==`h!${command}` ||
			msg.content.split(" ").slice(0,2).join(" ")==`<@!${msg.client.user.id}> ${command}`||
			msg.content.split(" ").slice(0,2).join(" ")==`<@${msg.client.user.id}> ${command}`
		) return false;
        return true;
    }
    else {
        let is_command = false;
        for(let i:number=0;i<command.length;i++){
            if(
				msg.content.split(" ")[0]== `h!${command[i]}` ||
				msg.content.split(" ").slice(0,2).join(" ")==`<@!${msg.client.user.id}> ${command[i]}` // `
			)	is_command=true;
        }
		return (! is_command);
    }
}

async function input_err(msg: Message,info: string) {
    const reply = await msg.reply(info);
    await new Promise(r => setTimeout(r, 5000));
    await reply.delete();
    if(msg.deletable) await msg.delete();
}

function getUser(msg: Message,index: number = 1): User | undefined {
	if(msg.content == null || msg.client.user == null) return;

    const msgSplit = msg.content.split(" ");
    let _user:string;

    if (msgSplit[0] == `<@!${msg.client.user.id}>` || msgSplit[0] == `<@${msg.client.user.id}>`)
        _user = msgSplit[index+1];
    else
        _user = msgSplit[index];

    if(_user == undefined) return undefined;
    
    const user = msg.client.users.cache.find(u => u.username.toLowerCase() == _user.toLowerCase() || `<@!${u.id}>` == _user || `<@${u.id}>` == _user || u.id == String(_user));
    return user;
}

function getArgs(msg: Message,index: number = 1): Array<string> {
	if(msg.content == null || msg.client.user == null) return [];
    const msgSplit = msg.content.split(" ");
    let args;

    if (msgSplit[0] == `<@!${msg.client.user.id}>` || msgSplit[0] == `<@${msg.client.user.id}>`)
        args = msgSplit.slice(index+1)
    else
        args = msgSplit.slice(index)
    
    return args;
}

export {comp,input_err,getUser,getArgs}
