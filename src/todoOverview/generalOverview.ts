import {getRequiredFields, search} from "./searchFns";
import Mustache = require("mustache");
import * as YAML from "yaml";

export async function getOverviewContent(
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
        entrys.push(...
            await filterAndRender(
                queryNotes.items,
                settings["template"],
                settings["filter"]
            )
        );


    }while (queryNotes.has_more);
    return entrys
}

export async function filterAndRender(pages: any, template:any, filter:any) {
    console.log(filter)
    let yamlMatch =/(```\s?yaml(?<yaml>[\w\W]*?)```)?/gi;
    pages = pages.map(obj=> {
        let match = yamlMatch.exec(obj.body)
        console.log(match)

        if(match["groups"]["yaml"] != null){
            let metaData = YAML.parse(match["groups"]["yaml"]);
            console.log(metaData)
            obj = { ...obj, ...metaData }
        }
        return obj
    });

    if(filter){
        var fn = Function("x", filter);
        pages = pages.filter(x=> fn(x))
    }

    console.log("postPAges", pages)
    pages = pages.map(page=> {
        let rendered = Mustache.render(template, page)
        return rendered
    })
    return pages;
}
