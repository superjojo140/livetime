import { ProjectAttribute } from "./project_attribute_service.js";

export default class ProjectAttributeView {


    static renderProjectAttributeList(attributes: ProjectAttribute[]) {
        const container = document.getElementById('livetime_attribute_table');
        container.innerHTML = attributes.map(attribute => `
                <tr>
                    <td><small><b>${attribute.name}</b></small></td>
                    <td><small>${attribute.description}</small></td>
                    <td>${attribute.value}</td>
                    <td>
                        <button class="btn btn-rounded btn-primary livetime-attribute-edit-button" data-attribute-id="${attribute.id}" title="Edit"><i class="fas fa-pen"></i></button>
                        <button class="btn btn-rounded btn-danger livetime-attribute-delete-button" data-attribute-id="${attribute.id}" title="Delete"><i class="far fa-trash-alt"></i></button>
                    </td>
                </tr>
            `).join('');
    }


}