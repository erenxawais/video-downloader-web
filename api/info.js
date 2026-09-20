const ytdl = require('@distube/ytdl-core');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'URL required' });

  try {
    if (!ytdl.validateURL(url)) {
      return res.status(400).json({
        error: 'Only YouTube URLs are supported on this web version.'
      });
    }

    const info = await ytdl.getInfo(url);
    const details = info.videoDetails;

    const formats = info.formats;

    // Find best format for each quality
    const pick = (filterFn) => {
      const found = formats.filter(filterFn)
        .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
      return found[0]?.itag;
    };

    const mp4_360 = pick(f => f.hasVideo && f.hasAudio && f.height <= 360) 
                 || pick(f => f.hasVideo && f.height <= 360);
    const mp4_480 = pick(f => f.hasVideo && f.hasAudio && f.height <= 480)
                 || pick(f => f.hasVideo && f.height <= 480);
    const mp4_hd  = pick(f => f.hasVideo && f.hasAudio && f.height <= 1080)
                 || pick(f => f.hasVideo && f.height <= 1080);
    const mp3     = pick(f => f.hasAudio && !f.hasVideo && f.audioBitrate)
                 || pick(f => f.hasAudio);

    res.json({
      success: true,
      title: details.title,
      description: details.shortDescription || '',
      thumbnail: details.thumbnails?.slice(-1)[0]?.url || '',
      duration: parseInt(details.lengthSeconds || '0'),
      uploader: details.author?.name || '',
      itags: {
        MP4_360: mp4_360,
        MP4_480: mp4_480,
        MP4_HD:  mp4_hd,
        MP3:     mp3
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Failed to fetch info' });
  }
};
