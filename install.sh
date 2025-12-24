#!/usr/bin/env bash
# install.sh - Install agent-kit binary
# Usage: curl -fsSL https://raw.githubusercontent.com/dopsonbr/agent-kit/main/install.sh | bash

set -euo pipefail

REPO="dopsonbr/agent-kit"
INSTALL_DIR="${HOME}/.local/bin"
BINARY_NAME="ak"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

info() { echo -e "${GREEN}▸${NC} $1"; }
warn() { echo -e "${YELLOW}▸${NC} $1"; }
error() { echo -e "${RED}✗${NC} $1" >&2; exit 1; }

# Detect platform
detect_platform() {
  local os arch
  os="$(uname -s)"
  arch="$(uname -m)"

  case "$os" in
    Darwin)
      case "$arch" in
        arm64) echo "darwin-arm64" ;;
        *) error "Unsupported architecture: $arch. Only Apple Silicon (arm64) is supported." ;;
      esac
      ;;
    *)
      error "Unsupported OS: $os. Only macOS is supported."
      ;;
  esac
}

# Get latest release version
get_latest_version() {
  curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" \
    | grep '"tag_name":' \
    | sed -E 's/.*"([^"]+)".*/\1/' \
    || error "Failed to fetch latest version. Check if releases exist at https://github.com/${REPO}/releases"
}

# Parse arguments
VERSION=""
while [[ $# -gt 0 ]]; do
  case $1 in
    --version)
      if [[ -z "${2:-}" ]]; then
        error "--version requires a value (e.g., --version v1.0.0)"
      fi
      VERSION="$2"
      shift 2
      ;;
    --version=*)
      VERSION="${1#*=}"
      shift
      ;;
    *)
      shift
      ;;
  esac
done

# Detect platform
PLATFORM=$(detect_platform)
ASSET_NAME="ak-${PLATFORM}"

# Get version (latest if not specified)
if [[ -z "$VERSION" ]]; then
  info "Fetching latest version..."
  VERSION=$(get_latest_version)
fi

info "Installing agent-kit ${VERSION}..."

# Create install directory
mkdir -p "$INSTALL_DIR"

# Download binary
DOWNLOAD_URL="https://github.com/${REPO}/releases/download/${VERSION}/${ASSET_NAME}"
info "Downloading from ${DOWNLOAD_URL}..."

if ! curl -fsSL -o "${INSTALL_DIR}/${BINARY_NAME}" "$DOWNLOAD_URL"; then
  error "Failed to download binary. Check if version ${VERSION} exists at https://github.com/${REPO}/releases"
fi

# Make executable
chmod +x "${INSTALL_DIR}/${BINARY_NAME}"

# Verify installation
if ! "${INSTALL_DIR}/${BINARY_NAME}" --version >/dev/null 2>&1; then
  error "Installation verification failed"
fi

INSTALLED_VERSION=$("${INSTALL_DIR}/${BINARY_NAME}" --version)
info "Installed: ${INSTALLED_VERSION}"

# Check if install directory is in PATH
if [[ ":$PATH:" != *":${INSTALL_DIR}:"* ]]; then
  warn "${INSTALL_DIR} is not in your PATH"
  echo ""
  echo "Add to your shell profile (~/.zshrc or ~/.bashrc):"
  echo ""
  echo "  export PATH=\"\$HOME/.local/bin:\$PATH\""
  echo ""
fi

info "Done! Run 'ak help' to get started."
