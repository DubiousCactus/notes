#!/usr/bin/env bash
#
# Production Build Script for Jekyll Notes Blog
# Usage: ./build.sh

set -e

# Set Ruby 3.4 PATH for Homebrew on macOS
export PATH="/opt/homebrew/opt/ruby@3.4/bin:$PATH"

echo "========================================================"
echo "🔨 Building Jekyll Digital Garden & Graph..."
echo "========================================================"

bundle exec jekyll build

echo ""
echo "✅ Build clean & complete! Static output generated in _site/"
