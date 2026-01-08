import { createLogger, format, transports } from "winston";;

const { combine } = format;

export default class Logger {

    static logger = createLogger({
        level: process.env.LOG_LEVEL || "info",
        format: combine(
            format.colorize(),
            format.simple()
        ),
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
