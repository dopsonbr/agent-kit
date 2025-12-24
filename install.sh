#!/usr/bin/env bash
# install.sh - Bootstrap agent-kit installation
# Usage: curl -fsSL https://raw.githubusercontent.com/dopsonbr/agent-kit/main/install.sh | bash

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

info() { echo -e "${GREEN}▸${NC} $1"; }
warn() { echo -e "${YELLOW}▸${NC} $1"; }
error() { echo -e "${RED}✗${NC} $1" >&2; }

# Parse arguments
PRESET=""
YES_FLAG=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --all)
      PRESET="full"
      YES_FLAG="--yes"
      shift
      ;;
    --preset)
      PRESET="$2"
      shift 2
      ;;
    --yes|-y)
      YES_FLAG="--yes"
      shift
      ;;
    *)
      shift
      ;;
  esac
done

# Check for npx
if ! command -v npx &> /dev/null; then
  error "npx not found. Please install Node.js 18+ first."
  echo "  brew install node    # macOS"
  echo "  apt install nodejs   # Ubuntu/Debian"
  exit 1
fi

info "Installing agent-kit..."

# Run installation (avoid eval for security)
if [[ -n "$PRESET" ]]; then
  npx agent-kit@latest init --preset "$PRESET" $YES_FLAG
else
  npx agent-kit@latest init $YES_FLAG
fi

info "Done! Run 'ak help' to get started."
