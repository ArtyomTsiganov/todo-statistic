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

function findAllImportantTodos(files) {
    const todos = [];
    for (const file of files) {
        const lines = file.split('\r\n');
        for (const line of lines) {
            if (/\/\/ TODO.*!.*/.test(line)) {
                todos.push(line);
            }
        }
    }
    return todos;
}


function findAllTodosFromUser(files, username) {
    const todos = [];
    for (const file of files) {
        const lines = file.split('\r\n');
        for (const line of lines) {

            const match = line.match(/\/\/\s*TODO.*$/);
            if (match) {
                todoLine = match[0];
                let matchUsername = todoLine.match(new RegExp(`${username};\s*(.+;)(.+)`, 'i'));
                // console.log(a);
                if (matchUsername) {
                    todos.push(line);
                }
            }
        }
    }
    return todos;
}


function processCommand(command) {
    command = command.trim();
    core = command.split(' ')[0];
    args = command.split(' ').slice(1);
    switch (core) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (const [index, todo] of findAllTodos(files).entries()) {
                console.log(`${index + 1}: ${todo.trim()}\n`);
            }
            break;
        case 'important':
            for (const [index, todo] of findAllImportantTodos(files).entries()) {
                console.log(`${index + 1}: ${todo.trim()}\n`);
            }
            break;
        case 'user':
            const username = args[0];
            for (const [index, todo] of findAllTodosFromUser(files, username).entries()) {
                console.log(`${index + 1}: ${todo.trim()}\n`);
            }
            break;
        default:
            console.log(command + "\n");
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
