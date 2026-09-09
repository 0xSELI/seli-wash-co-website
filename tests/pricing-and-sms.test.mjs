import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

// Load the actual TypeScript modules without adding a test runtime dependency.
const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (!path.extname(file)) file += '.ts';
  if (cache.has(file)) return cache.get(file);
  const module = { exports: {} };
  cache.set(file, module.exports);
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(compiled, { module, exports: module.exports, require: spec => load(path.resolve(path.dirname(file), spec)), Intl, Number, Map, encodeURIComponent }, { filename: file });
  return module.exports;
}
const pricing = load('src/lib/driveway-pricing.ts');
const { calculateJob, jobQuoteText, jobEstimateSms, jobEstimateMessage } = load('src/lib/job-pricing.ts');
const { applySurfaceMinimum, stepsPrice } = load('src/lib/surface-pricing.ts');
const { business, standalonePricingSummary } = load('src/data/business.ts');
const { services, notOffered, notGuaranteed } = load('src/data/services.ts');
const { buildSmsHref, smsComposer, pricingForPayload } = load('src/lib/estimate/sms-composer.ts');

test('introductory driveway examples, threshold, decimals and invalid inputs', () => {
  for (const [area, expected] of [[0,100],[899,100],[900,100],[901,100.12],[1000,112],[1200,136],[1500,172],[900.5,100.06],[-1,100],[NaN,100],[Infinity,100]]) {
    assert.ok(Math.abs(pricing.drivewayIntroductoryPrice(area) - expected) < 0.00001);
  }
  assert.equal(pricing.formatDrivewayPrice(100.12), '$100.12');
});
test('approved surface prices and offer conditions', () => {
  assert.equal(business.pricing.drivewayIntroductory.customerLimit, 10);
  assert.equal(business.pricing.drivewayIntroductory.standardAdditionalPricePerSquareFoot, .15);
  for (const [slug, price] of [['sidewalks-walkways','$50 minimum per sidewalk'],['porches','$50 minimum per porch'],['patios-porches','$50 minimum per patio'],['steps-entry-pads','$10 per step']]) assert.equal(services.find(s=>s.slug===slug).price, price);
  assert.ok(!notOffered.includes('Pool decks'));
  assert.match(notGuaranteed, /oxidation/);
  assert.match(standalonePricingSummary, /minimum applies once/);
});
test('calculator SMS carries calculated size and price to the correct number', () => {
  const href = pricing.drivewayEstimateSms(1200);
  assert.match(href, /^sms:\+15805609673\?&body=/);
  const body = decodeURIComponent(href.split('body=')[1]);
  assert.match(body, /1200 sq. ft./);
  assert.match(body, /\$136/);
  assert.match(body, /First 10 residential customers/);
  assert.ok(href.length < 1800);
});
const payload = { name:'QA & Test',phone:'5805551234',email:'',contactPreference:'text',address:'123 Test Lane',cityOrZip:'Duncan',services:['porches','steps-entry-pads'],stepCount:'4',approximateSize:'',timing:'No preference',notes:'Check oxidation & paint.',hasSpigot:'unsure',hasGfciOutlet:'yes',withinReach:'unsure',contactConsent:true,photos:[] };
test('guided SMS resolves service names, preserves details, and handles length limit', () => {
  const body = decodeURIComponent(buildSmsHref(payload).split('body=')[1]);
  assert.match(body, /Porches, Steps/);
  assert.match(body, /Steps: 4/);
  assert.match(body, /QA & Test/);
  assert.match(body, /Check oxidation & paint./);
  assert.equal(smsComposer.compose(payload).ok, true);
  assert.equal(smsComposer.compose({...payload,notes:'x'.repeat(2000)}).ok, false);
});

test('every surface minimum: below, exactly at and above the area threshold', () => {
  for (const service of ['porch','sidewalk','patio']) {
    const rate = business.pricing.surfacePricePerSquareFoot[service];
    assert.equal(rate, .12);
    const threshold = 50 / rate;
    for (const [quantity, expected] of [[0,50],[.01,50],[100,50],[300,50],[416.66,50],[416.67,50],[416.71,50.01],[threshold-.1,50],[threshold,50],[threshold+.1,50.01],[417,50.04],[500,60]]) {
      const quote = calculateJob([{service,quantity}]);
      assert.equal(quote.lines[0].price, expected, `${service} at ${quantity}`);
      assert.equal(quote.total,100);
    }
    for (const [quantity, expected] of [[100/rate-.1,100],[100/rate,100],[100/rate+.1,100.01]]) assert.equal(calculateJob([{service,quantity}]).total,expected);
  }
  for (const surface of ['porch','sidewalk','patioOrPoolDeck']) for (const [amount,expected] of [[49.99,50],[50,50],[50.01,50.01]]) assert.equal(applySurfaceMinimum(surface,amount),expected);
});

test('appointment minimum applies once, never once per selected surface', () => {
  const cases = [
    [[{service:'porch',quantity:100}],50,50,100],
    [[{service:'porch',quantity:100},{service:'sidewalk',quantity:100}],100,0,100],
    [[{service:'patio',quantity:500},{service:'steps',quantity:5}],110,0,110],
    [[{service:'patio',quantity:500},{service:'sidewalk',quantity:100}],110,0,110],
    [[{service:'driveway',quantity:900 + 80/.12},{service:'porch',quantity:100}],230,0,230],
    [[{service:'driveway',quantity:900},{service:'porch',quantity:100},{service:'sidewalk',quantity:100},{service:'patio',quantity:500},{service:'steps',quantity:5}],310,0,310],
  ];
  for(const [selections,subtotal,adjustment,total] of cases) {
    const quote=calculateJob(selections);
    assert.equal(quote.subtotal,subtotal);assert.equal(quote.minimumAdjustment,adjustment);assert.equal(quote.total,total);
    assert.match(jobQuoteText(quote),new RegExp('Estimated job total: \\$'+total));
    const sms=decodeURIComponent(jobEstimateSms(quote).split('body=')[1]);
    assert.ok(jobEstimateSms(quote).length < 1800);
    assert.equal(sms,jobEstimateMessage(quote));assert.ok(sms.includes(jobQuoteText(quote)));
  }
  for(const [count,line,total]of[[1,10,100],[9,90,100],[10,100,100],[11,110,110]]) {
    assert.equal(stepsPrice(count),line);assert.equal(calculateJob([{service:'steps',quantity:count}]).total,total);
  }
});

test('calculator and guided form use identical lines, currency and final totals for every service',()=>{
  for(const [service,slug]of[['driveway','driveways'],['porch','porches'],['sidewalk','sidewalks-walkways'],['patio','patios-porches'],['steps','steps-entry-pads']]) {
    for(const quantity of service==='steps'?[1,9,10,11]:[100,416,50/.12,417,100/.12,900,901,1200,1500]) {
      const quote=calculateJob([{service,quantity}]);
      const guided={...payload,services:[slug],stepCount:service==='steps'?String(quantity):'',surfaceSizes:service==='steps'?{}:{[service]:String(quantity)}};
      assert.ok(pricingForPayload(guided).includes(jobQuoteText(quote)));
      assert.ok(decodeURIComponent(buildSmsHref(guided).split('body=')[1]).includes(jobQuoteText(quote)));
      assert.equal(smsComposer.compose(guided).ok,true);
    }
  }
  assert.match(pricingForPayload(payload),/Job total to confirm/);
  assert.match(pricingForPayload({...payload,services:['pool-decks']}),/Job total to confirm/);
});

test('invalid pricing input cannot produce a valid job quote',()=>{
  for(const value of [-1,NaN,Infinity,1e308]) assert.throws(()=>calculateJob([{service:'porch',quantity:value}]));
  for(const value of [0,-1,1.5,NaN,Infinity]) assert.throws(()=>stepsPrice(value));
  assert.throws(()=>calculateJob([]));
  assert.throws(()=>calculateJob([{service:'porch',quantity:1},{service:'porch',quantity:2}]));
});

test('contact form cannot natively submit before its local composer is ready',()=>{
  const component=fs.readFileSync('src/components/EstimateForm.astro','utf8');
  assert.match(component,/<button[^>]*data-submit disabled>/);
  assert.match(component,/<noscript>/);
  assert.match(component,/:global\(\.no-js\) \.form \{ display:none; \}/);
  const behavior=fs.readFileSync('src/scripts/estimate-form.ts','utf8');
  assert.match(behavior,/if \(submit && result\) submit.disabled = false/);
});

test('obsolete porch and sidewalk minimums are absent from authored content',()=>{
  const roots=['src'];
  const files=[];
  const visit=entry=>{
    for(const item of fs.readdirSync(entry,{withFileTypes:true})) {
      const full=path.join(entry,item.name);
      if(item.isDirectory()) visit(full);
      else if(/\.(?:astro|css|html|js|mjs|ts|md)$/.test(item.name)) files.push(full);
    }
  };
  roots.forEach(visit);
  for(const file of files) {
    assert.doesNotMatch(fs.readFileSync(file,'utf8'),/\$30|30\s+(?:surface\s+)?minimum|minimum[^\n]{0,20}\$?30/i,file);
  }
});

test('deselected steps never leak into the prepared request',()=>{
  const body=decodeURIComponent(buildSmsHref({...payload,services:['porches'],surfaceSizes:{porch:'100'}}).split('body=')[1]);
  assert.doesNotMatch(body,/Steps:/);
  assert.match(body,/Estimated job total: \$100/);
});

test('unreliable combined totals and invalid composer sizes fail safely',()=>{
  assert.throws(()=>calculateJob([{service:'porch',quantity:5e14},{service:'sidewalk',quantity:5e14}]));
  const result=smsComposer.compose({...payload,services:['porches'],surfaceSizes:{porch:'1e308'}});
  assert.equal(result.ok,false);
  assert.match(result.message,/No message has been prepared/);
});

test('currency lines sum in cents, including fractional square footage',()=>{
  const quote=calculateJob([{service:'patio',quantity:833.375},{service:'porch',quantity:416.71}]);
  assert.equal(quote.lines[0].price,100.01);
  assert.equal(quote.lines[1].price,50.01);
  assert.equal(quote.total,150.02);
  assert.match(jobQuoteText(quote),/\$150\.02/);
  assert.doesNotMatch(jobQuoteText(quote),/NaN|undefined/);
});
