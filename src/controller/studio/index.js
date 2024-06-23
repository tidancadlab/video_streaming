const { readFile } = require('fs');
const { URL, PATH } = require('../../../config');
const { all } = require('../../Database/SQLMethod');
const { joinPath } = require('../../utils');
const { statusByCode } = require('../../error');

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const studioController = async (req, res) => {
  const { id } = req.payload;
  const { keyword = '' } = req.query;
  try {
    const SQL = `SELECT v.id as id,
    v.time_stamp as time_stamp,
    p.title as title,
    p.description as description,
    p.category as category,
    p.tags as tags,
    concat(?, '/', ?, '/', t.url) as thumbnail_url,
    t.size as size,
    t.height as height,
    t.width as width,
    (height + 0.01) / (width + 0.01) as aspect_ratio,
    case when hv.hls_url != null then 1 else 0 end as isReleased
    from 
    video as v full join video_profile as p on v.id = p.video_id 
    full join (
    select url, MAX(height) as height, width, video_id, size from thumbnail GROUP BY video_id
    ) t on v.id = t.video_id 
    full join hls_video as hv on v.id = hv.video_id
    where v.user_id = ? and (p.title like concat('%', ? , '%') or p.description like concat('%', ? , '%')) order by v.time_stamp desc limit 20`;
    const result = await all(SQL, [URL.SERVER_BASE_URL, PATH.MEDIA_API_BASE, id, keyword, keyword]);

    readFile(joinPath(__dirname, '../../queue/videoQueueContainer.json'), (error, data) => {
      const savedStatus = JSON.parse(data.toString('utf8')) || [];

      if (!Array.isArray(savedStatus)) {
        return res.status(401).send({ message: 'status data not found' });
      }

      if (result) {
        const resultToJSON = result.map((v) => {
          const item = savedStatus.find((o) => o.id === v.id);
          if (!item) {
            return v;
          }
          return { ...v, status: statusByCode[item.statusCode] };
        });
        return res.status(200).send(resultToJSON);
      }
      return res.status(404).send({ message: 'Not found' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

module.exports = studioController;
