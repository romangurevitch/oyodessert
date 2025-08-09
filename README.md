# OyO Dessert landing page

This repository powers the "coming soon" page for the OyO Dessert online shop.

## Local setup
Open `docs/index.html` in your browser or host the `docs` directory with any static file server.

## Adding images and logo
Binary image assets are intentionally excluded from the repository. To customise the page:

1. Place your dessert photos and logo inside `docs/assets/images/`.
2. Use the same filenames referenced in `docs/index.html` or adjust the HTML to match your files.
3. Convert photos to efficient WebP format (recommended 1600px wide) and name them accordingly. Example using ImageMagick:
   ```bash
   magick your-photo.jpg -resize 1600 -quality 80 docs/assets/images/IMG_9547.webp
   ```
4. Add a square `logo.png` in the same folder (around 40×40 px works well).

Once the images are added locally, the GitHub Pages site will display them when you deploy from your own repository.
