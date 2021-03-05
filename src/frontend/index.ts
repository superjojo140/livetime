import { ProjectApi } from "./project";
import { TimeSnippetApi } from "./timesnippet";
import * as Utils from "./utils";

async function start() {
    Utils.showTimesnippetList("1");
}

start();






















let projectApi = ProjectApi;
let timeSnippetApi = TimeSnippetApi;
export { projectApi, timeSnippetApi };

