const fs = require('fs');
const path = require('path');
const https = require('https');

const productsMdPath = path.join(__dirname, '../../enstudeyai/.agents/tasks/2026-07/21/tiki-products/products.md');
const productsJsonPath = path.join(__dirname, '../data/affiliate-products.json');
const linksJsonPath = path.join(__dirname, '../data/affiliate-links.json');

// Helper to download a URL's HTML content
function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).toString();
        fetchHtml(redirectUrl).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch URL: ${url} (Status: ${res.statusCode})`));
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&nbsp;/g, ' ');
}

function cleanTitle(title, urlSlug) {
  let cleaned = decodeHtmlEntities(title)
    .replace(/^Mua\s+/i, '')
    .replace(/\s+giá\s+cực\s+tốt.*$/i, '')
    .replace(/\s+tại\s+.+$/i, '')
    .replace(/\s+-\s+Hàng\s+Chính\s+Hãng/gi, '')
    .replace(/\s+-\s+Chính\s+Hãng/gi, '')
    .replace(/\s+-\s+Màu\s+.*$/gi, '')
    .trim();

  // If the clean title is too long or contains garbage, we can clean it up more
  cleaned = cleaned.split(' - ')[0]; // Take only the first part before any dash

  // If it's a book, let's tidy it up
  if (urlSlug.includes('cambridge-ielts') && !cleaned.toLowerCase().includes('cambridge')) {
    cleaned = 'Sách ' + cleaned;
  }
  return cleaned.trim();
}

function cleanDescription(desc) {
  if (!desc) return '';
  return decodeHtmlEntities(desc)
    .replace(/\s+tại\s+.+$/i, '')
    .replace(/Mua\s+ngay\!/gi, '')
    .trim();
}

async function run() {
  try {
    if (!fs.existsSync(productsMdPath)) {
      console.error(`Error: products.md not found at ${productsMdPath}`);
      process.exit(1);
    }

    const mdContent = fs.readFileSync(productsMdPath, 'utf8');
    const lines = mdContent.split('\n').map(l => l.trim()).filter(Boolean);
    const shortUrls = lines.filter(l => l.startsWith('https://ti.ki'));
    const fullUrls = lines.filter(l => l.startsWith('https://tiki.vn'));

    console.log(`Found ${shortUrls.length} short URLs and ${fullUrls.length} full URLs.`);

    const products = [];
    const links = [];
    const seenSlugs = {};

    const limit = Math.min(shortUrls.length, fullUrls.length);

    for (let i = 0; i < limit; i++) {
      const shortUrl = shortUrls[i];
      const longUrl = fullUrls[i];
      console.log(`[${i + 1}/${limit}] Fetching metadata from full URL: ${longUrl.substring(0, 60)}...`);

      try {
        const html = await fetchHtml(longUrl);

        // Parse Title
        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        let rawTitle = titleMatch ? titleMatch[1] : '';

        // Parse Description
        const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i)
          || html.match(/<meta\s+content=["']([^"']+)["']\s+name=["']description["']/i);
        let rawDesc = descMatch ? descMatch[1] : '';

        // Parse Image
        let image = '';
        const imgRegexes = [
          /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i,
          /<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i,
          /<link\s+rel=["']preload["']\s+href=["']([^"']+)["']\s+as=["']image["']/i
        ];
        for (const regex of imgRegexes) {
          const match = html.match(regex);
          if (match) {
            image = match[1];
            break;
          }
        }

        // Clean values
        const urlObj = new URL(longUrl);
        const pathParts = urlObj.pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1]; // e.g. "sach-hackers-toeic-reading-p437744.html"
        const namePart = lastPart.replace(/-p\d+\.html$/, ''); // "sach-hackers-toeic-reading"

        let slug = namePart;
        let id = `tiki-${namePart}`;

        let baseTitle = cleanTitle(rawTitle, slug);
        let cleanDesc = cleanDescription(rawDesc);

        // Handle duplicates of slug/id
        if (seenSlugs[slug]) {
          const count = ++seenSlugs[slug];
          slug = `${slug}-${count}`;
          id = `${id}-${count}`;
        } else {
          seenSlugs[slug] = 1;
        }

        // Category determination
        let category = 'dorm';
        if (slug.includes('sach') || slug.includes('ielts') || slug.includes('toeic') || slug.includes('destination') || slug.includes('grammar')) {
          category = 'study';
        }

        // Tags determination
        const tags = [];
        if (slug.includes('ielts') || baseTitle.toLowerCase().includes('ielts')) {
          tags.push('ielts');
        }
        if (slug.includes('toeic') || baseTitle.toLowerCase().includes('toeic')) {
          tags.push('toeic');
        }

        const product = {
          id: id,
          slug: slug,
          title: baseTitle,
          description: cleanDesc,
          imagePath: image,
          category: category,
          tags: tags,
          platform: 'tiki',
          rawProductUrl: shortUrl,
          campaignId: 'tiki'
        };

        products.push(product);

        links.push({
          source: `/go/${slug}`,
          destination: shortUrl,
          platform: 'tiki',
          campaignId: 'tiki'
        });

        console.log(` -> Added: ${baseTitle} (Slug: ${slug}, Category: ${category})`);

      } catch (err) {
        console.error(` -> Error processing URL: ${longUrl}`, err.message);
      }
    }

    // Write output files
    fs.writeFileSync(productsJsonPath, JSON.stringify(products, null, 2), 'utf8');
    fs.writeFileSync(linksJsonPath, JSON.stringify(links, null, 2), 'utf8');

    console.log(`\nSuccessfully wrote ${products.length} products to ${productsJsonPath}`);
    console.log(`Successfully wrote ${links.length} links to ${linksJsonPath}`);

  } catch (e) {
    console.error('Fatal execution error:', e);
  }
}

run();
