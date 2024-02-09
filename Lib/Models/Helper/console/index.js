require('dotenv');

const isDebug = process.env.DEBUG === 'true';
/* eslint-disable indent */
const colorCode = {
    Reset: '\x1b[0m',
    Bright: '\x1b[1m',
    Dim: '\x1b[2m',
    Underscore: '\x1b[4m',
    Blink: '\x1b[5m',
    Reverse: '\x1b[7m',
    Hidden: '\x1b[8m',
    // font color
    FgBlack: '\x1b[30m',
    FgRed: '\x1b[31m',
    FgGreen: '\x1b[32m',
    FgYellow: '\x1b[33m',
    FgBlue: '\x1b[34m',
    FgMagenta: '\x1b[35m',
    FgCyan: '\x1b[36m',
    FgWhite: '\x1b[37m',
    FgGray: '\x1b[90m',
    // Background color
    BgBlack: '\x1b[40m',
    BgRed: '\x1b[41m',
    BgGreen: '\x1b[42m',
    BgYellow: '\x1b[43m',
    BgBlue: '\x1b[44m',
    BgMagenta: '\x1b[45m',
    BgCyan: '\x1b[46m',
    BgWhite: '\x1b[47m',
    BgGray: '\x1b[100m',
};

const isColorPrint = (data) => ['number', 'string', 'boolean'].indexOf(typeof (data)) !== -1;

/**
 * @param {*} message string which we want to log in console.
 * @param {*} type The log type.
 */
exports.errorLog = (message, type = 'node') => {
    if (isDebug) {
        if (isColorPrint(message)) {
            console.error(colorCode.FgRed, `[${type}]`, Date().slice(4, 24), `: ${message}`, colorCode.Reset);
        } else {
            console.error(`[${type}] ${Date().slice(4, 24)} :`, message);
        }
    }
};

/**
 * @param {*} message string which we want to log in console.
 * @param {*} type The log type.
 */
exports.infoLog = (message, type = 'node') => {
    if (isDebug) {
        if (isColorPrint(message)) {
            console.info(typeof message === 'object' ? message : colorCode.FgBlue, `[${type}]`, Date().slice(4, 24), `: ${message}`, colorCode.Reset);
        } else {
            console.info(`[${type}] ${Date().slice(4, 24)} :`, message);
        }
    }
};
/**
 * @param {*} message string which we want to log in console.
 * @param {*} type The log type.
 */
exports.warnLog = (message, type = 'node') => {
    if (isDebug) {
        if (isColorPrint(message)) {
            console.warn(colorCode.FgYellow, `[${type}]`, Date().slice(4, 24), `: ${message}`, colorCode.Reset);
        } else {
            console.warn(`[${type}] ${Date().slice(4, 24)} :`, message);
        }
    }
};
