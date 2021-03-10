export class TimeSnippetApi {

    static async get(projectId: string, timeSnippetId: string): Promise<TimeSnippet> {
        const jwt = localStorage.getItem("sj_jwt");

        let resp = await fetch(`projects/${projectId}/timesnippets/${timeSnippetId}`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': `Bearer ${jwt}`
            }
        });

        if (!resp.ok) {
            throw new Error("TimeSnippet could not be fetched.")
        }
        let timeSnippetData = await resp.json();
        timeSnippetData.start = timeSnippetData.start ? new Date(timeSnippetData.start) : null;
        timeSnippetData.end = timeSnippetData.end ? new Date(timeSnippetData.end) : null;
        return timeSnippetData;
    }

    static async getAll(projectId: string): Promise<TimeSnippet[]> {
        const jwt = localStorage.getItem("sj_jwt");

        let resp = await fetch(`projects/${projectId}/timesnippets`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': `Bearer ${jwt}`
            }
        });

        if (!resp.ok) {
            throw new Error("TimeSnippet List could not be fetched.")
        }
        let timeSnippetList = await resp.json();

        for (let timeSnippetData of timeSnippetList) {
            timeSnippetData.start = timeSnippetData.start ? new Date(timeSnippetData.start) : null;
            timeSnippetData.end = timeSnippetData.end ? new Date(timeSnippetData.end) : null;
        }

        return timeSnippetList;
    }

    static async delete(projectId: string, timeSnippetId: string): Promise<void> {
        const jwt = localStorage.getItem("sj_jwt");

        let resp = await fetch(`projects/${projectId}/timesnippets/${timeSnippetId}`, {
            method: 'DELETE',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': `Bearer ${jwt}`
            }
        });

        if (!resp.ok) {
            throw new Error("TimeSnippet could not be deleted.")
        }
    }

    static async update(projectId: string, timeSnippetId: string, title: string, description: string, start: Date, end: Date): Promise<void> {
        const jwt = localStorage.getItem("sj_jwt");

        let resp = await fetch(`projects/${projectId}/timesnippets/${timeSnippetId}`, {
            method: 'PUT',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: description,
                start: start.toISOString(),
                end: end ? end.toISOString() : null
            })
        });

        if (!resp.ok) {
            throw new Error("TimeSnippet could not be updated.")
        }
    }


    static async create(projectId: string, title: string, description: string, start: Date, end: Date): Promise<string> {
        const jwt = localStorage.getItem("sj_jwt");

        let resp = await fetch(`projects/${projectId}/timesnippets`, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: description,
                start: start.toISOString(),
                end: end ? end.toISOString() : null
            })
        });

        if (!resp.ok) {
            throw new Error("TimeSnippet could not be created.")
        }

        let data = await resp.json();
        return data.timeSnippetId;
    }


}

export interface TimeSnippet {
    id: string;
    title: string;
    description: string;
    start: Date;
    end: Date;
}