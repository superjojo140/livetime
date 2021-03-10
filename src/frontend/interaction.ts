import { TimeSnippetApi } from "./timesnippet";
import { $, formatDate, registerEvent } from "./utils";
import { state } from "./index";
import { showTimesnippetList } from "./display";
import * as bootstrap from "bootstrap"

const CREATE_ID = "create";
let timesnippetModal: bootstrap.Modal, projectModal: bootstrap.Modal;

export function initModals() {
    timesnippetModal = new bootstrap.Modal($('#time_snippet_modal'));
    projectModal = new bootstrap.Modal($('#project_modal'));
}

/**
 * ------------------------
 * --- REGISTER BUTTONS ---
 * ------------------------
 */

export function registerProjectButtons() {
    registerEvent(".button-new-project", "click", function () { showProjectModal() });
    registerEvent(".button-settings-project", "click", function () { showProjectModal(this.getAttribute('data-project-id')) });
    registerEvent(".button-start-now", "click", function () { createLiveSnippet() });
    registerEvent(".button-add-time", "click", function () { showSnippetModal() });
}

export function registerSnippetButtons() {
    registerEvent(".button-done-time", "click", function () { doneSnippet(this.getAttribute('data-snippet-id')) });
    registerEvent(".button-edit-time", "click", function () { showSnippetModal(this.getAttribute('data-snippet-id')) });
    registerEvent(".button-delete-time", "click", function () { deleteSnippet(this.getAttribute('data-snippet-id')) });

}

/**
 * ------------------------
 * --- DATA INTERACTION ---
 * ------------------------
 */

export function showProjectModal(projectId?: string) {
    console.log("show project modal " + projectId)
}


export async function showSnippetModal(snippetId?: string) {
    let projectExists = (snippetId != undefined);

    let heading = $("#tsm_heading");
    let idInput = $("#tsm_snippet_id") as HTMLInputElement;
    let titleInput = $("#tsm_title") as HTMLInputElement;
    let descriptionInput = $("#tsm_description") as HTMLInputElement;
    let dateInput = $("#tsm_date") as HTMLInputElement;
    let startInput = $("#tsm_start") as HTMLInputElement;
    let endInput = $("#tsm_end") as HTMLInputElement;

    let deleteButton = $(".button-delete-tsm");
    let saveButton = $(".button-save-tsm");

    if (projectExists) {
        let snippet = await TimeSnippetApi.get(state.projectId, snippetId);

        heading.innerHTML = "Edit Time Snippet";
        deleteButton.hidden = false;
        deleteButton.onclick = () => { deleteSnippet(snippetId) }

        idInput.value = snippet.id;
        titleInput.value = snippet.title;
        descriptionInput.value = snippet.description;
        dateInput.value = formatDate(snippet.start, 'YYYY-MM-DD');
        startInput.value = formatDate(snippet.start, 'hh:mm');
        endInput.value = snippet.end ? formatDate(snippet.end, 'hh:mm') : "";
    }
    else {
        heading.innerHTML = "Create new Time Snippet";
        deleteButton.hidden = true;

        idInput.value = CREATE_ID;
        titleInput.value = "";
        descriptionInput.value = "";
        dateInput.value = formatDate(new Date(), 'YYYY-MM-DD');
        startInput.value = formatDate(new Date(), 'hh:mm');
        endInput.value = "";
    }

    saveButton.onclick = saveSnippet;

    timesnippetModal.show();
}

export async function createLiveSnippet() {
    await TimeSnippetApi.create(state.projectId, "Live Snippet", "", new Date(), null);
    await showTimesnippetList(state.projectId); //refresh TimesnippetList
}

export async function saveSnippet() {
    try {
        let idInput = $("#tsm_snippet_id") as HTMLInputElement;
        let titleInput = $("#tsm_title") as HTMLInputElement;
        let descriptionInput = $("#tsm_description") as HTMLInputElement;
        let dateInput = $("#tsm_date") as HTMLInputElement;
        let startInput = $("#tsm_start") as HTMLInputElement;
        let start = new Date(`${dateInput.value} ${startInput.value}`);
        let endInput = $("#tsm_end") as HTMLInputElement;
        let end = endInput.value == "" ? null : new Date(`${dateInput.value} ${endInput.value}`);

        if (idInput.value == CREATE_ID) {
            //create new Snippet
            await TimeSnippetApi.create(state.projectId, titleInput.value, descriptionInput.value, start, end);
        }
        else {
            //update existing snippet
            await TimeSnippetApi.update(state.projectId, idInput.value, titleInput.value, descriptionInput.value, start, end);
        }

        await showTimesnippetList(state.projectId); //refresh TimesnippetList
        timesnippetModal.hide();
        //TODO show success
    }
    catch (err) {
        console.error(err);
        //TODO Process Error, show error
    }
}

export async function doneSnippet(snippetId: string) {
    let snippet = await TimeSnippetApi.get(state.projectId, snippetId);
    snippet.end = new Date();
    await TimeSnippetApi.update(state.projectId, snippet.id, snippet.title, snippet.description, snippet.start, snippet.end);
    await showTimesnippetList(state.projectId); //refresh TimesnippetList
}

export async function deleteSnippet(snippetId: string) {
    if (confirm("Wirklich löschen?")) {
        await TimeSnippetApi.delete(state.projectId, snippetId);
        await showTimesnippetList(state.projectId); //refresh TimesnippetList
        timesnippetModal.hide(); //if delete was triggered form modal...
    }
}