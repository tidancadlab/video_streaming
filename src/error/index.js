/**
 * Represents an error with a specific message.
 * @typedef {object} ErrorMessage
 * @property {string} message - The error message.
 * @property {boolean} isError - Indicates if it's an error (true) or not (false).
 * @property {number} code - Indicate the status number.
 */

const CODES = {
  /**
   * Something went wrong in Initializing Queue Container.
   * @type {ErrorMessage}
   */
  QUEUE_INIT: { message: 'Something went wrong in Initializing Queue Container.', isError: true, code: 100 },

  /**
   * Parameter not passed correctly.
   * @type {ErrorMessage}
   */
  QUEUE_PARAM_ERROR: { message: 'Parameter not passed correctly.', isError: true, code: 101 },

  /**
   * Item not added in Queue Container.
   * @type {ErrorMessage}
   */
  QUEUE_ERROR: { message: 'Item not added in Queue Container.', isError: true, code: 102 },

  /**
   * Video item already exists in Queue Container.
   * @type {ErrorMessage}
   */
  QUEUE_EXIST_ERROR: { message: 'Video item already exists in Queue Container.', isError: true, code: 103 },

  /**
   * New video item added successfully in Queue Container.
   * @type {ErrorMessage}
   */
  QUEUE_ADDED_SUCCESS: { message: 'New video item added successfully in Queue Container.', isError: false, code: 110 },

  /**
   * Video Item not found in Queue Container.
   * @type {ErrorMessage}
   */
  QUEUE_ITEM_NOT_FOUND: { message: 'Video Item not found in Queue Container.', isError: true, code: 111 },

  /**
   * Video Item found in Queue Container.
   * @type {ErrorMessage}
   */
  QUEUE_ITEM_FOUND: { message: 'Video Item found in Queue Container.', isError: false, code: 120 },

  /**
   * Parameter not passed correctly for Remove video item from queue container.
   * @type {ErrorMessage}
   */
  QUEUE_ITEM_REMOVE_PARAMS_ERROR: { message: 'Parameter not passed correctly for Remove video item from queue container.', isError: true, code: 601 },

  /**
   * Initialized Video Table inserting.
   * @type {ErrorMessage}
   */
  VIDEO_TABLE_INIT: { message: 'Initialized Video Table inserting.', isError: false, code: 200 },

  /**
   * Parameter not passed correctly for video table.
   * @type {ErrorMessage}
   */
  VIDEO_TABLE_PARAMS_ERROR: { message: 'Parameter not passed correctly for video table.', isError: true, code: 201 },

  /**
   * Item not added in Video Table.
   * @type {ErrorMessage}
   */
  VIDEO_TABLE_ERROR: { message: 'Item not added in Video Table.', isError: true, code: 202 },

  /**
   * Video item already exists in Video Table.
   * @type {ErrorMessage}
   */
  VIDEO_TABLE_EXIST_ERROR: { message: 'Video item already exists in Video Table.', isError: true, code: 203 },

  /**
   * Video item added successfully in Video Table.
   * @type {ErrorMessage}
   */
  VIDEO_TABLE_SUCCESS: { message: 'Video item added successfully in Video Table.', isError: false, code: 210 },

  /**
   * Initialized Video_Meta_Data Table inserting.
   * @type {ErrorMessage}
   */
  VIDEO_META_TABLE: { message: 'Initialized Video_Meta_Data Table inserting.', isError: false, code: 300 },

  /**
   * Parameter not passed correctly for video_Meta_Data table.
   * @type {ErrorMessage}
   */
  VIDEO_META_TABLE_PARAMS_ERROR: { message: 'Parameter not passed correctly for video_Meta_Data table.', isError: true, code: 301 },

  /**
   * Item not added in Video_Meta_Data Table.
   * @type {ErrorMessage}
   */
  VIDEO_META_TABLE_ERROR: { message: 'Item not added in Video_Meta_Data Table.', isError: true, code: 302 },

  /**
   * Video meta data already exists in Video_Meta_Data Table.
   * @type {ErrorMessage}
   */
  VIDEO_META_TABLE_EXIST_ERROR: { message: 'Video meta data already exists in Video_Meta_Data Table.', isError: true, code: 303 },

  /**
   * Video meta data added successfully in Video_Meta_Data Table.
   * @type {ErrorMessage}
   */
  VIDEO_META_TABLE_SUCCESS: { message: 'Video meta data added successfully in Video_Meta_Data Table.', isError: false, code: 310 },

  /**
   * Initialized thumbnail generator inserting.
   * @type {ErrorMessage}
   */
  THUMBNAIL_GENERATE_INIT: { message: 'Initialized thumbnail generator inserting.', isError: false, code: 400 },

  /**
   * Parameter not passed correctly for thumbnail generator.
   * @type {ErrorMessage}
   */
  THUMBNAIL_GENERATE_PARAMS_ERROR: { message: 'Parameter not passed correctly for thumbnail generator.', isError: true, code: 401 },

  /**
   * Script not generated for thumbnail generator.
   * @type {ErrorMessage}
   */
  THUMBNAIL_GENERATE_SCRIPT_ERROR: { message: 'Script not generated for thumbnail generator.', isError: true, code: 402 },

  /**
   * Something went wrong during thumbnail generation.
   * @type {ErrorMessage}
   */
  THUMBNAIL_GENERATE_ERROR: { message: 'Something went wrong during thumbnail generation.', isError: true, code: 403 },

  /**
   * Thumbnail generated successfully.
   * @type {ErrorMessage}
   */
  THUMBNAIL_GENERATE_SUCCESS: { message: 'Thumbnail generated successfully.', isError: false, code: 410 },

  /**
   * Initialized Thumbnail Table inserting.
   * @type {ErrorMessage}
   */
  THUMBNAIL_TABLE_INIT: { message: 'Initialized Thumbnail Table inserting.', isError: false, code: 411 },

  /**
   * Added successfully in Thumbnail Table.
   * @type {ErrorMessage}
   */
  THUMBNAIL_TABLE_ERROR: { message: 'Something went wrong in Thumbnail Table.', isError: false, code: 412 },

  /**
   * Added successfully in Thumbnail Table.
   * @type {ErrorMessage}
   */
  THUMBNAIL_TABLE_SUCCESS: { message: 'Added successfully in Thumbnail Table.', isError: false, code: 420 },

  /**
   * Initialized HLS Converter.
   * @type {ErrorMessage}
   */
  HLS_INIT: { message: 'Initialized HLS Converter.', isError: false, code: 500 },

  /**
   * Parameter not passed correctly for HLS Converter.
   * @type {ErrorMessage}
   */
  HLS_PARAMS_ERROR: { message: 'Parameter not passed correctly for HLS Converter.', isError: true, code: 501 },

  /**
   * Script not generated for HLS Converter.
   * @type {ErrorMessage}
   */
  HLS_SCRIPT_ERROR: { message: 'Script not generated for HLS Converter.', isError: true, code: 502 },

  /**
   * Something went wrong during video converting in HLS Converter.
   * @type {ErrorMessage}
   */
  HLS_ERROR: { message: 'Something went wrong during video converting in HLS Converter.', isError: true, code: 503 },

  /**
   * Video successfully Converted in HLS.
   * @type {ErrorMessage}
   */
  HLS_SUCCESS: { message: 'Video successfully Converted in HLS.', isError: false, code: 510 },

  /**
   * Initialized HLS Table inserting.
   * @type {ErrorMessage}
   */
  HLS_TABLE_INIT: { message: 'Initialized HLS Table inserting.', isError: false, code: 511 },

  /**
   * Parameter not passed correctly for HLS table.
   * @type {ErrorMessage}
   */
  HLS_TABLE_PARAMS_ERROR: { message: 'Parameter not passed correctly for HLS table.', isError: false, code: 513 },

  /**
   * Something went wrong during inserting in HLS table.
   * @type {ErrorMessage}
   */
  HLS_TABLE_ERROR: { message: 'Something went wrong during inserting in HLS table.', isError: false, code: 514 },

  /**
   * HLS Video successfully inserted in HLS Table.
   * @type {ErrorMessage}
   */
  HLS_TABLE_SUCCESS: { message: 'HLS Video successfully inserted in HLS Table.', isError: false, code: 520 },
};

/**
 *
 * @example
 * throw new errors.CustomError('Invalid parameters', 'myError', 320);
 */
class CustomError extends Error {
  /**
   * Create a CustomError instance.
   * @param {string | {message: string, code: number, name: string}} [message=' '] - The error message.
   * @param {string} [name='CustomError'] - The name of the error.
   * @param {number} [code=0] - The error code.
   */
  constructor(message = ' ', name = 'CustomError', code = 0) {
    super(typeof message === 'string' ? message : message.message || ' ');
    if (typeof message === 'object') {
      this.code = message.code || 0;
      this.name = message.name || 'CustomError';
    } else {
      this.code = typeof name === 'number' ? name : code;
      // eslint-disable-next-line no-nested-ternary
      this.name = typeof name === 'number' ? (code === 0 ? 'CustomError' : code) : name;
    }
  }
}

const errors = { CustomError, CODES };

module.exports = errors;
