const { chromium } = require('playwright'); const fs = require('fs');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 600, height: 600 } });
  for (const [n, c, t] of [['pin-red', '#d4142b', 0], ['pin-green', '#2fa344', 60], ['pin-yellow', '#f2c230', 120]]) {
    await p.goto(`http://localhost:8766/pin.html?c=${encodeURIComponent(c)}&turn=${t}`);
    await p.waitForFunction(() => window.__done, null, { timeout: 120000 });
    fs.writeFileSync(`out/${n}.png`, Buffer.from((await p.evaluate(() => window.__done)).split(',')[1], 'base64'));
  }
  await b.close();
})();
