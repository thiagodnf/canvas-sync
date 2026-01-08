import Logger from "./utils/Logger.js";
import ParseUtils from "./utils/ParseUtils.js";

import SyllabusAPI from "./canvas/SyllabusAPI.js";
import AssignmentAPI from "./canvas/AssignmentAPI.js";
import PageAPI from "./canvas/PageAPI.js";

import FileParser from "./parser/FileParser.js";

export default class CanvasSync {

    constructor() {
        this.fileParser = new FileParser();
    }

    async pages() {

        const files = this.fileParser.makeHtml('./content/**/Pages/**.**');

        Logger.info(`------------------------------------------------------`);
        Logger.info(`Found ${files.length} files. Synchronizing them...`);
        Logger.info(`------------------------------------------------------`);

        for (const [i, file] of files.entries()) {

            Logger.info(`[${i + 1}/${files.length}] ${file.metadata.title}`);

            await PageAPI.sync(file);
        }
    }

    async syllabus() {

        const files = this.fileParser.makeHtml('./content/**/syllabus.md');

        Logger.info(`------------------------------------------------------`);
        Logger.info(`Found ${files.length} files. Synchronizing them...`);
        Logger.info(`------------------------------------------------------`);

        for (const [i, file] of files.entries()) {

            Logger.info(`[${i + 1}/${files.length}] ${file.metadata.title}`);

            await SyllabusAPI.sync(file);
        }
    }

    async assignments(type = "Reflections") {

        const files = this.fileParser.makeHtml(`./content/**/Assignments/${type}/*.md`);

        Logger.info(`------------------------------------------------------`);
        Logger.info(`Found ${files.length} files. Synchronizing them...`);
        Logger.info(`------------------------------------------------------`);

        for (const [i, file] of files.entries()) {

            Logger.info(`[${i + 1}/${files.length}] ${file.metadata.title}`);

            await AssignmentAPI.sync(file);
        }
    }

    async labs() {
        await this.assignments("Labs");
    }

    async reflections() {
        await this.assignments("Reflections");
    }

    async projects() {
        await this.assignments("Projects");
    }

    async sync(objectives) {

        for (const objective of objectives) {
            if (["all", "syllabus"].includes(objective))
                await this.syllabus();
            else if (["all", "pages"].includes(objective))
                await this.pages();
            else if (["all", "assignments", "labs"].includes(objective))
                await this.labs();
            else if (["all", "assignments", "projects"].includes(objective))
                await this.projects();
            else if (["all", "assignments", "reflections"].includes(objective))
                await this.reflections();
            else throw new Error("Invalid objective");
        }

        Logger.info(`------------------------------------------------------`);
        Logger.info("Done");
        Logger.info(`------------------------------------------------------`);
    }
}
