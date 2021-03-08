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
export function $(selector: string): HTMLInputElement | HTMLElement {
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
 * -----------------------
 * --- TIME FORMATTING ---
 * -----------------------
 */

/**
 * Formats a given timespan to h:mm
 * @param millis Timespan in milliseconds
 */
export function formatTimespan(millis: number): string {
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
export function formatTimepoint(date: Date): string {
    const hours = date.getHours() < 10 ? "0" + date.getHours().toString() : date.getHours().toString();
    const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes().toString() : date.getMinutes().toString();
    return `${hours}:${minutes}`;
}

/**
 * @param date Date object to format
 * @returns Date formatted as yyyy-mm-dd
 */
export function formatDate(date: Date): string {
    const month = date.getMonth() < 9 ? "0" + String(date.getMonth() + 1) : String(date.getMonth()+1);
    const day = date.getDate() < 10 ? "0" + date.getDate().toString() : date.getDate.toString();
    return `${date.getFullYear()}-${month}-${day}`;
}

/**
 * @param date Input date
 * @returns the number of days from 01.01.1970 till the given date
 */
export function uniqueDayNumber(date: Date): number {
    return Math.floor(date.getTime() / (1000 * 60 * 60 * 24))
}

/**
 * ------------------
 * --- INTERFACES ---
 * ------------------
 */

export class State {
    projectId: string;
}