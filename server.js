const express = require('express');
const yts = require('yt-search');
const path = require('path');
const app = express();

// Konfigurasi View Engine (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware untuk file statis (CSS/JS/Images)
app.use(express.static(path.join(__dirname, 'public')));

// [ROUTE] Halaman Utama
app.get('/', (req, res) => {
    res.render('index');
});

// [SEO] Sitemap Generator untuk Google Search Console
// Biar website lo gampang ditemuin di Google "DevCore Sound"
app.get('/sitemap.xml', (req, res) => {
    res.header('Content-Type', 'application/xml');
    const host = req.get('host');
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>https://${host}/</loc>
            <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
            <changefreq>daily</changefreq>
            <priority>1.0</priority>
        </url>
    </urlset>`;
    res.send(sitemap.trim());
});

// [API] Endpoint Pencarian YouTube Music
// Dioptimasi biar nggak nunggu lama kayak nunggu kepastian si pembunuh Novle
app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Query target kosong." });
    
    try {
        console.log(`[DevCoreAI] Scanning frequency for: ${query}`);
        const r = await yts(query);
        
        // Ambil 20 hasil teratas, bersihin datanya
        const videos = r.videos.slice(0, 20).map(v => ({
            videoId: v.videoId,
            title: v.title,
            timestamp: v.timestamp,
            views: v.views,
            thumbnail: v.thumbnail,
            author: { name: v.author.name }
        }));
        
        res.json(videos);
    } catch (error) {
        console.error("[SYSTEM_ERROR]", error);
        res.status(500).json({ error: "Gagal menembus database audio." });
    }
});

// [SERVER] Port Monitoring
const PORT = process.env.PORT || 3000;

// Export untuk Vercel (PENTING)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`
        [DevCoreAI] SYSTEM_ONLINE
        --------------------------
        VERSION: 1.1.0 (SEO_ENABLED)
        ACCESS: http://localhost:${PORT}
        STATUS: MONITORING NOVLE_WAVES
        --------------------------
        `);
    });
}

module.exports = app;
