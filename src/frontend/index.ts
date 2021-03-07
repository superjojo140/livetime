import { ProjectApi } from "./project";
import { TimeSnippetApi } from "./timesnippet";
import * as Utils from "./utils";

let state = new Utils.State();

async function start() {
    state.projectId = Utils.getUrlParam("project");
    Utils.showProjectList(state.projectId);
    if (state.projectId) {
        try {
            await Utils.showTimesnippetList(state.projectId);
        }
        catch(e){
            Utils.showMessageCard("Whoops...","Project not found","Maybe it does not exist or you don't have access to it.","danger");
        }
    }
}

start();






















let projectApi = ProjectApi;
let timeSnippetApi = TimeSnippetApi;
export { projectApi, timeSnippetApi };

