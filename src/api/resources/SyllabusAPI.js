import CanvasAPIUtils from "../../utils/CanvasApiUtils.js";
import Logger from "../../utils/Logger.js";

const CANVAS_COURSE_ID = process.env.CANVAS_COURSE_ID;

export default class SyllabusAPI {

    static async sync({content, metadata}) {

        const { title } = metadata;

        Logger.debug("Updating " + title)

        const payload = {
            course: {
                syllabus_body: content,
                syllabus_course_summary: metadata.enable_course_summary || false
            }
        }

        const url = `/api/v1/courses/${CANVAS_COURSE_ID}`;

        return await CanvasAPIUtils.sendPut(url, payload);
    }
}
