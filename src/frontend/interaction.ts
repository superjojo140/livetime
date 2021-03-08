import { registerEvent } from "./utils";


/**
 * ------------------------
 * --- REGISTER BUTTONS ---
 * ------------------------
 */

export function registerButtons() {
    registerProjectButtons();
    registerSnippetButtons();
}

export function registerProjectButtons() {
    registerEvent(".button-new-project","click",function(){showProjectModal()});
    registerEvent(".button-settings-project","click",function(){showProjectModal(this.getAttribute('data-project-id'))});
    registerEvent(".button-start-now","click",function(){showSnippetModal(true)});
    registerEvent(".button-add-time","click",function(){showSnippetModal(false)});
}

export function registerSnippetButtons() {
    registerEvent(".button-done-time","click",function(){doneSnippet(this.getAttribute('data-snippet-id'))});
    registerEvent(".button-edit-time","click",function(){showSnippetModal(false,this.getAttribute('data-snippet-id'))});
    registerEvent(".button-delete-time","click",function(){deleteSnippet(this.getAttribute('data-snippet-id'))});

}

/**
 * ------------------------
 * --- DATA INTERACTION ---
 * ------------------------
 */

export function showProjectModal(projectId?:string) {
    console.log("show project modal " + projectId)
}

export function showSnippetModal(isLive:boolean,snippetId?:string) {
    console.log("show snippet modal " + snippetId)
    
}

export function doneSnippet(snippetId:string) {
    console.log("done snippet " + snippetId)
    
}

export function deleteSnippet(snippetId:string) {
    console.log("delete snippet " + snippetId)
    
}