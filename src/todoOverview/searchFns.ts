import joplin from "../../api";

let joplinFields = ["id","parent_id","title","body","created_time","updated_time","is_conflict","latitude","longitude","altitude","author","source_url","is_todo","todo_due","todo_completed","source","source_application","application_data","order","user_created_time","user_updated_time","encryption_cipher_text","encryption_applied","markup_language","is_shared","share_id","conflict_original_id","master_key_id","body_html","base_url","image_data_url","crop_rect"]

export function getRequiredFields(settings: any) {
    let fieldRegEx = /{{([a-zA-Z]*?)}}/gi
    let match = null
    let fields = []
    while ((match = fieldRegEx.exec(settings["template"])) != null) {
        fields.push(match[1]);
    }
    return fields;
}

export function reduceToJoplinSpecificFields(fields: any[]) {
    let queryFields = fields.filter(x => joplinFields.includes(x))
    queryFields.push("body")
    if (!queryFields.includes("id")) {
        queryFields.push("id")
    }
    return queryFields;
}

export async function search(query: string, queryFields: any[], pageNo: number) {
    queryFields = reduceToJoplinSpecificFields(queryFields);
    let res =  await joplin.data.get(["search"], {
        query: query,
        fields: queryFields.join(","),
        limit: 50,
        page: pageNo,
    });
    //Potential performance hit?
    const note = await joplin.workspace.selectedNote();
    res.items = res.items.filter(x=> x["id"]!== note["id"])
    return res
}
