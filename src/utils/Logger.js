import { createLogger, format, transports } from "winston";;

const { combine, colorize, simple } = format;

export default class Logger {

    static logger = createLogger({
        level: process.env.LOG_LEVEL || "info",
        format: combine(colorize(), simple()),
        transports: [
            new transports.Console()
        ]
    });

    static info(message) {
        this.logger.info(message);
    }

    static debug(message) {
        this.logger.debug(message);
    }
}
