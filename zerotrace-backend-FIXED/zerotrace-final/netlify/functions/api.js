const express = require('express');
const serverless = require('serverless-http');
const { getStore } = require('@netlify/blobs');

const app = express();
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Helper to get blob store
function getBlobStore() {
  return getStore({ name: 'zerotrace-data' });
}

// Helper to get user data
async function getUserData(redid) {
  if (!redid) return null;
  const store = getBlobStore();
  try {
    const data = await store.get(redid);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

// Helper to save user data
async function saveUserData(redid, data) {
  if (!redid) return false;
  const store = getBlobStore();
  try {
    await store.set(redid, JSON.stringify(data));
    return true;
  } catch (e) {
    return false;
  }
}

// Helper to ensure user data structure exists
async function ensureUserData(redid) {
  let data = await getUserData(redid);
  if (!data) {
    data = {
      redid,
      username: '',
      branch: '',
      subscription: '',
      discord_id: null,
      keybinds: {},
      system_keys: {},
      configs: [],
      triggers: [],
      outfits: [],
      vehicles: [],
      custom_luas: [],
      banned: false,
      ban_reason: '',
      ban_by: '',
      sessions: [],
      registered: false,
      created_at: new Date().toISOString()
    };
    await saveUserData(redid, data);
  }
  return data;
}

// ===== ROUTES =====

// GET /api/v1/status
app.get('/api/v1/status', (req, res) => {
  res.json({ success: true });
});

// POST /api/v1/login
app.post('/api/v1/login', async (req, res) => {
  const { redid, username, branch, subscription } = req.body;
  if (!redid) {
    return res.status(400).json({ success: false, error: 'redid required' });
  }

  const data = await ensureUserData(redid);
  if (username) data.username = username;
  if (branch) data.branch = branch;
  if (subscription) data.subscription = subscription;
  data.last_login = new Date().toISOString();
  await saveUserData(redid, data);

  res.json({ success: true });
});

// POST /api/v1/ban/check
app.post('/api/v1/ban/check', async (req, res) => {
  const { redid } = req.body;
  if (!redid) {
    return res.status(400).json({ success: false, error: 'redid required' });
  }

  const data = await getUserData(redid);
  if (data && data.banned) {
    res.json({ banned: true, reason: data.ban_reason || '', by: data.ban_by || '' });
  } else {
    res.json({ banned: false, reason: '', by: '' });
  }
});

// GET /api/v1/live/token
app.get('/api/v1/live/token', async (req, res) => {
  const { redid } = req.query;
  res.json({ token: 'dummy' });
});

// POST /api/v1/live/event
app.post('/api/v1/live/event', (req, res) => {
  res.json({ success: true });
});

// POST /api/v1/session/start
app.post('/api/v1/session/start', async (req, res) => {
  const { redid } = req.body;
  if (!redid) {
    return res.status(400).json({ success: false, error: 'redid required' });
  }

  const data = await ensureUserData(redid);
  const session = {
    id: Date.now().toString(),
    started_at: new Date().toISOString(),
    ended_at: null
  };
  data.sessions = data.sessions || [];
  data.sessions.push(session);
  data.active_session = session.id;
  await saveUserData(redid, data);

  res.json({ success: true });
});

// POST /api/v1/session/heartbeat
app.post('/api/v1/session/heartbeat', (req, res) => {
  res.json({ success: true });
});

// POST /api/v1/session/end
app.post('/api/v1/session/end', async (req, res) => {
  const { redid } = req.body;
  if (redid) {
    const data = await getUserData(redid);
    if (data && data.sessions && data.sessions.length > 0) {
      const lastSession = data.sessions[data.sessions.length - 1];
      if (!lastSession.ended_at) {
        lastSession.ended_at = new Date().toISOString();
        data.active_session = null;
        await saveUserData(redid, data);
      }
    }
  }
  res.json({ success: true });
});

// POST /api/v1/profile
app.post('/api/v1/profile', async (req, res) => {
  const { redid } = req.body;
  if (!redid) {
    return res.status(400).json({ success: false, error: 'redid required' });
  }

  const data = await getUserData(redid);
  res.json({ 
    success: true, 
    profile: { 
      avatar: data && data.avatar ? data.avatar : null,
      username: data ? data.username : '',
      subscription: data ? data.subscription : ''
    } 
  });
});

// GET /api/v1/keybinds/load
app.get('/api/v1/keybinds/load', async (req, res) => {
  const { redid } = req.query;
  if (!redid) {
    return res.status(400).json({ success: false, error: 'redid required' });
  }

  const data = await getUserData(redid);
  const isFirstTime = !data || !data.keybinds || Object.keys(data.keybinds).length === 0;

  res.json({ 
    success: true, 
    keybinds: data && data.keybinds ? data.keybinds : {},
    system_keys: data && data.system_keys ? data.system_keys : {},
    first_time: isFirstTime
  });
});

// POST /api/v1/keybinds/save
app.post('/api/v1/keybinds/save', async (req, res) => {
  const { redid, keybinds, system_keys } = req.body;
  if (!redid) {
    return res.status(400).json({ success: false, error: 'redid required' });
  }

  const data = await ensureUserData(redid);
  if (keybinds !== undefined) data.keybinds = keybinds;
  if (system_keys !== undefined) data.system_keys = system_keys;
  await saveUserData(redid, data);

  res.json({ success: true });
});

// GET /api/v1/configs/list
app.get('/api/v1/configs/list', async (req, res) => {
  const { redid } = req.query;
  if (!redid) {
    return res.status(400).json({ success: false, error: 'redid required' });
  }

  const data = await getUserData(redid);
  res.json({ 
    success: true, 
    configs: data && data.configs ? data.configs : [] 
  });
});

// POST /api/v1/configs/save
app.post('/api/v1/configs/save', async (req, res) => {
  const { redid, name, data: configData } = req.body;
  if (!redid || !name) {
    return res.status(400).json({ success: false, error: 'redid and name required' });
  }

  const data = await ensureUserData(redid);
  data.configs = data.configs || [];

  const existingIndex = data.configs.findIndex(c => c.name === name);
  const configEntry = { name, data: configData, updated_at: new Date().toISOString() };

  if (existingIndex >= 0) {
    data.configs[existingIndex] = configEntry;
  } else {
    data.configs.push(configEntry);
  }

  await saveUserData(redid, data);
  res.json({ success: true });
});

// POST /api/v1/configs/delete
app.post('/api/v1/configs/delete', async (req, res) => {
  const { redid, name } = req.body;
  if (!redid || !name) {
    return res.status(400).json({ success: false, error: 'redid and name required' });
  }

  const data = await getUserData(redid);
  if (data && data.configs) {
    data.configs = data.configs.filter(c => c.name !== name);
    await saveUserData(redid, data);
  }

  res.json({ success: true });
});

// GET /api/v1/triggers/list
app.get('/api/v1/triggers/list', async (req, res) => {
  const { redid } = req.query;
  if (!redid) {
    return res.status(400).json({ success: false, error: 'redid required' });
  }

  const data = await getUserData(redid);
  res.json({ 
    success: true, 
    triggers: data && data.triggers ? data.triggers : [] 
  });
});

// POST /api/v1/triggers/save
app.post('/api/v1/triggers/save', async (req, res) => {
  const { redid, trigger } = req.body;
  if (!redid || !trigger) {
    return res.status(400).json({ success: false, error: 'redid and trigger required' });
  }

  const data = await ensureUserData(redid);
  data.triggers = data.triggers || [];

  const existingIndex = data.triggers.findIndex(t => t.id === trigger.id);
  if (existingIndex >= 0) {
    data.triggers[existingIndex] = { ...trigger, updated_at: new Date().toISOString() };
  } else {
    data.triggers.push({ ...trigger, id: trigger.id || Date.now().toString(), created_at: new Date().toISOString() });
  }

  await saveUserData(redid, data);
  res.json({ success: true });
});

// POST /api/v1/triggers/delete
app.post('/api/v1/triggers/delete', async (req, res) => {
  const { redid, trigger_id } = req.body;
  if (!redid || !trigger_id) {
    return res.status(400).json({ success: false, error: 'redid and trigger_id required' });
  }

  const data = await getUserData(redid);
  if (data && data.triggers) {
    data.triggers = data.triggers.filter(t => t.id !== trigger_id);
    await saveUserData(redid, data);
  }

  res.json({ success: true });
});

// GET /api/v1/outfits/list
app.get('/api/v1/outfits/list', async (req, res) => {
  const { redid } = req.query;
  if (!redid) {
    return res.status(400).json({ success: false, error: 'redid required' });
  }

  const data = await getUserData(redid);
  res.json({ 
    success: true, 
    outfits: data && data.outfits ? data.outfits : [] 
  });
});

// POST /api/v1/outfits/save
app.post('/api/v1/outfits/save', async (req, res) => {
  const { redid, outfit } = req.body;
  if (!redid || !outfit) {
    return res.status(400).json({ success: false, error: 'redid and outfit required' });
  }

  const data = await ensureUserData(redid);
  data.outfits = data.outfits || [];

  const existingIndex = data.outfits.findIndex(o => o.id === outfit.id);
  if (existingIndex >= 0) {
    data.outfits[existingIndex] = { ...outfit, updated_at: new Date().toISOString() };
  } else {
    data.outfits.push({ ...outfit, id: outfit.id || Date.now().toString(), created_at: new Date().toISOString() });
  }

  await saveUserData(redid, data);
  res.json({ success: true });
});

// POST /api/v1/outfits/delete
app.post('/api/v1/outfits/delete', async (req, res) => {
  const { redid, outfit_id } = req.body;
  if (!redid || !outfit_id) {
    return res.status(400).json({ success: false, error: 'redid and outfit_id required' });
  }

  const data = await getUserData(redid);
  if (data && data.outfits) {
    data.outfits = data.outfits.filter(o => o.id !== outfit_id);
    await saveUserData(redid, data);
  }

  res.json({ success: true });
});

// GET /api/v1/vehicles/list
app.get('/api/v1/vehicles/list', async (req, res) => {
  const { redid } = req.query;
  if (!redid) {
    return res.status(400).json({ success: false, error: 'redid required' });
  }

  const data = await getUserData(redid);
  res.json({ 
    success: true, 
    vehicles: data && data.vehicles ? data.vehicles : [] 
  });
});

// POST /api/v1/vehicles/save
app.post('/api/v1/vehicles/save', async (req, res) => {
  const { redid, vehicle } = req.body;
  if (!redid || !vehicle) {
    return res.status(400).json({ success: false, error: 'redid and vehicle required' });
  }

  const data = await ensureUserData(redid);
  data.vehicles = data.vehicles || [];

  const existingIndex = data.vehicles.findIndex(v => v.id === vehicle.id);
  if (existingIndex >= 0) {
    data.vehicles[existingIndex] = { ...vehicle, updated_at: new Date().toISOString() };
  } else {
    data.vehicles.push({ ...vehicle, id: vehicle.id || Date.now().toString(), created_at: new Date().toISOString() });
  }

  await saveUserData(redid, data);
  res.json({ success: true });
});

// POST /api/v1/vehicles/delete
app.post('/api/v1/vehicles/delete', async (req, res) => {
  const { redid, vehicle_id } = req.body;
  if (!redid || !vehicle_id) {
    return res.status(400).json({ success: false, error: 'redid and vehicle_id required' });
  }

  const data = await getUserData(redid);
  if (data && data.vehicles) {
    data.vehicles = data.vehicles.filter(v => v.id !== vehicle_id);
    await saveUserData(redid, data);
  }

  res.json({ success: true });
});

// GET /api/v1/banners/list
app.get('/api/v1/banners/list', (req, res) => {
  res.json({ 
    success: true, 
    banners: [
      { id: '1', name: 'ZTBannerAnimated', url: '/assets/banners/ZTBannerAnimated.gif', type: 'gif' },
      { id: '2', name: 'ZTBanner3', url: '/assets/banners/ZTBanner3.png', type: 'png' },
      { id: '3', name: 'banner', url: '/assets/banners/banner.gif', type: 'gif' }
    ] 
  });
});

// GET /api/v1/custom-luas/list
app.get('/api/v1/custom-luas/list', async (req, res) => {
  const { redid } = req.query;
  if (!redid) {
    return res.status(400).json({ success: false, error: 'redid required' });
  }

  const data = await getUserData(redid);
  res.json({ 
    success: true, 
    luas: data && data.custom_luas ? data.custom_luas : [] 
  });
});

// POST /api/v1/custom-luas/save
app.post('/api/v1/custom-luas/save', async (req, res) => {
  const { redid, lua } = req.body;
  if (!redid || !lua) {
    return res.status(400).json({ success: false, error: 'redid and lua required' });
  }

  const data = await ensureUserData(redid);
  data.custom_luas = data.custom_luas || [];

  const existingIndex = data.custom_luas.findIndex(l => l.id === lua.id);
  if (existingIndex >= 0) {
    data.custom_luas[existingIndex] = { ...lua, updated_at: new Date().toISOString() };
  } else {
    data.custom_luas.push({ ...lua, id: lua.id || Date.now().toString(), created_at: new Date().toISOString() });
  }

  await saveUserData(redid, data);
  res.json({ success: true });
});

// POST /api/v1/custom-luas/delete
app.post('/api/v1/custom-luas/delete', async (req, res) => {
  const { redid, lua_id } = req.body;
  if (!redid || !lua_id) {
    return res.status(400).json({ success: false, error: 'redid and lua_id required' });
  }

  const data = await getUserData(redid);
  if (data && data.custom_luas) {
    data.custom_luas = data.custom_luas.filter(l => l.id !== lua_id);
    await saveUserData(redid, data);
  }

  res.json({ success: true });
});

// POST /api/v1/discord/link
app.post('/api/v1/discord/link', async (req, res) => {
  const { redid, discord_id } = req.body;
  if (!redid || !discord_id) {
    return res.status(400).json({ success: false, error: 'redid and discord_id required' });
  }

  const data = await ensureUserData(redid);
  data.discord_id = discord_id;
  await saveUserData(redid, data);

  res.json({ success: true });
});

// GET /api/v1/web/check
app.get('/api/v1/web/check', async (req, res) => {
  const { redid } = req.query;
  if (!redid) {
    return res.status(400).json({ success: false, error: 'redid required' });
  }

  const data = await getUserData(redid);
  res.json({ 
    success: true, 
    registered: data ? data.registered : false 
  });
});

// POST /api/v1/web/register
app.post('/api/v1/web/register', async (req, res) => {
  const { redid } = req.body;
  if (!redid) {
    return res.status(400).json({ success: false, error: 'redid required' });
  }

  const data = await ensureUserData(redid);
  data.registered = true;
  data.registered_at = new Date().toISOString();
  await saveUserData(redid, data);

  res.json({ success: true });
});

// POST /api/v1/web/password
app.post('/api/v1/web/password', (req, res) => {
  res.json({ success: true });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Export handler for Netlify
module.exports.handler = serverless(app);
