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

    async run(action, resourceName, path, api) {

        Logger.info(`------------------------------------------------------`);
        Logger.info(`Synchronizing ${resourceName}...`);
        Logger.info(`------------------------------------------------------`);

        const files = this.parser.parse(path);

        let index = 0;

        for (const file of files.values()) {

            Logger.info(`[${index + 1}/${files.size}] ${file.base}`);

            PathUtils.saveToDisk(resourceName, file.name, file.html);

            if (action === "sync") {
                await api.sync(file.name, file.html, file.metadata);
            }

            index++
        }
    }

    async syncPages(action = "sync") {
        await this.run(action, "Pages", './content/pages/**/**.md', this.pageAPI);
    }

    async syncAssignments(action = "sync") {
        await this.run(action, "Assignments", './content/assignments/**/**.md', this.assignmentAPI);
    }

    async syncSyllabus(action = "sync") {
        await this.run(action, "Syllabus", './content/Syllabus.md', this.syllabusAPI);
    }

    async syncAll(action = "sync") {

        await this.syncSyllabus(action);
        await this.syncPages(action);
        await this.syncAssignments(action);

        Logger.info(`------------------------------------------------------`);
        Logger.info("Done");
        Logger.info(`------------------------------------------------------`);
    }
}
