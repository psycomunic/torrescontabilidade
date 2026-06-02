const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'styles.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Remove the palette inversion from [data-theme="dark"]
// We will replace the entire block and keep only semantic variables.
css = css.replace(/\[data-theme="dark"\]\s*\{[^}]+\}/, `[data-theme="dark"] {
    --bg-main: #0F0A1E;
    --bg-secondary: #160F2E;
    --text-main: #FAFAFA;
    --text-muted: #A1A1AA;
    --border-color: rgba(255, 255, 255, 0.1);
    
    --glass-bg: rgba(22, 15, 46, 0.75);
    --glass-header: rgba(15, 10, 30, 0.85);
    --glass-border: rgba(255, 255, 255, 0.1);
    --glass-shadow: rgba(0, 0, 0, 0.4);
}`);

// Add --border-color to :root
css = css.replace(/--glass-shadow: rgba\(15, 10, 30, 0\.03\);/, `--glass-shadow: rgba(15, 10, 30, 0.03);\n    --border-color: var(--gray-200);`);

// 2. Replace hardcoded backgrounds in major sections
css = css.replace(/\.problem\s*\{\s*padding: 100px 0;\s*background: var\(--white\);/g, `.problem {\n    padding: 100px 0;\n    background: var(--bg-main);`);
css = css.replace(/\.solutions\s*\{\s*padding: 100px 0;\s*background: var\(--white\);/g, `.solutions {\n    padding: 100px 0;\n    background: var(--bg-main);`);
css = css.replace(/\.differentials\s*\{\s*padding: 100px 0;\s*background: var\(--white\);/g, `.differentials {\n    padding: 100px 0;\n    background: var(--bg-main);`);
css = css.replace(/\.testimonials\s*\{\s*padding: 100px 0;\s*background: var\(--white\);/g, `.testimonials {\n    padding: 100px 0;\n    background: var(--bg-main);`);
css = css.replace(/\.faq\s*\{\s*padding: 100px 0;\s*background: var\(--white\);/g, `.faq {\n    padding: 100px 0;\n    background: var(--bg-main);`);
css = css.replace(/\.contact\s*\{\s*padding: 100px 0;\s*background: var\(--white\);/g, `.contact {\n    padding: 100px 0;\n    background: var(--bg-main);`);
css = css.replace(/\.pricing\s*\{\s*padding: 100px 0;\s*background: var\(--gray-50\);/g, `.pricing {\n    padding: 100px 0;\n    background: var(--bg-secondary);`);
css = css.replace(/\.process\s*\{\s*padding: 100px 0;\s*background: var\(--gray-50\);/g, `.process {\n    padding: 100px 0;\n    background: var(--bg-secondary);`);

// 3. Replace text colors in typography that should adapt
// Using precise regex to avoid replacing colors inside specific buttons or fixed dark sections
css = css.replace(/color: var\(--gray-900\);/g, `color: var(--text-main);`);
css = css.replace(/color: var\(--gray-700\);/g, `color: var(--text-muted);`);
css = css.replace(/color: var\(--gray-600\);/g, `color: var(--text-muted);`);

// Exception: .hero-title, .section-title etc that use --dark. We want them to use --text-main.
css = css.replace(/color: var\(--dark\);\s*\/\* section titles \*\//g, `color: var(--text-main);`);
// Let's just replace `.section-title { color: var(--dark);`
css = css.replace(/\.section-title\s*\{\s*font-family: var\(--font-display\);\s*font-size: 36px;\s*font-weight: 800;\s*color: var\(--dark\);/g, `.section-title {\n    font-family: var(--font-display);\n    font-size: 36px;\n    font-weight: 800;\n    color: var(--text-main);`);
// .hero-title
css = css.replace(/\.hero-title\s*\{\s*font-family: var\(--font-display\);\s*font-size: 56px;\s*font-weight: 800;\s*color: var\(--dark\);/g, `.hero-title {\n    font-family: var(--font-display);\n    font-size: 56px;\n    font-weight: 800;\n    color: var(--text-main);`);

// 4. Update border colors to use semantic var
css = css.replace(/border: 1px solid var\(--gray-200\);/g, `border: 1px solid var(--border-color);`);
css = css.replace(/border-bottom: 1px solid var\(--gray-200\);/g, `border-bottom: 1px solid var(--border-color);`);
css = css.replace(/border-top: 1px solid var\(--gray-200\);/g, `border-top: 1px solid var(--border-color);`);

fs.writeFileSync(cssPath, css);

// Fix animation delay in script.js
const jsPath = path.join(__dirname, 'script.js');
let js = fs.readFileSync(jsPath, 'utf8');
js = js.replace(/el\.style\.transition = `all 0\.6s cubic-bezier\(0\.4, 0, 0\.2, 1\) \$\{index \* 0\.05\}s`;/g, 
  "el.style.transition = `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s`;");
fs.writeFileSync(jsPath, js);
console.log('Done fixing css and js.');
