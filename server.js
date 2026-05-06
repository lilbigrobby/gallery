const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  const photosDir = path.join(__dirname, 'public', 'photos');
  const files = fs.existsSync(photosDir)
    ? fs.readdirSync(photosDir).filter(f => f.toLowerCase().endsWith('.jpg'))
    : [];

  const photoItems = files.map(file => `
    <div class="overflow-hidden">
      <img src="/photos/${file}" alt="${file}" class="w-full h-64 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer" onclick="openModal('/photos/${file}', '${file}')">
    </div>
  `).join('');

  const empty = files.length === 0
    ? `<p class="text-gray-400 col-span-full text-center py-16">No photos yet — drop .jpg files into <code class="bg-gray-800 px-1 rounded">public/photos/</code> and refresh.</p>`
    : '';

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Gallery</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body class="bg-gray-900 text-white min-h-screen p-6">

  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
    ${photoItems}
    ${empty}
  </div>

  <!-- Modal -->
  <div id="modal" class="hidden fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onclick="closeModal()">
    <img id="modal-img" src="" alt="" class="max-h-screen max-w-full object-contain">
  </div>

  <script>
    function openModal(src, alt) {
      document.getElementById('modal-img').src = src;
      document.getElementById('modal-img').alt = alt;
      document.getElementById('modal').classList.remove('hidden');
    }
    function closeModal() {
      document.getElementById('modal').classList.add('hidden');
    }
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  </script>
</body>
</html>`);
});

app.listen(PORT, () => {
  console.log(`Gallery running at http://localhost:${PORT}`);
});
