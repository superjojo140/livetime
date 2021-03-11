import { showProject, showTimesnippetList } from "./display";
import { initModals } from "./interaction";
import { ProjectApi } from "./project";
import { TimeSnippetApi } from "./timesnippet";
import * as Utils from "./utils";

const ONCE_PER_MINUTE = 60 * 1000;
let state = new Utils.State();

async function start() {
    initModals();
    setInterval(()=>{showTimesnippetList(state.projectId)},ONCE_PER_MINUTE) //Auto update snippet list every minute
    state.projectId = Utils.getUrlParam("project");
    showProject(state.projectId);
}

start();






















let pApi = ProjectApi;
let tApi = TimeSnippetApi;
export { pApi, tApi, state };

