export async function getSubNoteContent(
    body: string,
    fromIndex: number,
    toIndex: number,
    posIsAfterOverviewSection: boolean
) {
    const orgContent = body.substring(fromIndex, toIndex);
    let stripe: boolean[];

    if (posIsAfterOverviewSection === false) {
        if (fromIndex === 0) {
            stripe = [false, true];
        } else {
            stripe = [true, true];
        }
    } else {
        stripe = [true, false];
    }

    return await removeNewLineAt(orgContent, stripe[0], stripe[1]);
}

export async function removeNewLineAt(
    content: string,
    begin: boolean,
    end: boolean
): Promise<string> {
    if (end === true) {
        if (content.charCodeAt(content.length - 1) == 10) {
            content = content.substring(0, content.length - 1);
        }
        if (content.charCodeAt(content.length - 1) == 13) {
            content = content.substring(0, content.length - 1);
        }
    }

    if (begin === true) {
        if (content.charCodeAt(0) == 10) {
            content = content.substring(1, content.length);
        }
        if (content.charCodeAt(0) == 13) {
            content = content.substring(1, content.length);
        }
    }
    return content;
}
