import { Client, MessageCreateOptions, MessagePayload } from "discord.js"
import {readFileSync, writeFileSync, readdirSync} from "fs"
import * as path from "path"

type birthdayDate = {
    pos: number,
    id: string,
    name: string
    day: number,
    month: number,
    year: number | null,
    message: string
}

function parseBirthdays(path: string): birthdayDate[] {
    let fileContent = readLines(path).filter(v => ! v.startsWith("#") && ! v.startsWith("!"))
    return fileContent.map((v, i) => {
        const data = v.split(";")
        
        return {
            pos: i + 4,
            id: data[0],
            name: data[1],
            day: Number(data[2]),
            month: Number(data[3]),
            year: Number(data[4]) || null,
            message: data[5]
        }
    })
}

class birthdayGuildOptions {
    channel: string
    
    constructor(channel: string = "null") {
        this.channel = channel;
    }

    toString(): string {
        return `! channel:${this.channel}`
    }
}

function writeGuildOptions(path: string, options: birthdayGuildOptions) {
    let _fc = readLines(path)

    if(_fc.filter(v => v.startsWith("!"))[0] === undefined) {
        if(_fc.length >= 4) {
            const metadata = _fc.slice(0,3)
            const copyContent = _fc.slice(3)
            metadata.push(options.toString())
            const newData = metadata.concat(copyContent)
            
            writeFileSync(path, newData.join("\n"))
        }
        else {
            _fc.push(options.toString())
            writeFileSync(path, _fc.join("\n"))
        }

        return
    }

    _fc[3] = options.toString()
    writeFileSync(path, _fc.join("\n"))
}

function getGuildOptions(path: string) {
    let _fc = readLines(path)
    let fileContent = _fc.filter(v => v.startsWith("!"))[0];

    var options = new birthdayGuildOptions()

    if(fileContent === undefined) {
        writeGuildOptions(path, options)
        return options
    }

    fileContent.replace("! ", "").split(";").forEach(v => {
        const tmp = v.split(":")

        switch (tmp[0]) {
            case "channel":
                options.channel = tmp[1]
                break;
        
            default:
                break;
        }
    })

    return options
}

function readLines(path: string): string[] {
    const fileBuffer = readFileSync(path)
    const fileArray: number[] = []

    fileBuffer.forEach(v => fileArray.push(v))
    
    const fileContent = fileArray.map(v => String.fromCharCode(v))
    return fileContent.join("").split("\n")
}

let congratulated = false
let _t = new Date()

async function sendMessage(client: Client) {
    const files = readdirSync("./data")
    const guilds = files.filter(v => v.endsWith("-birthdays"))
    const _t2 = new Date()

    if(congratulated && ! (_t.toDateString() == _t2.toDateString())) {
        congratulated = false;
        _t = new Date();
    }

    if(congratulated) return;

    for(let i = 0; i < guilds.length; i++) {
        const birthdays = parseBirthdays(path.join("./data", guilds[i]))
        const configs = getGuildOptions(path.join("./data", guilds[i]))

        for(let j = 0; j < birthdays.length; j++) {
            const today = new Date();
            const _b = birthdays[j];
            
            if(
                _b.day == today.getDate() 
                && _b.month == (today.getMonth() + 1)
            ) {
                const channel = client.channels.cache.get(configs.channel)
                let msg = _b.message
                while (msg.includes("@everyone")) {
                    msg = msg.replace(/@everyone/g, "")
                }
                while (msg.includes("@here")) {
                    msg = msg.replace(/@here/g, "")
                }

                if(msg == "")
                    msg = `Felicidades <@${_b.id}>!`

                //@ts-ignore                
                channel?.send(msg)
                
            }
        }
    }

    congratulated = true
}

export {birthdayDate, parseBirthdays, readLines, getGuildOptions, birthdayGuildOptions, writeGuildOptions, sendMessage}