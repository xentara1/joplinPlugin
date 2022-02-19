import joplin from "../../api";
import * as YAML from "yaml";
import {getSubNoteContent} from "./bodyAdjustmentHelper";
import {getTaskOverviewContent} from "./taskOverview";
import {getOverviewContent} from "./generalOverview";

export async function createOverview(){
    const note = await joplin.workspace.selectedNote();
    const noteOverviewRegEx =
        /(<!--\s?jat(?<settings>[\w\W]*?)-->)(?<data>[\w\W]*?<!--JATOUT-->)?/gi;

    let regExMatch = null;
    let startOrgTextIndex = 0;
    let startIndex = 0;
    let endIndex = 0;
    let newNoteBody: string[] = [];

    while ((regExMatch = noteOverviewRegEx.exec(note.body)) != null) {
        const settingsBlock = regExMatch["groups"]["settings"];
        startIndex = regExMatch.index;
        endIndex = startIndex + regExMatch[0].length;
        let settings = YAML.parse(settingsBlock);
        console.log(settings)
        if (startOrgTextIndex != startIndex) {
            newNoteBody.push(
                await getSubNoteContent(
                    note.body,
                    startOrgTextIndex,
                    startIndex,
                    false
                )
            );
        }
        if (regExMatch["groups"]["data"]&&regExMatch["groups"]["data"].includes("JATOUT")) {
            startOrgTextIndex = endIndex;
        } else {
            startOrgTextIndex = startIndex + regExMatch[1].length;
        }
        newNoteBody = [...newNoteBody, regExMatch[1]];
        let jatContent = []
        if(settings.type === "Task"){
            console.log("TASK")
            jatContent = await getTaskOverviewContent(note,settings)
        }
        else {
            console.log("Overview")
            jatContent = await getOverviewContent(note, settings)
        }
        console.log("JAT", jatContent)
        jatContent.push("<!--JATOUT-->");
        newNoteBody = [...newNoteBody, ...jatContent];
        console.log("NOTE",newNoteBody)
    }

    if (startOrgTextIndex !== note.body.length) {
        newNoteBody.push(
            await getSubNoteContent(
                note.body,
                startOrgTextIndex,
                note.body.length,
                true
            )
        );
    }
    console.log("finalNote",newNoteBody)
    const newNoteBodyStr = newNoteBody.join("\n");
    await joplin.commands.execute("textSelectAll");
    await joplin.commands.execute("replaceSelection", newNoteBodyStr);
    //await joplin.data.put(['notes', note["id"]], null, {body: newNoteBodyStr});
}
