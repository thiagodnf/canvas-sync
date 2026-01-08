import Logger from "../../utils/Logger.js";
import HttpClient from "../HttpClient.js";

export default class PageAPI {

    constructor(options = {}) {
        this.canvasCourseId = options.canvasCourseId;
        this.httpClient = new HttpClient();
    }

    async create(title, body, settings = {}) {

        Logger.info("Creating " + title)

        const payload = {
            wiki_page: {
                title,
                body,
                published: settings.published || false
            }
        }

        const url = `/api/v1/courses/${this.canvasCourseId}/pages`;

        return await this.httpClient.post(url, payload);
    }

    async update(title_url, body, settings = {}) {

        Logger.info("Updating " + title_url)

        const payload = {
            wiki_page: {
                body,
                published: settings.published || false
            }
        }

        const url = `/api/v1/courses/${this.canvasCourseId}/pages/${title_url}`;

        return await this.httpClient.put(url, payload);
    }

    async fetchByTitle(title) {

        Logger.info("Fetching " + title)

        const titleEncoded = encodeURIComponent(title);

        const url = `/api/v1/courses/${this.canvasCourseId}/pages?search_term=${titleEncoded}`;

        const rows = await this.httpClient.get(url);

        return rows.filter(r => r.title.trim().toLowerCase() === title.trim().toLowerCase());
    }

    async sync(title, content, settings = {}) {

        const pages = await this.fetchByTitle(title);

        if (pages.length === 0) {
            await this.create(title, content, settings);
        } else if (pages.length === 1) {
            await this.update(pages[0].url, content, settings);
        } else {
            throw new Error(`The page search returned > 1 page for "${title}"`);
        }
    }

}
