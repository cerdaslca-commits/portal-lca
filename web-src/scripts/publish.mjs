// Menyalin hasil build (dist/) ke ../web/ — folder yang disajikan server.js portal-lca di Railway.
// File khusus hosting statis (Netlify/Vercel/Apache) tidak ikut disalin karena routing diatur server.js.
import { cpSync, rmSync, existsSync } from 'node:fs'
import { basename } from 'node:path'

const SKIP = new Set(['404.html', 'vercel.json', '_redirects', '_headers', '.htaccess', 'robots.txt'])
const OUT = '../web'
if (existsSync(OUT)) rmSync(OUT, { recursive: true, force: true })
cpSync('dist', OUT, { recursive: true, filter: (src) => !SKIP.has(basename(src)) })
console.log('publish: dist/ → web/ (siap di-commit)')
