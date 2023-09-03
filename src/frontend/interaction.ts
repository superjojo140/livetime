import { TimeSnippetApi } from "./timesnippet";
import { $, formatDate, registerEvent } from "./utils";
import { state } from "./index";
import { hideInvoiceCreateForm, showInvoiceCreateForm, showProject, showTimesnippetList, toggleProjectDescriptionCollapse } from "./display";
import * as bootstrap from "bootstrap"
import { ProjectApi } from "./project";
import { renderInvoiceTable } from "./renderer";
import { InvoiceAPI } from "./invoice";

const CREATE_ID = "create";
let timesnippetModal: bootstrap.Modal;
let projectModal: bootstrap.Modal;
let confirmModal: bootstrap.Modal;
let alertModal: bootstrap.Modal;
let loginModal: bootstrap.Modal;
let invoiceModal: bootstrap.Modal;
let projectAttributesModal: bootstrap.Modal;
let toast: bootstrap.Toast;

export function initBootstrapElements() {
    timesnippetModal = new bootstrap.Modal($('#time_snippet_modal'));
    projectModal = new bootstrap.Modal($('#project_modal'));
    confirmModal = new bootstrap.Modal($('#confirm_modal'));
    alertModal = new bootstrap.Modal($('#alert_modal'));
    invoiceModal = new bootstrap.Modal($('#invoice_modal'));
    projectAttributesModal = new bootstrap.Modal($('#project_attributes_modal'));
    loginModal = new bootstrap.Modal($('#login_modal'), { backdrop: "static", keyboard: false });
    toast = new bootstrap.Toast($("#toast"))
}

/**
 * ------------------------
 * --- REGISTER BUTTONS ---
 * ------------------------
 */

export function registerStaticButtons() {
    registerEvent(".button-new-project", "click", function () { showProjectModal() });
    registerEvent("#livetime_project_description_toggle_button", "click", toggleProjectDescriptionCollapse);
    registerEvent(".button-settings-project", "click", function () { showProjectModal(this.getAttribute('data-project-id')) });

    registerEvent(".button-project-attributes-modal", "click", function () { showProjectAttributesModal() });
    showProjectAttributesModal(); //TODO Remove test statement!!!

    registerEvent(".button-invoices-modal", "click", function () { showInvoiceModal() });
    registerEvent("#livetime_invoice_assign_button", "click", showInvoiceCreateForm);
    registerEvent("#livetime_invoice_create_cancel_button", "click", hideInvoiceCreateForm);
    registerEvent("#livetime_invoice_create_form", "submit", (event) => { event.preventDefault(); assignToNewInvoice(); });

    registerEvent(".button-live-snippet", "click", function () { createLiveSnippet() });
    registerEvent(".button-add-time", "click", function () { showSnippetModal() });
    registerEvent("#tsm_form", "submit", (event) => { saveSnippet(); event.preventDefault(); });
    registerEvent("#pm_form", "submit", (event) => { saveProject(); event.preventDefault(); });

    registerEvent(".button-pretty-start", "click", helperPrettyStart);
    registerEvent(".button-start-now", "click", helperStartNow);
    registerEvent(".button-pretty-end", "click", helperPrettyEnd);
    registerEvent(".button-end-now", "click", helperEndNow);
    registerEvent(".button-time-preset", "click", helperTimePreset);
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

export async function showProjectModal(projectId?: string) {
    let projectExists = (projectId != undefined);

    let heading = $("#pm_heading");
    let idInput = $("#pm_project_id") as HTMLInputElement;
    let titleInput = $("#pm_title") as HTMLInputElement;
    let descriptionInput = $("#pm_description") as HTMLInputElement;
    let deleteButton = $(".button-delete-pm");

    if (projectExists) {
        let project = await ProjectApi.get(projectId);

        heading.innerHTML = "Edit Project Data";
        deleteButton.hidden = false;
        deleteButton.onclick = () => { deleteProject(projectId) }

        idInput.value = project.id;
        titleInput.value = project.title;
        descriptionInput.value = project.description;
    }
    else {
        heading.innerHTML = "Create new Project";
        deleteButton.hidden = true;

        idInput.value = CREATE_ID;
        titleInput.value = "";
        descriptionInput.value = "";
    }

    projectModal.show();
}

export async function showInvoiceModal() {
    try {
        let projectId = state.projectId;
        hideInvoiceCreateForm();
        $("#livetime_invoice_assign_alert").style.display = "none";

        let unassignedList = await InvoiceAPI.getUnassigned(projectId);
        let unassignedCount = unassignedList.length;
        $("#livetime_invoice_unassigned_count").innerHTML = String(unassignedCount);

        if (unassignedCount > 0) {
            let firstUnassigned = unassignedList[unassignedCount - 1];
            $("#livetime_invoice_unassigned_first").innerHTML = formatDate(firstUnassigned.start, "DD.MM.YYYY");
            let lastUnassigned = unassignedList[0];
            $("#livetime_invoice_unassigned_last").innerHTML = formatDate(lastUnassigned.start, "DD.MM.YYYY");
            $("#livetime_invoice_assign_alert").style.display = "block";
        }

        let invoiceList = await InvoiceAPI.getAll(projectId);
        let invoiceTable = renderInvoiceTable(invoiceList);
        $("#livetime_invoice_table").innerHTML = invoiceTable;

        registerEvent(".livetime-invoice-export-button", "click", async function () {
            let invoiceId = this.getAttribute('data-invoice-id');
            let snippetList = await InvoiceAPI.getSnippetsByInvoice(projectId, invoiceId);
            invoiceModal.hide();
            prettyAlert(`JSON export for invoice <b>${invoiceId}</b>`, `<code>${JSON.stringify(snippetList)}<code>`);
        })

        invoiceModal.show();
    } catch (err) {
        console.error(err);
        showToast("Can't open invoices", err.message, "danger");
    }
}

export async function showProjectAttributesModal() {
    try {
        let projectId = state.projectId;
        projectAttributesModal.show();
    } catch (err) {
        console.error(err);
        showToast("Can't load project attributes", err.message, "danger");
    }
}

export async function assignToNewInvoice() {
    try {
        let idInput = $("#livetime_invoice_assign_id") as HTMLInputElement;
        let invoiceId = idInput.value;
        let invoiceDate = $("#livetime_invoice_assign_date") as HTMLInputElement;
        let timestamp = new Date(invoiceDate.value).toISOString();

        let resp = await InvoiceAPI.create(state.projectId, invoiceId, timestamp);
        showToast(`Assigned to new invoice`, `Created new invoice with id "${resp}" and assigned all free snippets.`, "success");
        showTimesnippetList(state.projectId);
        showInvoiceModal();
    }
    catch (err) {
        console.error(err);
        showToast("Can't assign", err.message, "danger");
    }
}

export async function saveProject() {
    try {
        let idInput = $("#pm_project_id") as HTMLInputElement;
        let projectId = idInput.value;
        let titleInput = $("#pm_title") as HTMLInputElement;
        let descriptionInput = $("#pm_description") as HTMLInputElement;

        if (idInput.value == CREATE_ID) {
            //create new Snippet
            projectId = await ProjectApi.create(titleInput.value, descriptionInput.value, "");
        }
        else {
            //update existing snippet
            await ProjectApi.update(idInput.value, titleInput.value, descriptionInput.value, ""); //TODO save Notes
        }

        projectModal.hide();
        window.location.href = `${process.env.OWN_SERVER_URL}/?project=${projectId}`
        //showToast("Saved", "Your changes were saved", "success");
    }
    catch (err) {
        console.error(err);
        showToast("Can't save", err.message, "danger");
    }
}


export async function deleteProject(projectId: string) {
    prettyConfirm("Do you really want to delete this project?").then(async () => {
        await ProjectApi.delete(projectId);
        projectModal.hide(); //if delete was triggered form modal...
        window.location.href = `${process.env.OWN_SERVER_URL}/`
        //showToast("Bye Bye", "Your project was deleted", "success");        
    }).catch(() => { });
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

    timesnippetModal.show();
}

export async function createLiveSnippet() {
    await TimeSnippetApi.create(state.projectId, "Live Snippet", "", new Date(), null);
    await showTimesnippetList(state.projectId); //refresh TimesnippetList
    //showToast("Start now!", "Your live snippet was created", "success");
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
        //showToast("Saved", "Your changes were saved", "success");
    }
    catch (err) {
        console.error(err);
        showToast("Can't save", err.message, "danger");
    }
}

export async function doneSnippet(snippetId: string) {
    let snippet = await TimeSnippetApi.get(state.projectId, snippetId);
    snippet.end = new Date();
    await TimeSnippetApi.update(state.projectId, snippet.id, snippet.title, snippet.description, snippet.start, snippet.end);
    await showTimesnippetList(state.projectId); //refresh TimesnippetList
    //showToast("All right", "Your snippet is marked as done", "success");
}

export async function deleteSnippet(snippetId: string) {
    prettyConfirm("Do you really want to delete this snippet?").then(async () => {
        await TimeSnippetApi.delete(state.projectId, snippetId);
        await showTimesnippetList(state.projectId); //refresh TimesnippetList
        timesnippetModal.hide(); //if delete was triggered form modal...
        //showToast("Bye Bye", "Your snippet was deleted", "success");        
    }).catch(() => { });
}

export function showToast(title: string, text: string, theme: string) {
    $("#toast_header").innerHTML = title;
    $("#toast_body").innerHTML = text;
    $("#toast").className = `toast text-white bg-${theme}`;
    toast.show();
}

export function prettyAlert(title: string, text: string): void {
    $("#alert_modal_title").innerHTML = title;
    $("#alert_modal_body").innerHTML = text;
    alertModal.show();
}

export function prettyConfirm(text: string): Promise<void> {
    return new Promise(function (resolve, reject) {
        $("#confirm_modal_body").innerHTML = text;
        $("#confirm_modal_yes").onclick = () => { confirmModal.hide(); resolve() };
        $("#confirm_modal_yes").innerHTML = yesVariants[Math.floor(Math.random() * (yesVariants.length - 1))]
        $("#confirm_modal_no").onclick = () => { confirmModal.hide(); reject() };
        $("#confirm_modal_no").innerHTML = noVariants[Math.floor(Math.random() * (noVariants.length - 1))]
        confirmModal.show();
    });
}

const yesVariants = ["Yes of course", "Yupp", "Yes Sir", "Yes mum", "Do it!", "Why not...", "Yeah man", "Yes"];
const noVariants = ["Never", "Nope", "Not really", "No no no", "Nooooooo", "Better not", "Uhhh... no!", "No"];

/**
 * ----------------------------------
 * ------- Input Helper -------------
 * ----------------------------------
 */

function helperPrettyStart() {
    let startInput = $("#tsm_start") as HTMLInputElement;
    let dateInput = $("#tsm_date") as HTMLInputElement;
    let time = helperRoundTime(new Date(`${dateInput.value} ${startInput.value}`));
    startInput.value = formatDate((time), "hh:mm");
}

function helperPrettyEnd() {
    let endInput = $("#tsm_end") as HTMLInputElement;
    let dateInput = $("#tsm_date") as HTMLInputElement;
    let time = helperRoundTime(new Date(`${dateInput.value} ${endInput.value}`));
    endInput.value = formatDate((time), "hh:mm");
}

/**
 * Sets a given date to a rounded time.
 * That means rounded to full quarter hours with a tendency to floor
 * @example 11:03 -> 11:00
 * @example 11:10 -> 11:00
 * @example 11:11 -> 11:15
 * @example 11:00 -> 11:00
 * @param date Date to round
 */
function helperRoundTime(date: Date) {
    let minutes = date.getMinutes();
    let hours = date.getHours();
    if (minutes <= 10) { date.setMinutes(0, 0, 0) }
    else if (minutes <= 25) { date.setMinutes(15, 0, 0) }
    else if (minutes <= 40) { date.setMinutes(30, 0, 0) }
    else if (minutes <= 55) { date.setMinutes(45, 0, 0) }
    else { date.setHours(hours + 1, 0, 0, 0) }
    return date;
}

function helperEndNow() {
    let endInput = $("#tsm_end") as HTMLInputElement;
    endInput.value = formatDate(new Date(), "hh:mm");
    let startInput = $("#tsm_start") as HTMLInputElement;
    startInput.value = "";
}

function helperStartNow() {
    let endInput = $("#tsm_end") as HTMLInputElement;
    let startInput = $("#tsm_start") as HTMLInputElement;
    startInput.value = formatDate(new Date(), "hh:mm");
    endInput.value = "";
}

/**
 * Set the start or end input in a way that the difference is the given timespan
 * start unset, end unset -> set start to now, end to timespan
 * start unset, end set -> set start to timespan
 * start set, end unset -> set end to timespan
 * start set, end set -> keep start, set end to timespan
 */
function helperTimePreset() {
    let minutes = this.getAttribute('data-time');
    let millis = minutes * 60 * 1000;
    let endInput = $("#tsm_end") as HTMLInputElement;
    let startInput = $("#tsm_start") as HTMLInputElement;
    let dateInput = $("#tsm_date") as HTMLInputElement;

    if (startInput.value == "" && endInput.value != "") {
        //set start value
        let end = new Date(`${dateInput.value} ${endInput.value}`);
        let start = new Date(end.getTime() - millis);
        startInput.value = formatDate(start, "hh:mm");
    } else {
        //set end value
        if (startInput.value == "") {
            helperStartNow();
        }
        let start = new Date(`${dateInput.value} ${startInput.value}`);
        let end = new Date(start.getTime() + millis);
        endInput.value = formatDate(end, "hh:mm");
    }
}


/**
 * ----------------------------------
 * ------- Handle Login -------------
 * ----------------------------------
 */
async function livetimeLogin() {

    let userInput = { username: undefined, password: undefined };
    userInput.username = ($("#livetime_login_username") as HTMLInputElement).value;
    userInput.password = ($("#livetime_login_password") as HTMLInputElement).value;

    try {
        let resp = await fetch(`${process.env.USER_SERVER_URL}/login`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(userInput)
        });

        if (await resp.ok == false) {
            throw new Error("Could not load user data. Authentification failed");
        }

        let jsonResp = await resp.json();
        const jwt = jsonResp.jwt;
        localStorage.setItem("sj_jwt", jwt);
        window.location.reload(); //Reload the page with the new JWT in localStorage
    }
    catch (error) {
        $("#livetime_login_message").innerHTML = "Login failed - Please try again!";
        console.warn(error);
    }

}

export function showLoginModal() {
    registerEvent("#login_modal_form", "submit", (event) => { livetimeLogin(); event.preventDefault(); });
    loginModal.show();
}