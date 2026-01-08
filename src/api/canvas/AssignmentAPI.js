import CanvasAPIUtils from "../../utils/CanvasApiUtils.js";
import Logger from "../../utils/Logger.js";

const CANVAS_COURSE_ID = process.env.CANVAS_COURSE_ID;

export default class AssignmentAPI {

    static async create(title, body) {

        Logger.debug("Creating " + title)

        const payload = {
            assignment: {
                name: title,
                description: body
            }
        }

        const url = `/api/v1/courses/${CANVAS_COURSE_ID}/assignments`;

        return await CanvasAPIUtils.sendPost(url, payload);
    }

    static async update(id, body) {

        Logger.debug("Updating " + id)

        const payload = {
            assignment: {
                description: body
            }
        }

        const url = `/api/v1/courses/${CANVAS_COURSE_ID}/assignments/${id}`;

        return await CanvasAPIUtils.sendPut(url, payload);
    }

    static async fetchByTitle(title) {

        Logger.debug("Fetching " + title)

        const titleEncoded = encodeURIComponent(title);

        const url = `/api/v1/courses/${CANVAS_COURSE_ID}/assignments?search_term=${titleEncoded}`;

        const rows = await CanvasAPIUtils.sendGet(url);

        for (const row of rows) {

            if (row.name.trim().toLowerCase() === title.trim().toLowerCase()) {
                return [row]
            }
        }

        return [];
    }

    static async sync({content, metadata}) {

        const { title } = metadata;

        const assignments = await this.fetchByTitle(title);

        if (assignments.length === 0) {

            await this.create(title, content);

        } else if (assignments.length === 1) {

            const { id } = assignments[0];

            await this.update(id, content);
        } else {
            throw new Error(`The search returned > 1 assignment for "${title}"`);
        }
    }

}
