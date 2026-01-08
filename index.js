import "dotenv/config";

import CanvasSync from "./src/CanvasSync.js";

const canvasSync = new CanvasSync({
    canvasApiUrl: process.env.CANVAS_API_URL,
    canvasApiToken: process.env.CANVAS_API_TOKEN,
    canvasCourseId: process.env.CANVAS_COURSE_ID
});

await canvasSync.syncAll();

export { CanvasSync };
