export class ProjectAttributeService {

    static async get(projectId: string, attributeId: string): Promise<ProjectAttribute> {
        const jwt = localStorage.getItem("sj_jwt");

        let resp = await fetch(`projects/${projectId}/attributes/${attributeId}`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': `Bearer ${jwt}`
            }
        });

        if (!resp.ok) {
            throw new Error("Project attribute could not be fetched.")
        }
        let projectAttributeData: ProjectAttribute = await resp.json();
        return projectAttributeData;
    }

    static async getAll(projectId: string): Promise<ProjectAttribute[]> {
        const jwt = localStorage.getItem("sj_jwt");

        let resp = await fetch(`projects/${projectId}/attributes`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': `Bearer ${jwt}`
            }
        });

        if (!resp.ok) {
            throw new Error("Project attribute list could not be fetched.")
        }
        let projectAttributeList: ProjectAttribute[] = await resp.json();
        return projectAttributeList;
    }

    static async delete(projectId: string, id: string): Promise<void> {
        const jwt = localStorage.getItem("sj_jwt");

        let resp = await fetch(`projects/${projectId}/attributes/${id}`, {
            method: 'DELETE',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': `Bearer ${jwt}`
            }
        });

        if (!resp.ok) {
            throw new Error("Project attribute could not be deleted.")
        }
    }

    static async update(projectId: string, id: string, name: string, description: string, dataType: string, value: string): Promise<void> {
        const jwt = localStorage.getItem("sj_jwt");

        let resp = await fetch(`projects/${projectId}/attributes/${id}`, {
            method: 'PUT',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                description: description,
                dataType: dataType,
                value: value
            })
        });

        if (!resp.ok) {
            throw new Error("Project attribute could not be updated.")
        }
    }

    static async create(projectId: string, name: string, description: string, dataType: string, value: string): Promise<string> {
        const jwt = localStorage.getItem("sj_jwt");

        let resp = await fetch(`projects/${projectId}/attributes`, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                description: description,
                dataType: dataType,
                value: value
            })
        });

        if (!resp.ok) {
            throw new Error("Project attribute could not be created.")
        }

        let data = await resp.json();
        return data.id;
    }
}

export interface ProjectAttribute {
    id: string;
    name: string;
    description: string;
    dataType: string;
    value: string;
}