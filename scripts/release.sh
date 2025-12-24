#!/usr/bin/env bash
# scripts/release.sh - Create a GitHub release with binary
# Usage: ./scripts/release.sh v1.0.0

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info() { echo -e "${GREEN}▸${NC} $1"; }
warn() { echo -e "${YELLOW}▸${NC} $1"; }
error() { echo -e "${RED}✗${NC} $1" >&2; exit 1; }

# Validate arguments
VERSION="${1:-}"
if [[ -z "$VERSION" ]]; then
  error "Usage: $0 <version> (e.g., v1.0.0)"
fi

# Validate version format
if [[ ! "$VERSION" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  error "Version must match pattern v*.*.* (e.g., v1.0.0)"
fi

# Check prerequisites
command -v gh >/dev/null 2>&1 || error "gh CLI not found. Install: brew install gh"
command -v bun >/dev/null 2>&1 || error "bun not found. Install: brew install oven-sh/bun/bun"
gh auth status >/dev/null 2>&1 || error "Not authenticated with gh. Run: gh auth login"

# Check for uncommitted changes
if [[ -n "$(git status --porcelain)" ]]; then
  warn "You have uncommitted changes. Continue? (y/N)"
  read -r response
  [[ "$response" =~ ^[Yy]$ ]] || exit 1
fi

# Check if tag exists
if git rev-parse "$VERSION" >/dev/null 2>&1; then
  error "Tag $VERSION already exists"
fi

BINARY_NAME="ak-darwin-arm64"
BINARY_PATH="dist/${BINARY_NAME}"

info "Building standalone executable..."
bun run build:standalone

# Verify binary was created
[[ -f "$BINARY_PATH" ]] || error "Build failed: $BINARY_PATH not found"

# Verify binary works
"$BINARY_PATH" --version >/dev/null 2>&1 || error "Binary verification failed"

info "Creating git tag $VERSION..."
git tag -a "$VERSION" -m "Release $VERSION"

info "Pushing tag to remote..."
git push origin "$VERSION"

info "Creating GitHub release..."
gh release create "$VERSION" \
  --title "$VERSION" \
  --generate-notes \
  "$BINARY_PATH#$BINARY_NAME"

info "Release $VERSION created successfully!"
echo ""
echo "View release: https://github.com/dopsonbr/agent-kit/releases/tag/$VERSION"
