import * as Renderer from "./renderer";
import { TimeSnippetApi } from "./timesnippet";

/**
 * Returns a HTML Element specified by the given selector
 * @param selector HTML selector
 */
export function $(selector: string): HTMLElement {
    return document.querySelector(selector);
}

export async function showTimesnippetList(projectId:string):Promise<void>{
    let snippetList = await TimeSnippetApi.getAll(projectId);
    let listHtml = Renderer.renderTimesnippetList(snippetList);
    $("#timesnippet_container").innerHTML = listHtml;
}