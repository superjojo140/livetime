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
    let html = Renderer.renderMessageCard(heading, title, text, theme);
    $("#timesnippet_container").innerHTML = html;
}

export async function showProjectDetails(projectId: string) {
    let project = await ProjectApi.get(projectId);
    let sum = await getOverallTime(projectId);
    let html = Renderer.renderProjectDetails(project, sum);
    $("#project_detail").innerHTML = html;
}

/**
 * This function does:
 * - display the project list with correct highlighting
 * - display the project details
 * - display the timesnippets of that project
 * - display the "add snippet" buttons
 * - error handling for all theese jobs
 */
export function showProject(projectId: string) {
    showProjectList(projectId).catch((err) => {
        console.error(err);
        showMessageCard("Whoops...", "Something went really wrong!", "We can't load your project list. Please log out, refresh this page and log in again", "danger");
    })
    if (projectId == undefined) {
        showMessageCard("Welcome back!", "", "Please select a project or create a new one.", "secondary");
        return;
    }
    Promise.all([
        showTimesnippetList(projectId),
        showProjectDetails(projectId),
    ])
        .then(showAddSnippetButtons)
        .catch((err) => {
            console.error(err);
            showMessageCard("Whoops...", "Project not found", "Maybe it does not exist or you don't have access to it.", "danger");
        })
}

export function showAddSnippetButtons() {
    let data = Renderer.renderAddSnippetButtons();
    $("#add_snippet_buttons").innerHTML = data.top;
    $("#fab_container").innerHTML = data.fab;
}

/**
 * Calculates the overall sum of all timesnippets in the project identified by the given projectId
 * @return
 */
export async function getOverallTime(projectId: string): Promise<number> {
    let snippetList = await TimeSnippetApi.getAll(projectId);
    let sum = 0;

    for (const snippet of snippetList) {
        if (snippet.end == null) { snippet.end = new Date(); } //Set current timepoint as temporary end for live snippets
        sum += snippet.end.getTime() - snippet.start.getTime();
    }
    return sum;
}

export class State {
    projectId: string;
}