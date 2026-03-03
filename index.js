
const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

class Todo {
    isImportant = false;
    username = null;
    date = null;
    line = null;

    constructor(line) {
        this.line = line.trim();

        const matchUsername = line.match(new RegExp(`// TODO (.+);\s*(.+);(.+)`, 'i'));
        if (matchUsername) {
            this.username = matchUsername[1].trim();
            this.date = matchUsername[2].trim();
        }
        const matchImportant = line.match(new RegExp(`// TODO .*!.*`, 'i'));
        if (matchImportant) {
            this.isImportant = true;
        }
        // console.log(this);
    }
}

function findAllTodos(files) {
    const todos = [];
    for (const file of files) {
        const lines = file.split('\r\n');
        for (const line of lines) {

            const match = line.match(/\/\/\s*TODO.*$/);
            if (match) {
                todoLine = match[0];
                todo = new Todo(todoLine);
                todos.push(todo);
            }
        }
    }
    return todos;
}


function processCommand(command) {
    command = command.trim();
    core = command.split(' ')[0];
    args = command.split(' ').slice(1);
    let indexTodo = 0;
    switch (core) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (const todo of findAllTodos(files)) {
                console.log(`${++indexTodo}: ${todo.line}\n`);
            }
            indexTodo = 0;
            break;
        case 'important':
            for (const todo of findAllTodos(files)) {
                if (todo.isImportant) {
                    console.log(`${++indexTodo}: ${todo.line}\n`);
                }
            }

            break;
        case 'user':
            const username = args[0];
            for (const todo of findAllTodos(files)) {
                if (todo.username && todo.username.toLowerCase() === username.toLowerCase()) {
                    console.log(`${++indexTodo}: ${todo.line}\n`);
                }
            }
            indexTodo = 0;
            break;
        case 'sort':
            const sortBy = args[0];
            const todos = findAllTodos(files);
            if (sortBy === 'importance') {
                todos.sort((a, b) => b.isImportant - a.isImportant);
            } else if (sortBy === 'user') {
                todos.sort((a, b) => {
                    if (!a.username) return 1;
                    if (!b.username) return -1;
                    return a.username.localeCompare(b.username);
                });
            } else if (sortBy === 'date') {
                todos.sort((a, b) => {
                    if (!a.date) return 1;
                    if (!b.date) return -1;
                    return new Date(b.date) - new Date(a.date);
                });
            }

            for (const todo of todos) {
                console.log(`${++indexTodo}: ${todo.line}\n`);
            }
            indexTodo = 0;
        default:
            console.log(command + "\n");
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!
