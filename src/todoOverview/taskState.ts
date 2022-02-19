import joplin from "../../api";

export async function updateTodos() {
    const note = await joplin.workspace.selectedNote();
    //only look at the out of note
    let pagesTodos = {};
    let matcher = /(.*)<!--TID(.*)TID-->.*<!--TRAW(.*)TRAW-->/gi
    let match = null
    while ((match = matcher.exec(note.body)) != null) {
        console.log("match", match)
        let rawTask = match[3]
        let updatedTask = match[1]
        rawTask = syncCheckboxesState(updatedTask, rawTask);
        let id = match[2]
        if (id in pagesTodos) {
            pagesTodos[id].push(rawTask)
        } else {
            pagesTodos[id] = [rawTask]
        }
    }
    console.log("pageTasks",pagesTodos)
    Object.keys(pagesTodos).forEach((x) => {
        updateTodoInBody(x, pagesTodos[x])
    })
}

export async function updateTodoInBody(id, todoList) {
    const note = await joplin.data.get(['notes', id], {fields: ['body']});
    //Adjust body
    let body = note.body;
    console.log("prevBody", body)
    todoList.forEach((todo) => {
        console.log("task:", todo)
        let prevTodo = flipCheckboxState(todo)
        body = body.replace(prevTodo, todo)
        console.log("interim Body", body)
    })
    console.log("newBody", body)
    await joplin.data.put(['notes', id], null, {body: body});
}

export function syncCheckboxesState(newState, body){
    let matcher = /(\[.\])/gi
    let checkboxState = matcher.exec(newState)[0]
    body = body.replaceAll(matcher, checkboxState)
    console.log(body)
    return body
}
export function flipCheckboxState(taskBlock){
    let matcher = /(\[.\])/gi
    let checkboxState = matcher.exec(taskBlock)[0]
    let oppositeState = "[ ]"
    if(checkboxState === oppositeState){
        oppositeState = "[x]"
    }
    taskBlock = taskBlock.replaceAll(matcher, oppositeState)
    console.log(taskBlock)
    return taskBlock
}
