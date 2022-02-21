import {applyAdditionalFunction, applyMetaData} from "./renderFunctions";
import * as moment from "moment";
import joplin from "../../api";
import Mustache = require("mustache");
import {reduceToJoplinSpecificFields, search} from "./searchFns";
import {meeting, profile, project} from "./templates";
import {filterAndRender} from "./generalOverview";

export async function createNewProject() {
    console.log("in")
    let pageQueryNotes = 1;
    let userQuery = null
    let users = []
    do {
        userQuery = await search("tag:profile",["title","id"], pageQueryNotes);
        console.log(userQuery)
        users.push(... userQuery.items );
    }while (userQuery.has_more);
    console.log("out")
    users = users.map(x=> ({label:x.title , value:x.id}))
    users.unshift({label:"NA", value:"NA"})
    console.log("users")

    let vars = {}
    vars["name"] = (await joplin.commands.execute("showPrompt", {
        label: "Name",
        inputType: "text",
    }))["answer"];
    vars["lead"] = (await joplin.commands.execute("showPrompt", {
        label: "Lead",
        inputType: "dropdown",
        autocomplete: users
    }))["answer"];
    //TEAM
    let team = [];
    let user = {}
    while(user["value"]!="NA"){
        user = (await joplin.commands.execute("showPrompt", {
            label: "Team",
            inputType: "dropdown",
            autocomplete: users
        }))["answer"];
        team.push(user)
    }
    vars["managed"] = (await joplin.commands.execute("showPrompt", {
        label: "Do You Manage",
        inputType: "dropdown",
        value: "YES",
        autocomplete: [{label:"YES", value:"YES"},{label:"NO", value:"NO"}]
    }))["answer"]["label"];
    team = team.filter(x=> x.value !== "NA")
    vars["team"] = team
    vars["tag"] ="{{"
    vars["ctag"] ="}}"

    console.log(vars)
    let rendered = Mustache.render(project, vars);
    let folderId = await getNotebook("Project Overviews")
    let body = { body: rendered, parent_id: folderId, title: vars["name"]};
    console.log(body)
    const note = await joplin.data.post(["notes"], null, body);
    console.log(note)
    await joplin.commands.execute("openNote", note.id);
    const tagId = (await getAnyTagWithTitle("project")).id;
    await applyTagToNote(tagId, note.id);
}

export async function createNewPerson() {
    let vars = {}
    vars["name"] = (await joplin.commands.execute("showPrompt", {
        label: "Name",
        inputType: "text",
    }))["answer"];
    vars["team"] = (await joplin.commands.execute("showPrompt", {
        label: "Team",
        inputType: "text",
    }))["answer"];
    vars["region"] = (await joplin.commands.execute("showPrompt", {
        label: "Region",
        inputType: "text",
    }))["answer"];
    vars["nationality"] = (await joplin.commands.execute("showPrompt", {
        label: "Nationality",
        inputType: "text",
    }))["answer"]["value"];
    vars["managed"] = await joplin.commands.execute("showPrompt", {
        label: "Do You Manage",
        inputType: "dropdown",
        value: "YES",
        autocomplete: [{label:"YES", value:"YES"},{label:"NO", value:"NO"}]
    })["answer"]["label"];
    vars["tag"] ="{{"
    vars["ctag"] ="}}"
    console.log(vars)
    let rendered = Mustache.render(profile, vars);
    let folderId = await getNotebook("Profile Overviews")
    let body = { body: rendered, parent_id: folderId, title: vars["name"]};
    console.log(body)
    const note = await joplin.data.post(["notes"], null, body);
    console.log(note)
    await joplin.commands.execute("openNote", note.id);
    const tagId = (await getAnyTagWithTitle("profile")).id;
    await applyTagToNote(tagId, note.id);
}
export const applyTagToNote = async (tagId: string, noteId: string): Promise<void> => {
    await joplin.data.post(["tags", tagId, "notes"], null, { id: noteId });
}
export const getAnyTagWithTitle = async (title: string) => {
    const existingTags = await getAllTagsWithTitle(title);
    console.log("ExistingTags", existingTags)
    if (existingTags.length) {
        return existingTags[0];
    }

    const tag = await joplin.data.post(["tags"], null, { title: title });
    return {
        id: tag.id,
        title: tag.title
    };
}
export const getAllTagsWithTitle = async (title: string) => {
    return (await fetchAllItems(["search"], { query: title, type: "tag" })).map(tag => {
        return {
            id: tag.id,
            title: tag.title
        }
    });
}

export const fetchAllItems = async (path: string[], query: any): Promise<any[]> => {
    let pageNum = 1;
    let response;
    let items = [];

    do {
        response = await joplin.data.get(path, { ...query, page: pageNum });
        items = items.concat(response.items);
        pageNum++;
    } while (response.has_more);

    return items;
}


async function getNotebook(name){
    try {
        let folders = await joplin.data.get([ "folders" ], { fields: ["title", "id"] });
        console.log(folders)
        let id = folders["items"].filter(x=> x.title==name)[0]["id"]
        console.log(id)
        return id;
    } catch (error) {
        return false;
    }
}

export async function createNewMeeting() {
    console.log("in")
    let pageQueryNotes = 1;
    let query = null
    let users = []
    do {
        query = await search("tag:profile",["title","id"], pageQueryNotes);
        console.log(query)
        users.push(... query.items );
    }while (query.has_more);
    users = users.map(x=> ({label:x.title , value:x.id}))
    users.unshift({label:"NA", value:"NA"})
    console.log("users", users)
    pageQueryNotes = 1;
    query = null
    let projects = []
    do {
        query = await search("tag:project",["title","id"], pageQueryNotes);
        console.log(query)
        projects.push(... query.items );
    }while (query.has_more);
    projects = projects.map(x=> ({label:x.title , value:x.id}))
    projects.unshift({label:"NA", value:"NA"})
    console.log("projects",projects)

    let vars = {}
    vars["name"] = (await joplin.commands.execute("showPrompt", {
        label: "Name",
        inputType: "text",
    }))["answer"];
    vars["type"] = (await joplin.commands.execute("showPrompt", {
        label: "Note Type",
        inputType: "dropdown",
        value: {label:"Personal", value:"personalNote"},
        autocomplete: [{label:"Personal", value:"personalNote"},{label:"Project", value:"projectNote"}]
    }))["answer"]["value"];
    vars["project"] = (await joplin.commands.execute("showPrompt", {
        label: "project",
        inputType: "dropdown",
        value:{label:"NA", value:"NA"},
        autocomplete: projects
    }))["answer"];
    //TEAM
    let team = [];
    let user = {}
    while(user["value"]!="NA"){
        user = (await joplin.commands.execute("showPrompt", {
            label: "With",
            inputType: "dropdown",
            value: {label:"NA", value:"NA"},
            autocomplete: users
        }))["answer"];
        team.push(user)
    }
    team = team.filter(x=> x.value !== "NA")
    vars["team"] = team
    vars["tag"] ="{{"
    vars["ctag"] ="}}"

    console.log(vars)
    let rendered = Mustache.render(meeting, vars);
    let folderId = "";
    if(vars["type"] == "personalNote"){
        folderId = await getNotebook("Project Notes")
    }
    else{
        folderId = await getNotebook("Personal Notes")
    }

    let body = { body: rendered, parent_id: folderId, title: vars["name"]};
    console.log(body)
    const note = await joplin.data.post(["notes"], null, body);
    console.log(note)
    await joplin.commands.execute("openNote", note.id);
    let tags = ["note", "project/" + vars["project"].label]
    team.forEach(x=> tags.push("profile/"+ x["label"]))
    tags.forEach(x=> (getAnyTagWithTitle(x)).then(tag=>applyTagToNote(tag.id, note.id)));
}
