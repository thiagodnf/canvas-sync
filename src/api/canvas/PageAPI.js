import Logger from "../../utils/Logger.js";
import HttpClient from "../HttpClient.js";

const CANVAS_COURSE_ID = process.env.CANVAS_COURSE_ID;

export default class PageAPI {

    constructor() {
        this.httpClient = new HttpClient();
    }

    async create(title, body, published = false) {

        Logger.debug("Creating " + title)

        const payload = {
            wiki_page: {
                title,
                body,
                published
            }
        }

        const url = `/api/v1/courses/${CANVAS_COURSE_ID}/pages`;

        return await this.httpClient.post(url, payload);
    }

    async update(title_url, body) {

        Logger.debug("Updating " + title_url)

        const payload = {
            wiki_page: {
                body
            }
        }

        const url = `/api/v1/courses/${CANVAS_COURSE_ID}/pages/${title_url}`;

        return await this.httpClient.put(url, payload);
    }

    async fetchByTitle(title) {

        Logger.debug("Fetching " + title)

        const titleEncoded = encodeURIComponent(title);

        const url = `/api/v1/courses/${CANVAS_COURSE_ID}/pages?search_term=${titleEncoded}`;

        const rows = await this.httpClient.get(url);

        return rows.filter(r => r.title.trim().toLowerCase() === title.trim().toLowerCase());
    }

    async sync(title, content) {

        const pages = await this.fetchByTitle(title);

        if (pages.length === 0) {
            await this.create(title, content);
        } else if (pages.length === 1) {
            await this.update(pages[0].url, content);
        } else {
            throw new Error(`The page search returned > 1 page for "${title}"`);
        }
    }

}
