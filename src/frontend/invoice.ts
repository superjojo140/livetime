import { TimeSnippet } from "./timesnippet";

export class InvoiceAPI {

    static async getSnippetsByInvoice(projectId: string, invoiceId: string): Promise<TimeSnippet[]> {
        const jwt = localStorage.getItem("sj_jwt");

        let resp = await fetch(`projects/${projectId}/invoices/${invoiceId}`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': `Bearer ${jwt}`
            }
        });

        if (!resp.ok) {
            throw new Error("TimeSnippets could not be fetched.")
        }
        let timeSnippetList = await resp.json();

        return timeSnippetList;
    }

    static async getAll(projectId: string): Promise<Invoice[]> {
        const jwt = localStorage.getItem("sj_jwt");

        let resp = await fetch(`projects/${projectId}/invoices/list`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': `Bearer ${jwt}`
            }
        });

        if (!resp.ok) {
            throw new Error("Invoice List could not be fetched.")
        }
        let invoiceList = await resp.json();

        for (let invoiceData of invoiceList) {
            invoiceData.date = new Date(invoiceData.date);
            invoiceData.lastStart = new Date(invoiceData.lastStart);
            invoiceData.firstStart = new Date(invoiceData.firstStart);
        }

        return invoiceList;
    }

    static async getUnassigned(projectId: string): Promise<TimeSnippet[]> {
        const jwt = localStorage.getItem("sj_jwt");

        let resp = await fetch(`projects/${projectId}/invoices/unassigned`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': `Bearer ${jwt}`
            }
        });

        if (!resp.ok) {
            throw new Error("Invoice List could not be fetched.")
        }

        let timeSnippetList = await resp.json();

        for (const timeSnippetData of timeSnippetList) {
            timeSnippetData.start = timeSnippetData.start ? new Date(timeSnippetData.start) : null;
            timeSnippetData.end = timeSnippetData.end ? new Date(timeSnippetData.end) : null;
        }
        return timeSnippetList;
    }




    static async create(projectId: string, invoiceId: string, timestamp:string): Promise<string> {
        const jwt = localStorage.getItem("sj_jwt");

        let resp = await fetch(`projects/${projectId}/invoices/create`, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Authorization': `Bearer ${jwt}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                invoiceId: invoiceId,
                timestamp: timestamp
            })
        });

        if (!resp.ok) {
            throw new Error(`Invoice could not be created. Maybe the invoice id "${invoiceId}" already exists...?`)
        }

        let data = await resp.json();
        return data.id;
    }


}

export interface Invoice {
    id: string,
    date: Date,
    projectId: string,
    lastStart: Date,
    firstStart: Date
}