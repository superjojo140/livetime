import { showProject } from "./display";
import { initModals } from "./interaction";
import { ProjectApi } from "./project";
import { TimeSnippetApi } from "./timesnippet";
import * as Utils from "./utils";

let state = new Utils.State();

async function start() {
    initModals();
    state.projectId = Utils.getUrlParam("project");
    showProject(state.projectId);
}

start();






















let pApi = ProjectApi;
let tApi = TimeSnippetApi;
export { pApi, tApi, state };

