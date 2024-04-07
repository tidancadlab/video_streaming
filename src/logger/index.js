require('dotenv').config();

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
const isDebug = process.env.DEBUG === 'true';
let ms = Date.now();
const time = () => {
  const dateTime = new Date(Date.now() + 5.5 * 60 * 60);
  const timeString = `${dateTime.toLocaleTimeString()} - [${Date.now() - ms} ms]`;
  ms = Date.now();
  return timeString;
};
const loggerType = (type) => (type ? `[${type}]` : '');
const { FgRed, FgBlue, FgYellow, Reset } = colorCode;
const isColorPrint = (data) => ['number', 'string', 'boolean'].includes(typeof data);

/**
 * @param {*} message string which we want to log in console.
 * @param {*} type The log type.
 */
exports.errorLog = (message, type = null) => {
  if (isDebug) {
    if (isColorPrint(message)) {
      console.error(FgRed, loggerType(type), time(), `: ${message}`, Reset);
    } else {
      console.error(`${loggerType(type)}${time()} :`, message);
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
      console.info(FgBlue, loggerType(type), time(), `: ${message}`, Reset);
    } else {
      console.info(`${loggerType(type)}${time()} :`, message);
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
      console.warn(FgYellow, loggerType(type), time(), `: ${message}`, Reset);
    } else {
      console.warn(`${loggerType(type)}${time()} :`, message);
    }
  }
};
