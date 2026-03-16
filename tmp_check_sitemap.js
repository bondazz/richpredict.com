
const http = require('http');

http.get('http://localhost:3000/sitemap-predictions-football.xml', (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        const urlCount = (data.match(/<url>/g) || []).length;
        console.log(`URL Count: ${urlCount}`);
        // Log first 200 chars to see structure
        console.log('Snippet:', data.substring(0, 500));
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
