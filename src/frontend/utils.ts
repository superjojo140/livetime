import { ProjectApi } from "./project";
import * as Renderer from "./renderer";
import { TimeSnippetApi } from "./timesnippet";

/**
 * Returns a HTML Element specified by the given selector
 * @param selector HTML selector
 */
export function $(selector: string): HTMLElement {
    return document.querySelector(selector);
}

export async function showTimesnippetList(projectId: string): Promise<void> {
    let snippetList = await TimeSnippetApi.getAll(projectId);
    let listHtml = Renderer.renderTimesnippetList(snippetList);
    $("#timesnippet_container").innerHTML = listHtml;
}

export async function showProjectList(activeId: string): Promise<void> {
    let projectList = await ProjectApi.getAll();
    let listHtml = Renderer.renderProjectList(projectList, activeId);
    $("#project_list").innerHTML = listHtml;
}

export function getUrlParam(key: string) {
    let url = new URL(document.location.href);
    return url.searchParams.get(key);
}

export function showMessageCard(heading: string, title: string, text: string, theme: string) {
    let html = Renderer.renderMessageCard(heading,title,text,theme);
    $("#timesnippet_container").innerHTML = html;
}

export class State {
    projectId: string;
}