import { showProject } from "./display";
import { ProjectApi } from "./project";
import { TimeSnippetApi } from "./timesnippet";
import * as Utils from "./utils";

let state = new Utils.State();

async function start() {
    state.projectId = Utils.getUrlParam("project");
    showProject(state.projectId);
}

start();






















let projectApi = ProjectApi;
let timeSnippetApi = TimeSnippetApi;
export { projectApi, timeSnippetApi };

