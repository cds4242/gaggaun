import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const urls = [
  'https://postfiles.pstatic.net/MjAxODAzMTZfMjQy/MDAxNTIxMTY5MTg2NjMx.WyFtuelhCQjWPKT08pqugLrFM0am_qc3_VpigZgfTLAg.MDIK0rdl1ks6vMGj-gzf2JHggmdjOfh8qxS_KskQWBUg.JPEG.neti704/1521169045358.jpg?type=w580',
  'https://postfiles.pstatic.net/MjAxODAzMTZfNCAg/MDAxNTIxMTcwMjQ0NDgz.cqKzw2bih-a7QpVsXnYIEiHQij47hpQAZ6zmc_9l2b8g.j3DmS6UkOLGNfcQzlauFS5Nd7k1oTm54MLxj7oWGwnYg.JPEG.neti704/1521170241124.jpg?type=w580',
  'https://postfiles.pstatic.net/MjAxODAzMTZfMTc1/MDAxNTIxMTcwMjQ1NTMx.1crIYfz1lTdvs_LK7wPdhQwZxjYNzJZ8OduSk8aGfH0g.ndYQwoE8nQep6GduKIfBU976sojDiYmI577Hvq4bNpwg.JPEG.neti704/1521170241523.jpg?type=w580',
  'https://postfiles.pstatic.net/MjAxODAzMTZfNDgg/MDAxNTIxMTgzMjI0NTA2.YtvY2GaYY0zVIRmHz-sM8KE20WexEX2wBcGGNRFLxF0g.jVuFdJ3muyzyNp6sBGspi_jRT2-qDbyKkMF1UE9bPVYg.JPEG.neti704/1521182471299.jpg?type=w580',
  'https://postfiles.pstatic.net/MjAxODAzMTZfMjc0/MDAxNTIxMTgzMjI2NjE3.V0Nqw-wU7x_1hBrBBbraH5FipVyh3sPMqrlSfc-at04g.TSCZ2zlUMz-H1aMgIqq5W3GoLCLpXG7Z1xeIXv_3_V4g.JPEG.neti704/1521182560885.jpg?type=w580',
  'https://postfiles.pstatic.net/MjAxODAzMTZfNyAg/MDAxNTIxMTgzMjI4MTk0.d_aYr9Ix--0IsizKtr7OeSadVtezGKLdHZV7wti6ipog.4neP-HSQoAbAxby7hjnTZpLQGHvqbCgElTZJtqHkxR8g.JPEG.neti704/1521182631378.jpg?type=w580',
  'https://postfiles.pstatic.net/MjAxODAzMTZfMjI4/MDAxNTIxMTgzMjI5MjU4.VS_SHxtDUkG3Zknw17ONl4KVdPaxnaBDCbYqjljL8cYg.GvccutPGNrlTgli2AhcylTXeRoFPNoXGAIFQ2uLv7k8g.JPEG.neti704/1521182768534.jpg?type=w580',
  'https://postfiles.pstatic.net/MjAxODAzMTZfMTAg/MDAxNTIxMTgzMjMxODE4.ZJ6TKzbKEd6FZJmR8m35DJ9M7CHQBaJyx3h1mKA9WaAg.oS1H-fvqA1I9g_FidCXrpSWzHdWhOUlp_mCmDMH8eeYg.JPEG.neti704/20180313_122045.jpg?type=w580',
  'https://postfiles.pstatic.net/MjAxODAzMTZfMzkg/MDAxNTIxMTgzMjMzNDg1.KJxr5CqqKAXNgenCOpnTQ_fHQ_OGpQk5SJO3ufaXtUEg.eOEv6CPF1TYCGvO3U-b-_npY8tt6ZMjVG8W5rNCJB8Ag.JPEG.neti704/20180313_122125.jpg?type=w580',
  'https://postfiles.pstatic.net/MjAxODAzMTZfMzAw/MDAxNTIxMTgzMjM1MTcz.fe_CJo8_aBR4QiaddPkc2JBWd8sdR7CKCSQczi_cmawg.mLkbU0eZEDqjxyg64UPE7KPYidlYGDcxNIOH4aYL_lkg.JPEG.neti704/20180313_122149.jpg?type=w580',
  'https://postfiles.pstatic.net/MjAxODAzMTZfMjU3/MDAxNTIxMTgzMjM2MzA3.6UyN6ZFuC4mGk0fIvlClzH4cId2BY9N5jR1FYCcsyPUg.VoSDx3vHfu9UDb912ReonqhDY5GW-ZFLxN50V_Xw61Ag.JPEG.neti704/20180313_122230.jpg?type=w580',
  'https://postfiles.pstatic.net/MjAxODAzMTZfMTA2/MDAxNTIxMTgzMjM3NTU0.1Q4t_7V06X-OEfYrMXGYOiSCn8OP_j9eFKac1aW80Xgg.aZ8A-gK4XRgtD1ptQX_C8LLCr1OIRayE3aoPDo6r7lcg.JPEG.neti704/20180313_122242.jpg?type=w580',
  'https://postfiles.pstatic.net/MjAxODAzMTZfOSAg/MDAxNTIxMTgzMjM5NDcx.bYqokNuWskC70lig9Kb5BEdIoKwEZLklzxxeZw62Sz8g.JanEqlRe2Bq14gBKWhtDL7fbZSWQHo_eExHuEf64Tuwg.JPEG.neti704/20180313_122336.jpg?type=w580',
  'https://postfiles.pstatic.net/MjAxODAzMTZfNDAg/MDAxNTIxMTgzMjQxMDQx.Sew-LMaWfsUX1lw69e05XHAh2DgcDuO_cgGQLeCxWbQg.IziyNxB3DDs0gk5V-z18lNk5CMOIfByZzxDMSN72Yrgg.JPEG.neti704/1521183063089.jpg?type=w580',
  'https://postfiles.pstatic.net/MjAxODAzMTZfMjUz/MDAxNTIxMTgzMjQyMzQz.J_X2x06BeCUC9iJqkJTTfU4duQH4c5Gp6YEsPbmOn3wg.fQHTu1-N3Zpo8dgIokk2chu2DFHS_xoAeoOnVa0vD64g.JPEG.neti704/1521183127180.jpg?type=w580',
  'https://postfiles.pstatic.net/MjAxODAzMTZfMjgw/MDAxNTIxMTgzMjQzOTM0.m3A9LBytKFYHuA4WJdljnHJGnPiY3M5ZrrUCuZBTvc0g.4BomjLDyBSkAlX9eCZakCW12_ORkB0Sbmt7Lmub4aoog.JPEG.neti704/20180313_122508.jpg?type=w580',
  'https://postfiles.pstatic.net/MjAxODAzMTZfMTQ4/MDAxNTIxMTgzMjQ2MDE5.XU4QhBoMJTJOXOkDpsnzG1CCsQ8GnxzJHflZzMu4Zmsg.rBezhm3JYGLFYK52r6WPPNRvNt-HqpAU62zIoZVcB0og.JPEG.neti704/20180313_122435.jpg?type=w580',
  'https://postfiles.pstatic.net/MjAxODAzMTZfMjEy/MDAxNTIxMTgzMjQ3NjE2.A5sWDaQwHAnPbgPlJcqbfvjE7bdfzNrcjVlbS1SlT94g.nhRhW00oIqlpq58iKRHufrOCjaH8GIuZdNUUGxMohyYg.JPEG.neti704/1521183211768.jpg?type=w580',
  'https://postfiles.pstatic.net/MjAxODAzMTZfNjQg/MDAxNTIxMTg0ODU2MTg1.woXLbN3JX9pZE2A6rFn1XGGjIcYpPHIcHV3zBkK98PEg.qg6GUnQQT8UguVZDyHTSotLHnqcDYIBErMx57n1k68wg.JPEG.neti704/1521184854559.jpg?type=w580'
];

const outDir = path.resolve('./raw_images');
fs.mkdirSync(outDir, { recursive: true });

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'Referer': 'https://blog.naver.com/', 'User-Agent': 'Mozilla/5.0' }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`status ${res.statusCode} for ${url}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve(dest)));
      file.on('error', reject);
    });
    req.on('error', reject);
  });
}

const results = [];
for (let i = 0; i < urls.length; i++) {
  const name = `church_${String(i + 1).padStart(2, '0')}.jpg`;
  const dest = path.join(outDir, name);
  try {
    await download(urls[i], dest);
    results.push({ ok: true, name });
    console.log('OK', name);
  } catch (e) {
    results.push({ ok: false, name, err: e.message });
    console.error('FAIL', name, e.message);
  }
}
fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify(results, null, 2));
console.log('DONE', results.filter(r => r.ok).length, '/', results.length);
