export class ProjectApi {

    static async get(id: string): Promise<Project> {
        const jwt = localStorage.getItem("sj_jwt");

        let resp = await fetch(`projects/${id}`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': `Bearer ${jwt}`
            }
        });

        if (!resp.ok) {
            throw new Error("Project could not be fetched.")
        }
        let projectData = await resp.json();
        return projectData;
    }

    static async getAll(): Promise<Project[]> {
        const jwt = localStorage.getItem("sj_jwt");

        let resp = await fetch(`projects`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': `Bearer ${jwt}`
            }
        });

        if (!resp.ok) {
            throw new Error("Project List could not be fetched.")
        }
        let projectList: Project[] = await resp.json();
        return projectList;
    }

    static async delete(id: string): Promise<void> {
        const jwt = localStorage.getItem("sj_jwt");

        let resp = await fetch(`projects/${id}`, {
            method: 'DELETE',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': `Bearer ${jwt}`
            }
        });

        if (!resp.ok) {
            throw new Error("Project could not be deleted.")
        }
    }

    static async update(id: string, title: string, description: string, notes: string): Promise<void> {
        const jwt = localStorage.getItem("sj_jwt");

        let resp = await fetch(`projects/${id}`, {
            method: 'PUT',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: description,
                notes: notes
            })
        });

        if (!resp.ok) {
            throw new Error("Project could not be updated.")
        }
    }


    static async create(title: string, description: string, notes: string): Promise<string> {
        const jwt = localStorage.getItem("sj_jwt");

        let resp = await fetch(`projects`, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: description,
                notes: notes
            })
        });

        if (!resp.ok) {
            throw new Error("Project could not be created.")
        }

        let data = await resp.json();
        return data.projectId;
    }


}

export interface Project {
    id: string;
    title: string;
    description: string;
    notes?: string;
}