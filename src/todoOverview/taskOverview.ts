import joplin from "../../api";
import * as YAML from "yaml";
import {getSubNoteContent} from "./bodyAdjustmentHelper";
import Mustache = require("mustache");
import {getRequiredFields, reduceToJoplinSpecificFields, search} from "./searchFns";




export async function getTaskOverviewContent(
    currentNote: any,
    settings: any
): Promise<string[]> {
    const query: string = settings["search"];
    let pageQueryNotes = 1;
    let queryNotes = null;
    const entrys: string[] = [];
    let fields = getRequiredFields(settings);
    do {
        queryNotes = await search(query, fields, pageQueryNotes++);
        for (let queryNotesKey in queryNotes.items) {
            entrys.push(...
                await getTodoFromBody(
                    queryNotes.items[queryNotesKey],
                    settings["template"],
                    settings["filter"]
                )
            );
        }
    }while (queryNotes.has_more);
    return entrys
}

export async function getTodoFromBody(item: any, template:any, filter:any) {
    console.log(filter)

    let tasks = item["body"].split("\n");
    console.log("preTID", tasks)
    tasks = tasks.filter(x=> (x.includes("- [ ]")||
                             x.includes("- [x]"))&&
                             !x.includes("TID"))
    console.log("pstTId", tasks)
    if(filter){
        var fn = Function("x", filter);
        tasks = tasks.filter(x=> fn(x))
    }
    console.log(tasks)
    tasks = tasks.map(task=> {
        item["todo"] = task
        let rendered = Mustache.render(template, item)
        //Include Page ID so that we can always keep the task in sync with its master
        rendered = rendered + "<!--TID" + item["id"] +"TID-->"
        //Include raw task info so task in sync with its master
        rendered = rendered + "<!--TRAW" + item["todo"] +"TRAW-->"
        return rendered
    })


    return tasks;
}
