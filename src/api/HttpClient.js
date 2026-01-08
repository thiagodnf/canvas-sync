const CANVAS_API_URL = process.env.CANVAS_API_URL;
const CANVAS_TOKEN = process.env.CANVAS_TOKEN;

export default class HttpClient {

    constructor() {
        this.headers = {
            "Authorization": `Bearer ${CANVAS_TOKEN}`,
            "Content-Type": "application/json",
        };
    }

    async get(url) {

        const res = await fetch(`${CANVAS_API_URL}${url}`, {
            method: "GET",
            headers: this.headers
        });

        return await this.processResponse(res);
    }

    async post(url, payload = {}) {

        const res = await fetch(`${CANVAS_API_URL}${url}`, {
            method: "POST",
            headers: this.headers,
            body: JSON.stringify(payload),
        });

        return await this.processResponse(res);
    }

    async put(url, payload = {}) {

        const res = await fetch(`${CANVAS_API_URL}${url}`, {
            method: "PUT",
            headers: this.headers,
            body: JSON.stringify(payload),
        });

        return await this.processResponse(res);
    }

    async processResponse(res) {

        if (!res.ok) {
            throw new Error(`${res.status} ${res.statusText}`);
        }

        return await res.json();
    }
}
