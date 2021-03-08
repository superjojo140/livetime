import * as Renderer from "./renderer";
import { ProjectApi } from "./project";
import { TimeSnippetApi } from "./timesnippet";
import { getOverallTime,$ } from "./utils";
import { registerButtons } from "./interaction";


/**
 * -------------------------
 * --- DISPLAY FUNCTIONS ---
 * -------------------------
 */


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
        .then(()=>{
            showAddSnippetButtons();
            registerButtons();
        })
        .catch((err) => {
            console.error(err);
            showMessageCard("Whoops...", "Project not found", "Maybe it does not exist or you don't have access to it.", "danger");
        })
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

export function showAddSnippetButtons() {
    let data = Renderer.renderAddSnippetButtons();
    $("#add_snippet_buttons").innerHTML = data.top;
    $("#fab_container").innerHTML = data.fab;
}