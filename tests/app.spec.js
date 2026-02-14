const { test, expect } = require('@playwright/test');
const path = require('path');

const SCREENSHOT_DIR = path.join(__dirname, '..', 'test-screenshots');

test.describe('Nightreign Seed Finder', () => {

  // Collect ALL console errors across every test
  let jsErrors;
  let consoleErrors;

  test.beforeEach(async ({ page }) => {
    jsErrors = [];
    consoleErrors = [];

    // Capture uncaught JS exceptions
    page.on('pageerror', (error) => {
      jsErrors.push({ type: 'pageerror', message: error.message, stack: error.stack });
    });

    // Capture console.error calls
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push({ type: 'console.error', text: msg.text() });
      }
    });
  });

  /**
   * Helper: report all JS errors collected during a test.
   * Returns the combined error array for assertion.
   */
  function reportErrors(label) {
    const allErrors = [...jsErrors, ...consoleErrors];
    if (allErrors.length > 0) {
      console.log(`=== JS ERRORS (${label}) ===`);
      allErrors.forEach((e, i) => console.log(`  [${i + 1}] ${e.type}: ${e.message || e.text}`));
      console.log('=== END JS ERRORS ===');
    } else {
      console.log(`No JavaScript errors detected (${label}).`);
    }
    return allErrors;
  }

  // ─── Test 1: Page loads without JS errors ───
  test('1. Page loads without JS errors', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Wait for DOMContentLoaded-driven initialization
    await page.waitForSelector('#earth-list .chip');
    await page.waitForTimeout(1000);

    // Verify page title
    await expect(page).toHaveTitle(/나이트레인 시드 파인더/);

    // Verify Leaflet map initialized (leaflet adds classes to #map)
    const mapDiv = page.locator('#map');
    await expect(mapDiv).toHaveClass(/leaflet-container/);

    // Take screenshot
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'step1-page-loaded.png'), fullPage: true });

    // Report and assert no errors
    const allErrors = reportErrors('Step 1 - Page Load');
    expect(allErrors).toEqual([]);
  });

  // ─── Test 2: Earth chips render (5 chips) ───
  test('2. Earth chips render - 5 chips with correct Korean labels', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForSelector('#earth-list .chip');

    const chips = page.locator('#earth-list .chip');
    const chipCount = await chips.count();
    console.log(`Earth chip count: ${chipCount}`);

    // Verify exactly 5 chips
    expect(chipCount).toBe(5);

    // Verify each expected label
    const expectedLabels = ['기본', '산령', '화구', '부패의 숲', '녹라테오'];
    for (let i = 0; i < expectedLabels.length; i++) {
      const chipText = await chips.nth(i).textContent();
      console.log(`  Chip ${i + 1}: "${chipText}"`);
      expect(chipText.trim()).toBe(expectedLabels[i]);
    }

    // Take screenshot
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'step2-earth-chips.png'), fullPage: true });

    const allErrors = reportErrors('Step 2 - Earth Chips');
    expect(allErrors).toEqual([]);
  });

  // ─── Test 3: Click "기본" -> path tabs appear ("밤의 군주" and "낙하 지점") ───
  test('3. Click 기본 -> path tabs appear (밤의 군주 and 낙하 지점)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForSelector('#earth-list .chip');

    // path-group should be hidden initially
    const pathGroup = page.locator('#path-group');
    await expect(pathGroup).toBeHidden();

    // Click the "기본" chip (first chip)
    const defaultChip = page.locator('#earth-list .chip', { hasText: '기본' });
    await expect(defaultChip).toBeVisible();
    await defaultChip.click();

    // Verify the chip is now active
    await expect(defaultChip).toHaveClass(/active/);

    // path-group should now be visible (contains the two path tabs)
    await expect(pathGroup).toBeVisible();

    // Verify both path tabs are visible
    const pathBossTab = page.locator('#path-boss');
    const pathSpawnTab = page.locator('#path-spawn');
    await expect(pathBossTab).toBeVisible();
    await expect(pathSpawnTab).toBeVisible();

    // Verify tab labels
    await expect(pathBossTab).toHaveText('밤의 군주');
    await expect(pathSpawnTab).toHaveText('낙하 지점');

    console.log('Path tabs appeared: "밤의 군주" and "낙하 지점"');

    // Take screenshot
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'step3-path-tabs.png'), fullPage: true });

    const allErrors = reportErrors('Step 3 - Path Tabs');
    expect(allErrors).toEqual([]);
  });

  // ─── Test 4: Click "밤의 군주" tab -> boss list appears ───
  test('4. Click 밤의 군주 tab -> boss list appears', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForSelector('#earth-list .chip');

    // Step 1: Click "기본" earth chip
    const defaultChip = page.locator('#earth-list .chip', { hasText: '기본' });
    await defaultChip.click();
    await expect(page.locator('#path-group')).toBeVisible();

    // Boss section should be hidden initially
    const bossSection = page.locator('#boss-section');
    await expect(bossSection).toBeHidden();

    // Click "밤의 군주" tab
    const pathBossTab = page.locator('#path-boss');
    await pathBossTab.click();

    // Verify tab is now active
    await expect(pathBossTab).toHaveClass(/active/);

    // Boss section should now be visible
    await expect(bossSection).toBeVisible();

    // Wait for boss items to appear
    await page.waitForSelector('#boss-list .boss-item');

    const bossItems = page.locator('#boss-list .boss-item');
    const bossCount = await bossItems.count();
    console.log(`Boss count for "기본" earth: ${bossCount}`);
    expect(bossCount).toBeGreaterThan(0);

    // Print all boss names
    for (let i = 0; i < bossCount; i++) {
      const bossText = await bossItems.nth(i).textContent();
      console.log(`  Boss ${i + 1}: "${bossText.trim()}"`);
    }

    // Take screenshot
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'step4-boss-list.png'), fullPage: true });

    const allErrors = reportErrors('Step 4 - Boss List');
    expect(allErrors).toEqual([]);
  });

  // ─── Test 5: Click Gladius -> spawn markers appear on map ───
  test('5. Click Gladius -> spawn markers appear on map', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForSelector('#earth-list .chip');

    // Step 1: Click "기본"
    const defaultChip = page.locator('#earth-list .chip', { hasText: '기본' });
    await defaultChip.click();
    await expect(page.locator('#path-group')).toBeVisible();

    // Step 2: Click "밤의 군주" tab
    const pathBossTab = page.locator('#path-boss');
    await pathBossTab.click();
    await page.waitForSelector('#boss-list .boss-item');

    // Step 3: Click Gladius
    const gladiusBtn = page.locator('#boss-list .boss-item', { hasText: 'Gladius' });
    await expect(gladiusBtn).toBeVisible();
    await gladiusBtn.click();

    // Gladius button should be active
    await expect(gladiusBtn).toHaveClass(/active/);

    // Wait for spawn markers to appear on the Leaflet map
    // The app uses L.icon with className 'spawn-marker' for spawn point markers
    await page.waitForSelector('#map .leaflet-marker-icon.spawn-marker', { timeout: 5000 });

    const spawnMarkers = page.locator('#map .leaflet-marker-icon.spawn-marker');
    const markerCount = await spawnMarkers.count();
    console.log(`Spawn marker count on map after selecting Gladius: ${markerCount}`);
    expect(markerCount).toBeGreaterThan(0);

    // Verify markers have spawn.png icon
    const spawnImgMarkers = page.locator('#map .leaflet-marker-icon.spawn-marker[src*="spawn.png"]');
    const imgMarkerCount = await spawnImgMarkers.count();
    console.log(`Spawn markers with spawn.png icon: ${imgMarkerCount}`);
    expect(imgMarkerCount).toBeGreaterThan(0);

    // Also verify that the "낙하 지점" selection step (spawn-after-boss) appeared
    const spawnAfterBoss = page.locator('#spawn-after-boss');
    await expect(spawnAfterBoss).toBeVisible();
    console.log('spawn-after-boss section is visible after boss selection');

    // Take screenshot
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'step5-gladius-spawn-markers.png'), fullPage: true });

    const allErrors = reportErrors('Step 5 - Gladius Spawn Markers');
    expect(allErrors).toEqual([]);
  });

  // ─── Test 6: Click "낙하 지점" tab (path B) -> spawn markers appear ───
  test('6. Click 낙하 지점 tab (path B) -> spawn markers appear on map', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForSelector('#earth-list .chip');

    // Step 1: Click "기본"
    const defaultChip = page.locator('#earth-list .chip', { hasText: '기본' });
    await defaultChip.click();
    await expect(page.locator('#path-group')).toBeVisible();

    // spawn-section should be hidden initially
    const spawnSection = page.locator('#spawn-section');
    await expect(spawnSection).toBeHidden();

    // Step 2: Click "낙하 지점" tab (path B — spawn-first approach)
    const pathSpawnTab = page.locator('#path-spawn');
    await pathSpawnTab.click();

    // Verify tab is active
    await expect(pathSpawnTab).toHaveClass(/active/);

    // spawn-section should now be visible with guide text
    await expect(spawnSection).toBeVisible();
    const guideText = await spawnSection.locator('.guide-text').textContent();
    console.log(`Spawn guide text: "${guideText.trim()}"`);
    expect(guideText).toContain('낙하 지점');

    // Boss section should be hidden (we chose the spawn-first path)
    const bossSection = page.locator('#boss-section');
    await expect(bossSection).toBeHidden();

    // Wait for spawn markers to appear on the map
    // showClickableSpawns(null) is called — spawns for "Default" earth, no boss filter
    await page.waitForSelector('#map .leaflet-marker-icon.spawn-marker', { timeout: 5000 });

    const spawnMarkers = page.locator('#map .leaflet-marker-icon.spawn-marker');
    const markerCount = await spawnMarkers.count();
    console.log(`Spawn marker count on map (path B): ${markerCount}`);
    expect(markerCount).toBeGreaterThan(0);

    // Verify markers have spawn.png icon
    const spawnImgMarkers = page.locator('#map .leaflet-marker-icon.spawn-marker[src*="spawn.png"]');
    const imgMarkerCount = await spawnImgMarkers.count();
    console.log(`Spawn markers with spawn.png icon (path B): ${imgMarkerCount}`);
    expect(imgMarkerCount).toBeGreaterThan(0);

    // Take screenshot
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'step6-spawn-path-markers.png'), fullPage: true });

    const allErrors = reportErrors('Step 6 - Spawn Path B');
    expect(allErrors).toEqual([]);
  });

  // ─── Test 7: Full flow with screenshots at each step ───
  test('7. Full flow with screenshots at each step', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForSelector('#earth-list .chip');

    // Screenshot A: Initial page state
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'step7a-initial.png'), fullPage: true });
    console.log('Screenshot: step7a-initial.png (initial page)');

    // Step 1: Click "기본" earth
    const defaultChip = page.locator('#earth-list .chip', { hasText: '기본' });
    await defaultChip.click();
    await expect(page.locator('#path-group')).toBeVisible();
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'step7b-earth-selected.png'), fullPage: true });
    console.log('Screenshot: step7b-earth-selected.png (after selecting 기본)');

    // Step 2: Click "밤의 군주" tab
    await page.locator('#path-boss').click();
    await page.waitForSelector('#boss-list .boss-item');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'step7c-boss-tab.png'), fullPage: true });
    console.log('Screenshot: step7c-boss-tab.png (밤의 군주 tab with boss list)');

    // Step 3: Click Gladius
    const gladiusBtn = page.locator('#boss-list .boss-item', { hasText: 'Gladius' });
    await gladiusBtn.click();
    await page.waitForSelector('#map .leaflet-marker-icon.spawn-marker');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'step7d-gladius-selected.png'), fullPage: true });
    console.log('Screenshot: step7d-gladius-selected.png (Gladius selected, spawn markers visible)');

    // Step 4: Switch to "낙하 지점" tab instead (path B)
    await page.locator('#path-spawn').click();
    await expect(page.locator('#spawn-section')).toBeVisible();
    await page.waitForSelector('#map .leaflet-marker-icon.spawn-marker');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'step7e-spawn-tab.png'), fullPage: true });
    console.log('Screenshot: step7e-spawn-tab.png (switched to 낙하 지점 tab)');

    // Step 5: Click a spawn marker on the map
    const spawnMarkers = page.locator('#map .leaflet-marker-icon.spawn-marker');
    const markerCount = await spawnMarkers.count();
    console.log(`Found ${markerCount} spawn markers. Clicking the first one...`);

    if (markerCount > 0) {
      const firstMarker = spawnMarkers.first();
      await firstMarker.click();
      await page.waitForTimeout(500);

      await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'step7f-spawn-clicked.png'), fullPage: true });
      console.log('Screenshot: step7f-spawn-clicked.png (after clicking spawn marker)');

      // Check if identification or seed confirmation appeared
      const identifyGroup = page.locator('#identify-group');
      const isIdentifyVisible = await identifyGroup.isVisible();
      console.log(`Identify group visible after spawn click: ${isIdentifyVisible}`);

      const seedPanel = page.locator('#seed-panel');
      const isSeedPanelVisible = await seedPanel.isVisible();
      console.log(`Seed panel visible after spawn click: ${isSeedPanelVisible}`);
    }

    // Report ALL errors across the entire flow
    const allErrors = reportErrors('Step 7 - Full Flow');
    expect(allErrors).toEqual([]);
  });

});
