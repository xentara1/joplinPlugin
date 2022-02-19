import {getRequiredFields, search} from "./searchFns";
import Mustache = require("mustache");
import * as YAML from "yaml";
import * as moment from "moment";
import {applyAdditionalFunction, applyMetaData} from "./renderFunctions";
export async function getOverviewContent(
    currentNote: any,
    settings: any
): Promise<string[]> {
    console.log(moment.unix(19232).format("MM/DD/YYYY"));
    const query: string = settings["search"];
    let pageQueryNotes = 1;
    let queryNotes = null;
    const entrys: string[] = [];
    let fields = getRequiredFields(settings);
    do {
        queryNotes = await search(query, fields, pageQueryNotes++);
        entrys.push(...
            await filterAndRender(
                queryNotes.items,
                settings["template"],
                settings["filter"],
                settings["adjustmentFns"]
            )
        );


    }while (queryNotes.has_more);
    return entrys
}



export async function filterAndRender(pages: any, template:any, filter:any,adjustmentFns:any) {
    console.log(filter)

    pages = pages.map(obj=> applyMetaData(obj));

    if(filter){
        var fn = Function("moment", "x", filter);
        pages = pages.filter(x=> fn(moment,x))
    }
    pages = applyAdditionalFunction(adjustmentFns, pages)

    console.log("postPAges", pages)
    pages = pages.map(page=> {
        let rendered = Mustache.render(template, page)
        return rendered
    })
    return pages;
}
