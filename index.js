import "dotenv/config";

import CanvasSync from "./src/CanvasSync.js";

const canvasSync = new CanvasSync({
    canvasApiUrl: process.env.CANVAS_API_URL,
    canvasApiToken: process.env.CANVAS_API_TOKEN,
    canvasCourseId: process.env.CANVAS_COURSE_ID
});

let args = process.argv.slice(2).map(e => e.trim());

if (args.length === 0) {
    await canvasSync.syncAll();
} else {
    if (args[0] === "syllabus") {
        await canvasSync.syncSyllabus();
    } else if (args[0] === "pages") {
        await canvasSync.syncPages();
    } else if (args[0] === "assignments") {
        await canvasSync.syncAssignments();
    } else {
        throw new Error(`${args[0]} not recognized`);
    }
}

export { CanvasSync };
