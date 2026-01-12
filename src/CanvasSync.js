import PageAPI from "./api/resources/PageAPI.js";
import AssignmentAPI from "./api/resources/AssignmentAPI.js";
import SyllabusAPI from "./api/resources/SyllabusAPI.js";

import PathUtils from "./utils/PathUtils.js";
import Logger from "./utils/Logger.js";
import Parser from "./Parser.js";

const defaults = {
    canvasApiUrl: "",
    canvasApiToken: "",
    canvasCourseId: ""
};

export default class CanvasSync {

    constructor(options = {}) {

        this.options = { ...defaults, ...options };

        PathUtils.createFolders("./content/pages");
        PathUtils.createFolders("./content/assignments");
        PathUtils.createFolders("./content/resources/styles");
        PathUtils.createFolders("./content/resources/extensions");
        PathUtils.createFolders("./content/resources/templates");
        PathUtils.createFolders("./content/resources/templates/partials");

        this.parser = new Parser(options);

        this.pageAPI = new PageAPI(options);
        this.assignmentAPI = new AssignmentAPI(options);
        this.syllabusAPI = new SyllabusAPI(options);
    }

    async sync(resourceName, path, api) {

        Logger.info(`------------------------------------------------------`);
        Logger.info(`Synchronizing ${resourceName}...`);
        Logger.info(`------------------------------------------------------`);

        const files = this.parser.parse(path);

        let index = 0;

        for (const file of files.values()) {

            Logger.info(`[${index + 1}/${files.size}] ${file.base}`);

            await api.sync(file.name, file.html, file.metadata);

            index++
        }
    }

    async syncPages() {
        await this.sync("Pages", './content/pages/**/**.md', this.pageAPI);
    }

    async syncAssignments() {
        await this.sync("Assignments", './content/assignments/**/**.md', this.assignmentAPI);
    }

    async syncSyllabus() {
        await this.sync("Syllabus", './content/Syllabus.md', this.syllabusAPI);
    }

    async syncAll() {

        await this.syncSyllabus();
        await this.syncPages();
        await this.syncAssignments();

        Logger.info(`------------------------------------------------------`);
        Logger.info("Done");
        Logger.info(`------------------------------------------------------`);
    }
}
