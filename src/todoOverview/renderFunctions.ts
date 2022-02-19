import * as YAML from "yaml";
import * as moment from "moment";

export function applyMetaData( obj) {
    console.log("applying meta data")
    let yamlMatch =/(```\s?yaml(?<yaml>[\w\W]*?)```)?/gi;
    let match = yamlMatch.exec(obj.body)
    if (match["groups"]["yaml"] != null) {
        let metaData = YAML.parse(match["groups"]["yaml"]);
        console.log(metaData)
        obj = {...obj, ...metaData}
    }
    return obj
}

export function applyAdditionalFunction(adjustmentFns: any, pages) {
    if(adjustmentFns) {
        for (var key of Object.keys(adjustmentFns)) {
            pages = pages.map(obj => applyFunc(key, adjustmentFns[key], obj));
        }
    }
    return pages;
}

function applyFunc( key, adjustmentFn, obj) {
    var fn = Function("moment", "x", adjustmentFn);
    let newVal = fn(moment, obj[key])
    console.log(newVal)
    obj[key] = newVal;
    return obj
}
