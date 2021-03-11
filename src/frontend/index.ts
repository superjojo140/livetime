import { showProject, showTimesnippetList } from "./display";
import { initBootstrapElements, showToast } from "./interaction";
import { ProjectApi } from "./project";
import { TimeSnippetApi } from "./timesnippet";
import * as Utils from "./utils";

const ONCE_PER_MINUTE = 60 * 1000;
let state = new Utils.State();

async function start() {
    initBootstrapElements();
    setInterval(() => { showTimesnippetList(state.projectId) }, ONCE_PER_MINUTE) //Auto update snippet list every minute
    state.projectId = Utils.getUrlParam("project");
    showProject(state.projectId);
}

start();






















let pApi = ProjectApi;
let tApi = TimeSnippetApi;
let toast = showToast;
export { pApi, tApi, toast, state };

