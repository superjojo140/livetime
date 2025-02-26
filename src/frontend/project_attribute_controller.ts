import { ProjectAttribute, ProjectAttributeService } from "./project_attribute_service.js";
import ProjectAttributeView from "./project_attribute_view.js";

export default class ProjectAttributeController {

    static projectAttributeList: ProjectAttribute[] = [];

    static async refreshProjectAttributesList(projectId: string): Promise<any> {
        const projectAttributes = await ProjectAttributeService.getAll(projectId);
        ProjectAttributeController.projectAttributeList = projectAttributes;
        ProjectAttributeView.renderProjectAttributeList(projectAttributes);
    }


}