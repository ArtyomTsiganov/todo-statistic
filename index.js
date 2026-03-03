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
    comment = null;
    line = null;

    constructor(line) {
        this.line = line.trim();
        
        const matchUsername = line.match(new RegExp(`//[ ]?TODO[: ]?(.+);\s*(.+);(.+)`, 'i'));
        if (matchUsername) {
            this.username = matchUsername[1].trim();
            this.date = matchUsername[2].trim();
            this.comment = matchUsername[3].trim();
        } else {
            const matchComment = line.match(new RegExp(`//[ ]?TODO[: ]?(.+)`, 'i'));
            if (matchComment) {
                this.comment = matchComment[1].trim();
            }
        }
        const matchImportant = line.match(new RegExp(`//[ ]?TODO[: ]?.*!.*`, 'i'));
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

            const match = line.match(new RegExp(`//[ ]?TODO[: ]?(.*)`, 'i'));
            if (match) {
                todoLine = match[0];
                todo = new Todo(todoLine);
                todos.push(todo);
            }
        }
    }
    return todos;
}

function cutLen(string, limit) {
    if (string.length > limit) {
        return string.slice(0, limit - 3) + '...';
    }
    return string.padEnd(limit, ' ');
}

function printTodos(todos) {
    const limitUsername = 10;
    const limitDate = 10;
    const limitComment = 50;

    let maxUsernameLen = 4; 
    let maxDateLen = 4;
    let maxCommentLen = 7;
    for (const todo of todos) {
        maxUsernameLen = Math.max(maxUsernameLen, todo.username ? todo.username.length : 0);
        maxDateLen = Math.max(maxDateLen, todo.date ? todo.date.length : 0);
        maxCommentLen = Math.max(maxCommentLen, todo.comment ? todo.comment.length : 0);
    }
    const adjustedLimitUsername = Math.min(maxUsernameLen, limitUsername);
    const adjustedLimitDate = Math.min(maxDateLen, limitDate);
    const adjustedLimitComment = Math.min(maxCommentLen, limitComment);

    console.log(`${'!'.padEnd(1, ' ')}  |  ${'user'.padEnd(adjustedLimitUsername, ' ')}  |  ${'date'.padEnd(adjustedLimitDate, ' ')}  |  ${'comment'.padEnd(adjustedLimitComment, ' ')}`);
    console.log(`${'-'.padEnd(1, '-')}--|--${'-'.padEnd(adjustedLimitUsername, '-')}--|--${'-'.padEnd(adjustedLimitDate, '-')}--|--${'-'.padEnd(adjustedLimitComment, '-')}--`);
    for (const todo of todos) {
        const v1 = todo.isImportant ? '!' : ' ';
        const v2 = todo.username ? cutLen(todo.username, adjustedLimitUsername) : ' '.padEnd(adjustedLimitUsername, ' ');
        const v3 = todo.date ? cutLen(todo.date, adjustedLimitDate) : ' '.padEnd(adjustedLimitDate, ' ');
        const v4 = todo.comment ? cutLen(todo.comment, adjustedLimitComment) : ' '.padEnd(adjustedLimitComment, ' ');
        console.log(`${v1}  |  ${v2}  |  ${v3}  |  ${v4}`);
    }
    console.log(`${'-'.padEnd(1, '-')}--|--${'-'.padEnd(adjustedLimitUsername, '-')}--|--${'-'.padEnd(adjustedLimitDate, '-')}--|--${'-'.padEnd(adjustedLimitComment, '-')}--`);
   

}


function processCommand(command) {
    command = command.trim();
    core = command.split(' ')[0];
    args = command.split(' ').slice(1);

    const result = [];
    switch (core) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (const todo of findAllTodos(files)) {
                result.push(todo);
            }
            break;
        case 'important':
            for (const todo of findAllTodos(files)) {
                if (todo.isImportant) {
                    result.push(todo);
                }
            }
            
            break;
        case 'user':
            const username = args[0];
            for (const todo of findAllTodos(files)) {
                if (todo.username && todo.username.toLowerCase() === username.toLowerCase()) {
                    result.push(todo);
                }
            }
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
                result.push(todo);
            }
            break;
        case 'date':
            const date = args[0];
            for (const todo of findAllTodos(files)) {
                if (todo.date && new Date(todo.date) >= new Date(date)) {
                    result.push(todo);
                }
            }
            break;
        default:
            console.log(command + "\n");
            console.log('wrong command');
            break;

    }
    printTodos(result);
}

// TODO you can do it!
//TOdO youjsdflsdflkjsdlf can do it!
//TOdO: 1yosdflkjsdlf can do it!
// TodO: 2youjsdfldlf can do it!
