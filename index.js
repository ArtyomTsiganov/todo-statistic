const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function findAllTodos(files) {
    const todos = [];
    for (const file of files) {
        const lines = file.split('\r\n');
        for (const line of lines) {
            if (line.includes('// TODO')) {
                todos.push(line);
            }
        }
    }
    return todos;
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (const [index, todo] of findAllTodos(files).entries()) {
                console.log(`${index + 1}: ${todo.trim()}\n`);
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
