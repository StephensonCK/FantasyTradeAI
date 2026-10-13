import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
const players = ['Josh Allen','JaMarr Chase','Bijan Robinson','Brock Bowers','Lamar Jackson','Justin Jefferson','Jahmyr Gibbs','Trey McBride','Patrick Mahomes'].map((name,i)=>({player:{id:i+1,sleeperId:String(i+1),name,position:['QB','WR','RB','TE'][i%4],maybeTeam:'TEST'},value:10000-i*700,overallRank:i+1,positionRank:i+1}));
async function setup(page, theme='light') {
 await page.addInitScript(t=>localStorage.setItem('fta:theme',t),theme);
 await page.route('**/api.fantasycalc.com/**',r=>r.fulfill({json:players}));
 await page.goto('http://127.0.0.1:5173');
 await expect(page.getByRole('combobox').nth(1)).toBeVisible();
}
for (const theme of ['light','dark']) for (const width of [1280,320]) {
 test(`${theme} ${width}: accessibility and trade interaction`,async({page})=>{
  await page.setViewportSize({width,height:900}); await setup(page,theme);
  const check = async()=> {
   const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
   expect(scan.violations).toEqual([]);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  };
  await check();
  await page.screenshot({path:`test-results/${theme}-${width}.png`,fullPage:true});
  const get=page.getByRole('combobox',{name:'Add a player to you get'});
  await get.fill('Josh'); await expect(get).toHaveAttribute('aria-activedescendant',/.+option-0/); await check();
  await get.press('Enter'); await expect(page.getByRole('button',{name:'Remove Josh Allen'})).toBeVisible();
  const give=page.getByRole('combobox',{name:'Add a player to you give'});
  await give.fill('JaMarr'); await give.press('Enter'); await check();
  await page.getByRole('button',{name:'Swap sides'}).click();
  await expect(page.getByRole('region',{name:'You get'}).getByText('JaMarr Chase')).toBeVisible();
  await page.getByRole('radio',{name:'PPR',exact:true}).focus(); await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('radio',{name:'Half PPR',exact:true})).toBeChecked();
  await page.getByRole('button',{name:'Remove Josh Allen'}).click();
  await expect(give).toBeFocused();
  await page.getByRole('button',{name:'Clear trade'}).click(); await expect(page.getByText('Your next move, under review.')).toBeVisible();
 });
}
test('keyboard skip link, no matches, error recovery and reduced motion',async({page})=>{
 await setup(page); await page.keyboard.press('Tab'); await expect(page.getByRole('link',{name:'Skip to trade analyzer'})).toBeFocused();
 await page.keyboard.press('Enter'); await expect(page.locator('main')).toBeFocused();
 const search=page.getByRole('combobox',{name:'Add a player to you get'});
 await search.fill('zzzz'); await expect(page.getByRole('status').filter({hasText:'No player matches'})).toContainText('No player matches'); await search.press('Escape'); await expect(search).toHaveAttribute('aria-expanded','false');
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.evaluate(()=>localStorage.clear());
 await page.route('**/api.fantasycalc.com/**',r=>r.abort()); await page.reload();
 await expect(page.getByRole('alert')).toContainText('Player values did not load');
 expect((await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze()).violations).toEqual([]);
 await page.route('**/api.fantasycalc.com/**',r=>r.fulfill({json:players})); await page.getByRole('button',{name:'Try again'}).click(); await expect(search).toBeVisible();
});

for (const theme of ['light', 'dark']) {
 test(`${theme}: all verdict colors have accessible contrast`, async ({page}) => {
  await setup(page, theme);
  const get = page.getByRole('combobox', {name: 'Add a player to you get'});
  const give = page.getByRole('combobox', {name: 'Add a player to you give'});
  await get.fill('Josh'); await get.press('Enter');
  await give.fill('JaMarr'); await give.press('Enter');
  for (const state of ['win', 'lose', 'fair']) {
   if (state === 'lose') await page.getByRole('button', {name:'Swap sides'}).click();
   if (state === 'fair') {
    await page.route('**/api.fantasycalc.com/**', r => r.fulfill({json: players.map(p=>({...p,value:10000}))}));
    await page.getByRole('radio', {name:'Half PPR',exact:true}).click();
   }
   const panel=page.locator(`.verdict-${state}`);
   await expect(panel).toBeVisible();
   await expect(panel.locator('p')).toHaveCSS('text-align','center');
   await expect(panel).toHaveCSS('color', theme === 'light' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)');
   const scan=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
   expect(scan.violations).toEqual([]);
   await panel.screenshot({path:`test-results/verdict-${theme}-${state}.png`});
  }
 });
}
