const ytdl = require('@distube/ytdl-core');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { url, itag } = req.query;
  if (!url) return res.status(400).json({ error: 'URL required' });

  try {
    const info = await ytdl.getInfo(url);
    const safeTitle = info.videoDetails.title.replace(/[^\w\s.-]/g, '').slice(0, 80);
    const ext = itag && String(itag).includes('audio') ? 'mp3' : 'mp4';

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(safeTitle)}.${ext}"`
    );
    res.setHeader('Content-Type', ext === 'mp3' ? 'audio/mpeg' : 'video/mp4');

    const stream = ytdl(url, itag ? { quality: parseInt(itag) } : { quality: 'highest' });
    stream.on('error', (e) => {
      console.error(e);
      if (!res.headersSent) res.status(500).end();
    });
    stream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Download failed' });
  }
};
