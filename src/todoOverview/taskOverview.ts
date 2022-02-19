import joplin from "../../api";
import * as YAML from "yaml";
import {getSubNoteContent} from "./bodyAdjustmentHelper";
import Mustache = require("mustache");
import {getRequiredFields, reduceToJoplinSpecificFields, search} from "./searchFns";
import moment = require("moment");
import {applyMetaData} from "./renderFunctions";




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
                    settings["filter"],
                    settings["adjustmentFns"]
                )
            );
        }
    }while (queryNotes.has_more);
    return entrys
}

export async function getTodoFromBody(item: any, template:any, filter:any,adjustmentFns:any) {
    console.log(filter)
    item = applyMetaData(item);
    let tasks = item["body"].split("\n");

    tasks = tasks.filter(x=> (x.includes("- [ ]")||
                             x.includes("- [x]"))&&
                             !x.includes("TID"))
    let fn = null
    if(filter){
        fn = Function("moment", "x", filter);
    }
    console.log(tasks)
    let newTasks = [];
    tasks.forEach(task=> {

        item["todo"] = task
        if(fn && fn(moment, item)){
            let rendered = Mustache.render(template, item)
            //Include Page ID so that we can always keep the task in sync with its master
            rendered = rendered + "<!--TID" + item["id"] +"TID-->"
            //Include raw task info so task in sync with its master
            rendered = rendered + "<!--TRAW" + item["todo"] +"TRAW-->"
            newTasks.push(rendered)
        }
    })


    return newTasks;
}
