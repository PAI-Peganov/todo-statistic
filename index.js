const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const comments = files.map(str => 
    str.split("\r\n").map(line => 
        line.indexOf("// " + "TODO ") !== -1 ? line.substring(line.indexOf("// " + "TODO ") + 3) + "\n" : ""
    ).join("")
).join("").split("\n").filter(com => com !== "").map(com => comToData(com));

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    console.log(comToConsole(["user", "date", 1, " comment"]));
    console.log("------------------------------------------------------------------------");
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            comments.forEach(com => console.log(comToConsole(com)));
            break;
        case 'important':
            comments.filter(com => com[2] > 0).forEach(com => console.log(comToConsole(com)));
            break;
        default:
            if (processCommandHard(command))
                break;
            console.log('wrong command');
            break;
    }
    console.log("------------------------------------------------------------------------");
}

function processCommandHard(command) {
    switch (true) {
        case command.startsWith('user '):
            const user = command.substring(5).toLowerCase();
            comments.filter(com => com[0] === user).forEach(com => console.log(comToConsole(com)));
            break;
        case command.startsWith('sort '):
            switch (command.substring(5)) {
                case 'user':
                    comments.sort((com1, com2) => com1[0] === "" ? 1 : com2[0] === "" ? -1 : com1[0].localeCompare(com2[0])).forEach(com => console.log(comToConsole(com)));
                    break;
                case 'date':
                    comments.sort((com1, com2) => com1[1] === undefined ? 1 : com2[1] === undefined ? -1 : com1[1].getTime() - com2[1].getTime()).forEach(com => console.log(comToConsole(com)));
                    break;
                case 'importance':
                    comments.sort((com1, com2) => com2[2] - com1[2]).forEach(com => console.log(comToConsole(com)));
                    break;
                default:
                    console.log("wrong command");
                    break;
                }
            break;
        case command.startsWith('date '):
            const date = new Date(command.substring(5)).getTime();
            comments.filter(com => com[1] !== undefined && com[1].getTime() > date).forEach(com => console.log(comToConsole(com)));
            break;
        default:
            return false;
    }
    return true;
}

function comToData(com) {
    if (com.split(";").length < 3)
        return ["", undefined, com.split("!").length - 1, com];
    const name_end = com.indexOf(';');
    const name = com.substring(5, name_end).toLowerCase();
    const date_end = com.indexOf(';', name_end + 1);
    const date = new Date(com.substring(name_end + 2, date_end));
    return [name, date, com.split("!").length - 1, com.substring(date_end + 1)];
}

function comToConsole(com) {
    return (
        (com[2] > 0 ? "!  |  " : "   |  ") +
        com[0].padEnd(30) + "|  " +
        (com[1] === undefined ? "".padEnd(22) : com[1] === "date" ? com[1] : com[1].toLocaleDateString('ru-RU', { 
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })).padEnd(22) + "  |  " +
        com[3]
    );
}

// TODO you can do it!
