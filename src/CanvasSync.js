import PageAPI from "./api/resources/PageAPI.js";

export default class CanvasSync {

    constructor(options = {}) {

        const defaults = {
            canvasApiUrl: "",
            canvasApiToken: ""
        };

        this.config = { ...defaults, ...options };

        this.pageAPI = new PageAPI(options);
    }

    async syncPages() {

        await this.pageAPI.sync("title", "tete")

    }
}
