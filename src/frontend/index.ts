import { showProject, showTimesnippetList } from "./display";
import { initBootstrapElements, showToast } from "./interaction";
import { InvoiceAPI } from "./invoice";
import { ProjectApi } from "./project";
import { TimeSnippetApi } from "./timesnippet";
import * as Utils from "./utils";
import { livetimeCheckLogin } from "./utils";

const ONCE_PER_MINUTE = 60 * 1000;
let state = new Utils.State();

async function start() {
    try {
        Utils.loadMenu();
        initBootstrapElements();
        await livetimeCheckLogin();
        setInterval(() => { showTimesnippetList(state.projectId) }, ONCE_PER_MINUTE) //Auto update snippet list every minute
        state.projectId = Utils.getUrlParam("project");
        showProject(state.projectId);
    } catch (e) { console.error(e); }
}

start();


let pApi = ProjectApi;
let tApi = TimeSnippetApi;
let iApi = InvoiceAPI;
let toast = showToast;
export { iApi, pApi, tApi, toast, state };

