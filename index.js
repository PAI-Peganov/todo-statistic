const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const comments = getFiles().map(str => 
    str.split("\r\n").map(line => line.indexOf("// " + "TODO ") !== -1 ? line.substring(line.indexOf("// " + "TODO ") + 3) + "\n" : "").join("")
).join("").split("\n").filter(com => com !== "");

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            comments.forEach(com => console.log(com));
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
