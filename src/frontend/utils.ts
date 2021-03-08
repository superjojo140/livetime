import { TimeSnippetApi } from "./timesnippet";

/**
 * --------------
 * --- HELPER ---
 * --------------
 */

/**
 * Returns a HTML Element specified by the given selector
 * @param selector HTML selector
 */
export function $(selector: string): HTMLElement {
    return document.querySelector(selector);
}

export function getUrlParam(key: string) {
    let url = new URL(document.location.href);
    return url.searchParams.get(key);
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

/**
 * Register an eventhandler to ALL matching DOM elements
 * @param selector Queryselector of all intended elements
 * @param eventType type of the event e.g. 'click'
 * @param handler Function to handle the event e.g. (event)=>{...}
 */
export function registerEvent(selector,eventType,handler) {
    const elements = document.querySelectorAll(selector);

    for (const elem of elements) {
        elem.addEventListener(eventType, handler);
    }
}

/**
 * ------------------
 * --- INTERFACES ---
 * ------------------
 */

export class State {
    projectId: string;
}