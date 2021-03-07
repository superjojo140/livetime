import { Project } from "./project";
import { TimeSnippet } from "./timesnippet";

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

    let start = formatTimepoint(snippet.start);
    let end = formatTimepoint(snippet.end);

    let fromTo = isLive ? `Started: ${start}` : `${start} - ${end}`;
    let secondButton = isLive ? `<button class="btn btn-outline-success done-button" type="button" data-snippet-id="${snippet.id}"><i
    class="fas fa-check"></i>&nbsp;Done</button>` : `<button class="btn btn-outline-danger delete-button" type="button" data-snippet-id="${snippet.id}"><i
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
                            <button class="btn btn-outline-primary edit-button" type="button" data-snippet-id="${snippet.id}"><i
                                    class="fas fa-pen"></i>&nbsp;Edit</button>
                            ${secondButton}
                        </div>
                    </div>
                </div>
            </div>
            <!-- Mobile Only -->
            <div class="row d-flex d-md-none mt-2">
                <div class="col d-grid">
                    <button class="btn btn-outline-primary edit-button" type="button" data-snippet-id="${snippet.id}">
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
    if (list.length < 1) { return renderMessageCard("Let's get started","No snippets in this project","Add snippets by clicking on the blue or green buttons above.","primary"); }

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
 * @param list projectList to be rendered
 * @param activeId project id of the currently active project (this is rendered highlighted)
 */
export function renderProjectList(list: Project[],activeId:string): string {
    let html = "";
    for (const project of list) {
        let active = (project.id == activeId);
        html += renderProjectListItem(project,active);
    }
    return html;
}

export function renderMessageCard(heading:string,title:string,text:string,theme:string){
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



/**
 * Formats a given timespan to h:mm
 * @param millis Timespan in milliseconds
 */
function formatTimespan(millis: number): string {
    let hours = Math.round(millis / (1000 * 60 * 60));
    let hoursString = hours.toString();
    let minutes = Math.round(millis % (1000 * 60 * 60) / (1000 * 60));
    let minutesString = minutes < 10 ? "0" + minutes.toString() : minutes.toString();
    return `${hoursString}:${minutesString}`;
}

/**
 * @param date Date object to format
 * @returns Timepoint formatted as hh:mm
 */
function formatTimepoint(date: Date): string {
    const hours = date.getHours() < 10 ? "0" + date.getHours().toString() : date.getHours().toString();
    const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes().toString() : date.getMinutes().toString();
    return `${hours}:${minutes}`;
}

/**
 * @param date Input date
 * @returns the number of days from 01.01.1970 till the given date
 */
function uniqueDayNumber(date: Date): number {
    return Math.floor(date.getTime() / (1000 * 60 * 60 * 24))
}