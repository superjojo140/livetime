import { showLoginModal } from "./interaction";
import { TimeSnippet, TimeSnippetApi } from "./timesnippet";

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
 * Calculates the overall sum of all timesnippets in the given snippet list
 * Live Snippets are handled as if their end time is now
 * @return the overall time in milliseconds
 */
export function getOverallTime(snippetList: TimeSnippet[]): number {
    let sum = 0;

    for (const snippet of snippetList) {
        let end = (snippet.end == null) ? new Date() : snippet.end //Set current timepoint as temporary end for live snippets
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
export function registerEvent(selector, eventType, handler) {
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
    let hours = Math.floor(millis / (1000 * 60 * 60));
    let hoursString = hours.toString();
    let minutes = Math.floor(millis % (1000 * 60 * 60) / (1000 * 60));
    let minutesString = minutes < 10 ? "0" + minutes.toString() : minutes.toString();
    return `${hoursString}:${minutesString}`;
}

/**
 * Formats a date as string specified by a template string
 * @param date Date to be formatted
 * @param templateString Template of the expected format. e.g. "YYYY-MM-DD hh:mm:ss" or "YY-M-D h:m:s" to trim leading zeros
 */
export function formatDate(date: Date, templateString: string): string {
    const year = date.getFullYear().toString();
    const shortYear = date.getFullYear().toString().substr(2, 2);
    const month = date.getMonth() < 9 ? "0" + String(date.getMonth() + 1) : String(date.getMonth() + 1);
    const shortMonth = String(date.getMonth() + 1);
    const day = date.getDate() < 10 ? "0" + date.getDate().toString() : date.getDate().toString();
    const shortDay = date.getDate().toString();
    const hours = date.getHours() < 10 ? "0" + date.getHours().toString() : date.getHours().toString();
    const shortHours = date.getHours().toString();
    const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes().toString() : date.getMinutes().toString();
    const shortMinutes = date.getMinutes().toString();
    const seconds = date.getSeconds() < 10 ? "0" + date.getSeconds().toString() : date.getSeconds().toString();
    const shortSeconds = date.getSeconds().toString();

    return templateString
        .replace('YYYY', year)
        .replace('YY', shortYear)
        .replace('MM', month)
        .replace('M', shortMonth)
        .replace('DD', day)
        .replace('D', shortDay)
        .replace('hh', hours)
        .replace('h', shortHours)
        .replace('mm', minutes)
        .replace('m', shortMinutes)
        .replace('ss', seconds)
        .replace('s', shortSeconds)
}

/**
 * @param date Input date
 * @returns the number of days from 01.01.1970 till the given date
 */
export function uniqueDayNumber(date: Date): number {
    return Math.floor(date.getTime() / (1000 * 60 * 60 * 24))
}

/**
 * -------------------------------
 * --- LOGIN / USER MANAGEMENT ---
 * -------------------------------
 */

export async function livetimeCheckLogin() {

    const jwt = localStorage.getItem("sj_jwt");

    let resp = await fetch(`${process.env.USER_SERVER_URL}/user`,
        {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': `Bearer ${jwt}`
            }
        }
    );

    if (!resp.ok) {
        showLoginModal();
        throw new Error("Not logged in")
    }
    let user = await resp.json();
    return user;
}

export function loadMenu(){
     //show menu from superjojode
     let menuScript = document.createElement("script");
     menuScript.src = `${process.env.USER_SERVER_URL}/menu/js`;
     document.body.appendChild(menuScript);
}



/**
 * ------------------
 * --- INTERFACES ---
 * ------------------
 */

export class State {
    projectId: string;
}