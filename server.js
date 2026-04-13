const express = require('express');
const yts = require('yt-search');
const path = require('path'); // Wajib buat Vercel
const app = express();

// Setting path folder biar gak error saat di cloud
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index', { results: null, query: '' });
});

app.get('/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.redirect('/');
    
    try {
        console.log(`[DevCoreAI] Cloud Tracing: ${query}`);
        const r = await yts(query);
        const videos = r.videos.slice(0, 15); 

        const results = videos.map(v => ({
            title: v.title,
            thumbnailUrl: v.thumbnail,
            artists: [{ name: v.author.name }],
            album: "YouTube Music Result",
            youtubeId: v.videoId
        }));

        res.render('index', { results, query });
    } catch (error) {
        console.error("[!] DevCoreAI Cloud Error:", error);
        res.status(500).send("Cloud system failure. Target lost.");
    }
});

// Penting: Export app buat Vercel, tapi tetep bisa jalan lokal
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`\n[DevCoreAI] Local Dev Mode: http://localhost:${PORT}`);
    });
}

module.exports = app;
