import { state } from ".";
import { Invoice } from "./invoice";
import { Project } from "./project";
import { TimeSnippet } from "./timesnippet";
import { formatDate, formatTimespan, uniqueDayNumber } from "./utils";

/**
 * Renders timesnippet to html
 * This function creates a "live snippets" if snippet.end is null
 * It does NOT register button events but generate "<action>-button" classes and data-snippet-id attributes
 * @param snippet the snippet data to be rendered
 */
export function renderTimesnippet(snippet: TimeSnippet): string {
    let isLive = (snippet.end == null);

    if (isLive) {
        //Set current timepoint as temporary end
        snippet.end = new Date();
    }

    let durationMillis = snippet.end.getTime() - snippet.start.getTime();
    let duration = formatTimespan(durationMillis);

    let start = formatDate(snippet.start, 'hh:mm');
    let end = formatDate(snippet.end, 'hh:mm');

    let fromTo = isLive ? `Started: ${start}` : `${start} - ${end}`;
    let secondButton = isLive ? `<button class="btn btn-outline-success button-done-time" type="button" data-snippet-id="${snippet.id}"><i
    class="fas fa-check"></i>&nbsp;Done</button>` : `<button class="btn btn-outline-danger button-delete-time" type="button" data-snippet-id="${snippet.id}"><i
    class="fas fa-times"></i>&nbsp;Delete</button>`;

    let html = `
    <div class="card shadow mb-3 ${isLive ? 'bg-light-primary' : 'hover-light'}">
        <div class="card-body">
            <div class="row">
                <!-- Desktop only -->
                <div class="col-2 d-flex align-items-center justify-content-center d-none d-md-block">
                    <div class="text-center">
                        <h2>${duration}</h2>
                        ${isLive ? '<h6><i class="far fa-dot-circle live-dot"></i>&nbsp;Live</h6>' : ''}
                    </div>
                </div>
                <!-- Mobile Only -->
                <div class="col-6 align-items-start justify-content-start d-flex d-md-none">
                    <div class="text-center">
                        <strong class="text-lg">${duration}</strong>&nbsp;
                        ${isLive ? '<span><i class="far fa-dot-circle live-dot"></i>&nbsp;Live</span>' : ''}
                    </div>
                </div>
                <div class="col-6 align-items-end justify-content-end d-flex d-md-none">
                    <div class="text-end">
                        <span>${fromTo}</span>
                    </div>
                </div>
                <hr class="d-md-none">
                <!-- Mobile and Desktop -->
                <div class="col-md-6 d-flex align-items-center">
                    <div>
                        <h4>${snippet.title}</h4>
                        <small class="">${snippet.description}</small>
                    </div>
                </div>
                <!-- Desktop only -->
                <div class="col-4 d-none d-md-block">
                    <div class="row">
                        <div class="col-12 text-end">
                            <span>${fromTo}</span>
                        </div>
                    </div>
                    <div class="row align-items-baseline">
                        <div class="col-12 text-end pt-3">
                            <button class="btn btn-outline-primary button-edit-time" type="button" data-snippet-id="${snippet.id}"><i
                                    class="fas fa-pen"></i>&nbsp;Edit</button>
                            ${secondButton}
                        </div>
                    </div>
                </div>
            </div>
            <!-- Mobile Only -->
            <div class="row d-flex d-md-none mt-2">
                <div class="col d-grid">
                    <button class="btn btn-outline-primary button-edit-time" type="button" data-snippet-id="${snippet.id}">
                        <i class="fas fa-pen"></i>&nbsp;Edit
                    </button>
                </div>
                <div class="col d-grid">
                    ${secondButton}
                </div>
            </div>
        </div>
    </div>
    `;

    return html;
}

/**
 * Renders all given timesnippets and adds date labels in between
 * @param list List of timesippets to be rendered
 */
export function renderTimesnippetList(list: TimeSnippet[]): string {
    if (list.length < 1) { return renderMessageCard("Let's get started", "No snippets in this project", "Add snippets by clicking on the blue or green buttons above.<br>Snippets assigned to invoices are not displayed here. Use the invoices view to export billed snippets.", "primary"); }

    let listHtml = "";
    let currentDay = -1;

    for (let snippet of list) {
        if (currentDay != uniqueDayNumber(snippet.start)) {
            listHtml += renderDateLabel(snippet.start); //Add a new date label
            currentDay = uniqueDayNumber(snippet.start);
        }
        listHtml += renderTimesnippet(snippet);
    }
    return listHtml;
}

/**
 * Renders a little label with the day of the given date
 * @param date date of the day to be displayed in the date label
 */
export function renderDateLabel(date: Date): string {
    const today = new Date();
    let text = date.toLocaleDateString();
    if (uniqueDayNumber(date) == uniqueDayNumber(today)) {
        text = 'Today'
    }
    else if (uniqueDayNumber(date) == uniqueDayNumber(today) - 1) {
        text = 'Yesterday'
    }

    return `
    <div class="row d-flex justify-content-center">
        <div class="col-lg-2 col-md-3  col-sm-4 col-6 text-center">
          <span class="badge bg-info m-2 full-width">${text}</span>
        </div>
    </div>`;
}

/**
 * @param project the project data to be rendered
 * @param active @default false wether this project is highlighted as active
 */
export function renderProjectListItem(project: Project, active?: boolean): string {
    return `
    <li class="nav-item">
        <a class="nav-link hover-info ${active ? 'link-info text-big' : 'text-muted'}" href="${process.env.OWN_SERVER_URL}/?project=${project.id}" title="${project.description}">
           ${project.title}
        </a>
    </li>`;
}

/**
 * Renders the project detail view
 * @param project the project data
 */
export function renderProjectDetails(project: Project) {
    return `
    <div class="card">
        <div class="card-body">
            <div class="row d-flex flex-row-reverse">
                <div class="col-md-2 text-end">
                    <button class="btn btn-lg btn-outline-light text-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fa-lg fas fa-cog"></i>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item button-settings-project" data-project-id="${project.id}">
                        <i class="fas fa-pen"></i> Edit project title
                        </a></li>
                        <li><a class="dropdown-item button-project-attributes-modal" data-project-id="${project.id}">
                        <i class="fas fa-wrench"></i> Edit project attributes
                        </a></li>
                        <li><a class="dropdown-item button-invoices-modal" data-project-id="${project.id}">
                        <i class="fas fa-money-bill-wave"></i> Invoices
                        </a></li>
                    </ul>
                </div>
                <div class="col-md-8 text-center">
                    <h2>${project.title}</h2>
                    <div class="text-muted project-description-collapsed" id="livetime_project_details_description">
                        ${project.description}
                    </div>
                    <a class="btn btn-outline-secondary btn-sm" id="livetime_project_description_toggle_button">Show more Details</a>
                    <br>
                    <div class="btn-group mt-4" role="group" aria-label="Basic example">
                        <button type="button" class="btn btn-primary px-3">Time</button>
                        <button type="button" class="btn btn-outline-primary px-3">Todo</button>
                        <button type="button" class="btn btn-outline-primary px-3">Notes</button>
                    </div>
                </div>
                <div class="col-md-2 justify-content-end align-items-center d-flex flex-column">
                    <div class="mt-4">
                        <span class="line-height-sm">Total <strong class="text-xl" id="overall_sum">-</strong></span>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

/**
 * @param list list of invoices to be rendered
 */
export function renderInvoiceTable(list: Invoice[]): string {
    let html = `<thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Date</th>
                        <th scope="col">First Snippet</th>
                        <th scope="col">Last Snippet</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>`;


    for (const invoice of list) {
        html += `<tr>
                    <td>${invoice.id}</td>
                    <td>${formatDate(invoice.date,"DD.MM.YYYY")}</td>
                    <td>${formatDate(invoice.firstStart,"DD.MM.YYYY")}</td>
                    <td>${formatDate(invoice.lastStart,"DD.MM.YYYY")}</td>
                    <td><button class="btn btn-rounded btn-secondary livetime-invoice-export-button" data-invoice-id="${invoice.id}"><i class="fas fa-file-export"></i> Export</button></td>
                </tr>`
    }

    html += `</tbody>`;
    return html;
}

/**
 * @param list projectList to be rendered
 * @param activeId project id of the currently active project (this is rendered highlighted)
 */
export function renderProjectList(list: Project[], activeId: string): string {
    let html = "";
    for (const project of list) {
        let active = (project.id == activeId);
        html += renderProjectListItem(project, active);
    }
    return html;
}

export function renderMessageCard(heading: string, title: string, text: string, theme: string) {
    return `
    <div class="d-flex justify-content-center align-items-center mt-5">
        <div class="card text-white bg-${theme} mb-3" style="min-width: 60%;">
            <div class="card-header d-flex justify-content-between">
                <div>${heading}</div>
                <div><i class="fas fa-exclamation-triangle"></i></div>
            </div>
            <div class="card-body bg-light text-dark">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">${text}</p>
            </div>
        </div>
    </div>`;
}

export function renderAddSnippetButtons() {
    let topButtons = `
    <!-- Add new Element button on desktop-->
    <div class="col-md-3 text-center d-none d-md-block">
        <button class="btn btn-primary btn-rounded button-live-snippet"> <i class="fas fa-dot-circle"></i>&nbsp;Start
            now</button>
    </div>
    <div class="col-md-4">
        <div class="input-group">
            <span class="input-group-text"> <i class="fas fa-filter"></i></span>
            <input type="text" class="form-control form-control-sm bg-light" placeholder="Filter...">
        </div>
    </div>
    <!-- Add new Element button on desktop-->
    <div class="col-md-3 text-center d-none d-md-block">
        <button class="btn btn-success btn-rounded button-add-time"> <i class="fas fa-plus-circle"></i>&nbsp;Add
            time</button>
    </div>
    <!-- Add new Element buttons on mobile-->
    <div class="col-md-4 text-center d-flex d-md-none mt-3 justify-content-around">
        <button class="btn py-3 px-4 btn-primary btn-rounded button-live-snippet">
            <i class="fas fa-dot-circle"></i>&nbsp;Start now
        </button>
        <button class="btn py-3 px-4 btn-success btn-rounded button-add-time">
            <i class="fas fa-plus-circle"></i>&nbsp;Add time
        </button>
    </div>`;



    let faButton = `
    <button class="btn btn-primary p-3 btn-rounded shadow-lg fab-button  button-add-time">
    <i class="fas fa-plus fa-lg"></i>
    </button>`;

    return { top: topButtons, fab: faButton };
}


