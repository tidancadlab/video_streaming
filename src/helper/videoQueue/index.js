const fs = require('fs');
let queueContainer = require('./videoQueueContainer.json');

const updateFile = async (data) => fs.writeFileSync(`${__dirname}/videoQueueContainer.json`, JSON.stringify(data), 'utf-8', (err) => new Error(err));

const videoQueueItem = {
  statusCodeDescription: {
    100: 'Initialize object added to the waiting list.',
    101: 'Error in initializing object added to the waiting list.',
    200: 'Video meta_info and video URL and path saved into video_meta_info and video table.',
    201: 'Error in getting video meta info.',
    202: 'Error in video meta info inserting into video_meta_info table.',
    203: 'Error in inserting video URL and path into video table.',
    300: 'Thumbnail created and saved into thumbnail table.',
    301: 'Error in Thumbnail creation.',
    302: 'Error in saving thumbnail info into thumbnail table.',
    400: 'Video converted into HLS (m3u8) format.',
    401: 'Error in Video converting into HLS (m3u8) format.',
  },

  /**
   * @param {string | number} [id]
   * @returns {Promise<?{id: string,
   * hasError: boolean,
   * statusCode: number,
   * aspectRatio: number,
   * extension: string,
   * height: number,
   * duration: number}>}
   */
  async getVideoItem(id) {
    if (!Array.isArray(queueContainer)) return null;
    return queueContainer.find((v) => (id ? v.id === id : !v.hasError && v.statusCode < 400));
  },

  /**
   * Status codes description
   * ```json
    100: Initialize object added to the waiting list.
    101: Error in initializing object added to the waiting list.
    200: Video meta_info and video URL and path saved into video_meta_info and video table.
    201: Error in getting video meta info.
    202: Error in video meta info inserting into video_meta_info table.
    203: Error in inserting video URL and path into video table.
    300: Thumbnail created and saved into thumbnail table.
    301: Error in Thumbnail creation.
    302: Error in saving thumbnail info into thumbnail table.
    400: Video converted into HLS (m3u8) format.
    401: Error in Video converting into HLS (m3u8) format.
   * ```
   * @param {string | number} id
   * @param {100 | 101 | 200 | 201 | 202 | 203 | 300 | 301 | 302 | 400 | 401} code
   *
   */

  updateStatusCode(id, code) {
    const index = [100, 101, 200, 201, 202, 203, 300, 301, 302, 400, 401].indexOf(code);
    if (!Array.isArray(queueContainer)) return { ok: false };
    if (index !== -1) {
      try {
        const item = queueContainer.find((v) => v.id === id);
        if (item) {
          queueContainer = queueContainer.map((v) => (v.id === id ? { ...v, statusCode: code } : v));
          updateFile(queueContainer);
          console.log(`video queue item ${id} code changed - ${code} : ${this.statusCodeDescription[code]}.`);
          return { ok: true };
        }
        console.log(`video queue item ${id} is not found.`);
        return { ok: false };
      } catch (error) {
        console.log(error);
      }
    }
    console.log(`can't update ${code} is not a valid code`);
    return { ok: false };
  },

  /**
   * @param {string} id
   * @param {object} data
   * @param {string} [data.fileName]
   * @param {string} [data.videoDirectoryPath]
   * @param {number} [data.aspectRatio]
   * @param {number} [data.duration]
   * @param {number} [data.height]
   */
  async createItem(id, data) {
    if (typeof id !== 'string' || typeof data !== 'object') return new Error('Id and data object required');
    if (!data.aspectRatio || !data.height || !data.duration || !data.fileName || !data.videoDirectoryPath) return new Error('data required');
    if (queueContainer.findIndex((v) => v.id === id) !== -1) return new Error('user created already');
    if (!Array.isArray(queueContainer)) queueContainer = [];
    queueContainer.push({
      id,
      videoDirectoryPath: data.videoDirectoryPath,
      fileName: data.fileName,
      aspectRatio: data.aspectRatio,
      height: data.height,
      duration: data.duration,
      statusCode: 100,
      hasError: false,
      timeStamp: Date.now(),
    });
    try {
      await updateFile(queueContainer);
      console.log(`New video queue item ${id} created`);
      return { ok: true };
    } catch (error) {
      return { ok: false };
    }
  },

  async deleteItem(id) {
    if (!Array.isArray(queueContainer)) queueContainer = [];
    try {
      queueContainer = queueContainer.filter((v) => v.id !== id);
      await updateFile(queueContainer);
      console.log(`video queue item ${id} deleted`);
      return { ok: true };
    } catch (error) {
      return { ok: false };
    }
  },
};

module.exports = videoQueueItem;
