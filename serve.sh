#!/usr/bin/env bash
#
# Live Development Server with Auto-Regeneration
# Usage: ./serve.sh

set -e

# Set Ruby 3.4 PATH for Homebrew on macOS
export PATH="/opt/homebrew/opt/ruby@3.4/bin:$PATH"

echo "========================================================"
echo "🚀 Starting Jekyll Live Server with Auto-Regeneration"
echo "🌐 URL: http://127.0.0.1:4000/notes/"
echo "========================================================"
echo ""

exec bundle exec jekyll serve --port 4000 --livereload
