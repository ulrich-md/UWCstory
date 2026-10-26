const { chromium } = require('playwright');
const fs = require('fs');
const jobs = JSON.parse(process.argv[2]);
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await b.newPage({ viewport: { width: 1100, height: 1100 } });
  p.on('pageerror', e => console.log('ERR', e.message));
  for (const j of jobs) {
    const qs = new URLSearchParams(j).toString();
    await p.goto('http://localhost:8766/render.html?' + qs);
    await p.waitForFunction(() => window.__done, null, { timeout: 180000 });
    const data = await p.evaluate(() => window.__done);
    fs.writeFileSync(`out/${j.out}.png`, Buffer.from(data.split(',')[1], 'base64'));
    console.log('rendered', j.out);
  }
  await b.close();
})();
