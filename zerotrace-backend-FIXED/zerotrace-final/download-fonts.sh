#!/bin/bash
# ZeroTrace Font Downloader
# Run this script in the zerotrace-backend directory

set -e

echo "=========================================="
echo "ZeroTrace Font Downloader"
echo "=========================================="
echo ""

FONTS_DIR="public/assets/fonts"
mkdir -p "$FONTS_DIR"

echo "[1/3] Downloading Liberation Sans Bold (Arial alternative)..."
curl -L -o "$FONTS_DIR/Arial-bold.ttf"   "https://github.com/shantigilbert/liberation-fonts-ttf/raw/master/LiberationSans-Bold.ttf"   || echo "Failed - try manual download from https://github.com/liberationfonts/liberation-fonts/releases"

echo ""
echo "[2/3] Downloading Montserrat SemiBold..."
curl -L -o "$FONTS_DIR/Montserrat-SemiBold.ttf"   "https://github.com/JulietaUla/Montserrat/raw/master/fonts/ttf/Montserrat-SemiBold.ttf"   || echo "Failed - try manual download from https://fonts.google.com/specimen/Montserrat"

echo ""
echo "[3/3] Downloading Font Awesome 5 Free Solid (zt-icons)..."
curl -L -o "$FONTS_DIR/zt-icons.ttf"   "https://github.com/FortAwesome/Font-Awesome/raw/5.x/webfonts/fa-solid-900.ttf"   || echo "Failed - try manual download from https://github.com/FortAwesome/Font-Awesome/releases/tag/5.15.4"

echo ""
echo "=========================================="
echo "Download complete! Verifying files..."
echo "=========================================="
echo ""

ls -la "$FONTS_DIR/"

echo ""
echo "Expected sizes:"
echo "  Arial-bold.ttf         ~130KB"
echo "  Montserrat-SemiBold.ttf ~200KB"
echo "  zt-icons.ttf            ~400KB"
echo ""
echo "If any file is under 10KB, the download failed."
echo "Use the manual download instructions in README.md"
