import * as Renderer from "./renderer";
import { ProjectApi } from "./project";
import { TimeSnippet, TimeSnippetApi } from "./timesnippet";
import { getOverallTime, $, formatTimespan } from "./utils";
import { registerSnippetButtons, registerStaticButtons } from "./interaction";


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
 * - register events for project related buttons
 * - error handling for all theese jobs
 */
export async function showProject(projectId: string) {
    showProjectList(projectId).catch((err) => {
        console.error(err);
        showMessageCard("Whoops...", "Something went really wrong!", "We can't load your project list. Please log out, refresh this page and log in again", "danger");
    })
    if (projectId == undefined) {
        showMessageCard("Welcome back!", "", "Please select a project or create a new one.", "secondary");
        registerStaticButtons();
        return;
    }

    try {
        await showProjectDetails(projectId);
        await showTimesnippetList(projectId);
        showAddSnippetButtons();
        registerStaticButtons();
    }
    catch (err) {
        console.error(err);
        showMessageCard("Whoops...", "Project not found", "Maybe it does not exist or you don't have access to it.", "danger");
    }
}

export async function showTimesnippetList(projectId: string): Promise<void> {
    let snippetList = await TimeSnippetApi.getAll(projectId);
    let listHtml = Renderer.renderTimesnippetList(snippetList);
    $("#timesnippet_container").innerHTML = listHtml;
    showOverallTime(snippetList);
    registerSnippetButtons(); //Register button events
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
    let html = Renderer.renderProjectDetails(project);
    $("#project_detail").innerHTML = html;
}

/**
 * Updates the time sum in the project overview area
 */
export function showOverallTime(snippetList: TimeSnippet[]) {
    const millis = getOverallTime(snippetList);
    $("#overall_sum").innerHTML = formatTimespan(millis);
}

export function showAddSnippetButtons() {
    let data = Renderer.renderAddSnippetButtons();
    $("#add_snippet_buttons").innerHTML = data.top;
    $("#fab_container").innerHTML = data.fab;
}

export function showInvoiceCreateForm() {
    $("#livetime_invoice_create_form").style.display = "block";
    let assignBtn = $("#livetime_invoice_assign_button") as HTMLInputElement;
    assignBtn.disabled = true;
}

export function hideInvoiceCreateForm() {
    $("#livetime_invoice_create_form").style.display = "none";
    let form = $("#livetime_invoice_create_form") as HTMLFormElement;
    form.reset();
    let assignBtn = $("#livetime_invoice_assign_button") as HTMLInputElement;
    assignBtn.disabled = false;
}

export function toggleProjectDescriptionCollapse() {
    let div = $("#livetime_project_details_description");

    if (div.classList.contains("project-description-collapsed")) {
        div.classList.remove("project-description-collapsed");
    } else {
        div.classList.add("project-description-collapsed");
    }
}