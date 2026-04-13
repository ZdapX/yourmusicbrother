const express = require('express');
const yts = require('yt-search');
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index');
});

// Endpoint khusus biar page gak reload pas searching
app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    if (!query) return res.json({ results: [] });
    
    try {
        const r = await yts(query);
        const videos = r.videos.slice(0, 20); 
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: "System Error" });
    }
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`[DevCoreAI] Light Mode Active: http://localhost:${PORT}`);
    });
}

module.exports = app;
