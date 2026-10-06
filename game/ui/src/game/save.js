/** 存档：3 个存档槽独立存取；$falcon 存储不可用时降级为内存 */
const SLOT_KEY = i => 'sts_slot_' + i;
const mem = {};
function hasFalcon() { return typeof $falcon !== 'undefined' && $falcon.jsapi && $falcon.jsapi.storage; }
function readRaw(key) {
  let raw = mem[key];
  if (hasFalcon()) {
    try {
      const res = $falcon.jsapi.storage.getStorage({ key: key });
      if (res && typeof res.then === 'function') {
        // 异步接口：调用方用 async 版本
      }
    } catch (e) {}
  }
  return raw;
}
async function saveSlot(i, run) {
  run.slot = i;
  const data = JSON.stringify(run);
  mem[SLOT_KEY(i)] = data;
  if (hasFalcon()) await $falcon.jsapi.storage.setStorage({ key: SLOT_KEY(i), data: data });
  return true;
}
async function loadSlot(i) {
  let raw = mem[SLOT_KEY(i)];
  if (hasFalcon()) {
    try { const res = await $falcon.jsapi.storage.getStorage({ key: SLOT_KEY(i) }); if (res && res.data) raw = res.data; } catch (e) {}
  }
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (e) { return null; }
}
async function clearSlot(i) {
  delete mem[SLOT_KEY(i)];
  if (hasFalcon()) { try { await $falcon.jsapi.storage.setStorage({ key: SLOT_KEY(i), data: '' }); } catch (e) {} }
}
/** 旧版按角色的存档（sts_save_<char>）迁移进空槽 */
async function importLegacy() {
  const out = [];
  for (const c of ['ironclad', 'silent', 'defect', 'watcher']) {
    const key = 'sts_save_' + c;
    let raw = mem[key];
    if (hasFalcon()) {
      try { const res = await $falcon.jsapi.storage.getStorage({ key: key }); if (res && res.data) raw = res.data; } catch (e) {}
    }
    if (raw) { try { const run = JSON.parse(raw); if (run && run.deck) out.push(run); } catch (e) {} }
  }
  return out;
}
module.exports = { saveSlot, loadSlot, clearSlot, importLegacy, SLOT_KEY };
