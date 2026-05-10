# ZeroTrace Backend

Complete Netlify backend for the ZeroTrace FiveM mod menu.

## Project Structure

```
zerotrace-backend/
├── netlify.toml
├── package.json
├── README.md
├── netlify/
│   └── functions/
│       └── api.js          # Main API handler (all routes)
└── public/
    └── assets/
        ├── fonts/
        │   ├── Arial-bold.ttf         # Liberation Sans Bold
        │   ├── Montserrat-SemiBold.ttf # Montserrat SemiBold
        │   └── zt-icons.ttf           # Font Awesome 5 Free (icon font)
        ├── img/
        │   └── default_profile.png    # 128x128 placeholder avatar
        ├── banners/
        │   ├── ZTBannerAnimated.gif   # Animated banner
        │   ├── ZTBanner3.png          # Static banner
        │   └── banner.gif             # Generic banner
        └── audio/
            ├── FSError.wav            # Error sound
            ├── FSNotification.wav     # Notification sound
            ├── FSInfo.wav             # Info sound
            └── FSWarning.wav          # Warning sound
```

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/v1/status | Health check |
| POST | /api/v1/login | User login/upsert |
| POST | /api/v1/ban/check | Check ban status |
| GET | /api/v1/live/token | Get live token |
| POST | /api/v1/live/event | Log live event |
| POST | /api/v1/session/start | Start session |
| POST | /api/v1/session/heartbeat | Session heartbeat |
| POST | /api/v1/session/end | End session |
| POST | /api/v1/profile | Get user profile |
| GET | /api/v1/keybinds/load | Load keybinds |
| POST | /api/v1/keybinds/save | Save keybinds |
| GET | /api/v1/configs/list | List configs |
| POST | /api/v1/configs/save | Save config |
| POST | /api/v1/configs/delete | Delete config |
| GET | /api/v1/triggers/list | List triggers |
| POST | /api/v1/triggers/save | Save trigger |
| POST | /api/v1/triggers/delete | Delete trigger |
| GET | /api/v1/outfits/list | List outfits |
| POST | /api/v1/outfits/save | Save outfit |
| POST | /api/v1/outfits/delete | Delete outfit |
| GET | /api/v1/vehicles/list | List vehicles |
| POST | /api/v1/vehicles/save | Save vehicle |
| POST | /api/v1/vehicles/delete | Delete vehicle |
| GET | /api/v1/banners/list | List banners |
| GET | /api/v1/custom-luas/list | List custom Lua scripts |
| POST | /api/v1/custom-luas/save | Save custom Lua |
| POST | /api/v1/custom-luas/delete | Delete custom Lua |
| POST | /api/v1/discord/link | Link Discord account |
| GET | /api/v1/web/check | Check web registration |
| POST | /api/v1/web/register | Register web account |
| POST | /api/v1/web/password | Set/change password |

## Deployment Instructions

### Step 1: Download Font Files (Replace Placeholders)

The included font files are minimal placeholders. For production, download the real fonts:

**Liberation Sans Bold (Arial alternative):**
```bash
# Option A: From GitHub (official liberation fonts repo)
curl -L "https://github.com/liberationfonts/liberation-fonts/raw/main/liberation-fonts-ttf-2.1.5/LiberationSans-Bold.ttf" -o public/assets/fonts/Arial-bold.ttf

# Option B: From Debian packages
wget https://deb.debian.org/debian/pool/main/f/fonts-liberation2/fonts-liberation2_2.1.5-3_all.deb
ar x fonts-liberation2_2.1.5-3_all.deb
tar -xf data.tar.xz
# Copy usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf to public/assets/fonts/Arial-bold.ttf
```

**Montserrat SemiBold:**
```bash
# From Google Fonts GitHub repo
curl -L "https://github.com/JulietaUla/Montserrat/raw/master/fonts/ttf/Montserrat-SemiBold.ttf" -o public/assets/fonts/Montserrat-SemiBold.ttf

# Or download from Google Fonts website:
# 1. Visit https://fonts.google.com/specimen/Montserrat
# 2. Click "Get font" → "SemiBold 600"
# 3. Download and extract the ZIP
# 4. Copy Montserrat-SemiBold.ttf to public/assets/fonts/
```

**Font Awesome 5 Free (for zt-icons.ttf):**
```bash
# Download from Font Awesome CDN
curl -L "https://use.fontawesome.com/releases/v5.15.4/webfonts/fa-solid-900.ttf" -o public/assets/fonts/zt-icons.ttf

# Or from GitHub:
curl -L "https://github.com/FortAwesome/Font-Awesome/raw/5.x/webfonts/fa-solid-900.ttf" -o public/assets/fonts/zt-icons.ttf
```

### Step 2: Download Real Audio Files (Optional)

The included WAV files are simple generated tones. For production sounds:

```bash
# Option A: Free sound effect sites
# Visit https://freesound.org/ or https://pixabay.com/sound-effects/
# Search for: "error beep", "notification pop", "info ping", "warning alert"
# Download and rename accordingly

# Option B: Generate custom sounds with tools like:
# - sfxr (https://www.drpetter.se/project_sfxr.html)
# - Bfxr (https://www.bfxr.net/)
# - Audacity (https://www.audacityteam.org/)
```

### Step 3: Install Node Dependencies

```bash
# Navigate to project directory
cd zerotrace-backend

# Install dependencies
npm install

# Or if you want to install globally for Netlify CLI
npm install -g netlify-cli
```

### Step 4: Deploy to Netlify

**Option A: Deploy via Netlify CLI (Recommended)**

```bash
# 1. Login to Netlify (first time only)
netlify login

# 2. Initialize/connect site (first time only)
netlify init
# Choose "Create & configure a new site"
# Select your team
# Choose a site name (e.g., "zerotrace-backend")

# 3. Deploy to production
netlify deploy --prod

# The CLI will output your site URL, e.g.:
# https://zerotrace-backend-abc123.netlify.app
```

**Option B: Deploy via Drag-and-Drop**

```bash
# 1. Build the project (optional, just zips the folder)
# Netlify serves static files from /public automatically

# 2. Zip the entire project folder
cd ..
zip -r zerotrace-backend.zip zerotrace-backend/

# 3. Go to https://app.netlify.com/drop
# 4. Drag and drop the zerotrace-backend.zip file
# 5. Netlify will deploy and give you a URL
```

**Option C: Deploy via Git (Continuous Deployment)**

```bash
# 1. Create a GitHub/GitLab repository
# 2. Push this code:
git init
git add .
git commit -m "Initial ZeroTrace backend"
git remote add origin https://github.com/YOUR_USERNAME/zerotrace-backend.git
git push -u origin main

# 3. In Netlify dashboard:
#    - Click "Add new site" → "Import an existing project"
#    - Connect to your Git provider
#    - Select the repository
#    - Build command: (leave empty, or "npm install")
#    - Publish directory: (leave empty, defaults to root)
#    - Click "Deploy site"
```

### Step 5: Verify Deployment

After deployment, test these URLs in your browser:

```
# Test API health check
https://YOUR-SITE.netlify.app/api/v1/status
# Expected: {"success": true}

# Test static font file serving
https://YOUR-SITE.netlify.app/assets/fonts/Arial-bold.ttf
# Expected: File download starts

# Test static image
https://YOUR-SITE.netlify.app/assets/img/default_profile.png
# Expected: 128x128 placeholder image

# Test banner
https://YOUR-SITE.netlify.app/assets/banners/ZTBannerAnimated.gif
# Expected: Animated GIF

# Test audio
https://YOUR-SITE.netlify.app/assets/audio/FSError.wav
# Expected: WAV file download
```

### Step 6: Test API Functionality

Use curl or Postman to test the API:

```bash
# Set your deployed URL
BASE_URL="https://YOUR-SITE.netlify.app"

# Test login
curl -X POST "$BASE_URL/api/v1/login" \
  -H "Content-Type: application/json" \
  -d '{"redid":"test123","username":"TestUser","branch":"master","subscription":"premium"}'
# Expected: {"success": true}

# Test ban check
curl -X POST "$BASE_URL/api/v1/ban/check" \
  -H "Content-Type: application/json" \
  -d '{"redid":"test123"}'
# Expected: {"banned": false, "reason": "", "by": ""}

# Test profile
curl -X POST "$BASE_URL/api/v1/profile" \
  -H "Content-Type: application/json" \
  -d '{"redid":"test123"}'
# Expected: {"success": true, "profile": {"avatar": null, ...}}

# Test keybinds load
curl "$BASE_URL/api/v1/keybinds/load?redid=test123"
# Expected: {"success": true, "keybinds": {}, "system_keys": {}, "first_time": true}

# Test keybinds save
curl -X POST "$BASE_URL/api/v1/keybinds/save" \
  -H "Content-Type: application/json" \
  -d '{"redid":"test123","keybinds":{"menu":"F8","noclip":"F2"},"system_keys":{"exit":"Escape"}}'
# Expected: {"success": true}

# Test configs list
curl "$BASE_URL/api/v1/configs/list?redid=test123"
# Expected: {"success": true, "configs": []}

# Test config save
curl -X POST "$BASE_URL/api/v1/configs/save" \
  -H "Content-Type: application/json" \
  -d '{"redid":"test123","name":"Default","data":{"aimbot":false,"esp":true}}'
# Expected: {"success": true}

# Test session start
curl -X POST "$BASE_URL/api/v1/session/start" \
  -H "Content-Type: application/json" \
  -d '{"redid":"test123"}'
# Expected: {"success": true}

# Test live token
curl "$BASE_URL/api/v1/live/token?redid=test123"
# Expected: {"token": "dummy"}

# Test Discord link
curl -X POST "$BASE_URL/api/v1/discord/link" \
  -H "Content-Type: application/json" \
  -d '{"redid":"test123","discord_id":"123456789012345678"}'
# Expected: {"success": true}

# Test web check
curl "$BASE_URL/api/v1/web/check?redid=test123"
# Expected: {"success": true, "registered": false}

# Test web register
curl -X POST "$BASE_URL/api/v1/web/register" \
  -H "Content-Type: application/json" \
  -d '{"redid":"test123"}'
# Expected: {"success": true}
```

## Environment Variables (Optional)

For production, you can set these in Netlify dashboard (Site settings → Environment variables):

| Variable | Description |
|----------|-------------|
| `NETLIFY_BLOBS_CONTEXT` | Auto-set by Netlify, required for Blobs to work |
| `JWT_SECRET` | If you want to add token authentication later |
| `ADMIN_KEY` | For admin endpoints (if added later) |

## Storage Architecture

This backend uses **Netlify Blobs** for persistence:

- Each user gets one blob keyed by their `redid`
- Blob contains a JSON object with all user data
- Data includes: keybinds, configs, outfits, vehicles, triggers, custom Lua scripts, Discord linkage, ban status, sessions
- Blobs are automatically managed by Netlify (no database setup required)

## Notes

- The `redid` parameter is required for most endpoints and serves as the user identifier
- Data persists across deployments since Netlify Blobs are stored separately from the function code
- The free tier includes 100GB of blob storage
- Functions have a 10-second execution limit on the free tier
- Static assets are served from `/public/assets/` via Netlify's CDN

## License

MIT - For educational and personal use only. Respect FiveM's Terms of Service.
