#!/bin/bash
#
# NeuroLynx Ollama Setup Script
# This script checks for an existing Ollama installation and helps set it up
#

set -e

echo ""
echo "=================================="
echo " NeuroLynx - Ollama Setup Helper"
echo "=================================="
echo ""

# Check if Ollama is installed
check_ollama() {
    if command -v ollama &> /dev/null; then
        OLLAMA_PATH=$(which ollama)
        OLLAMA_VERSION=$(ollama --version 2>/dev/null || echo "unknown")
        echo "✓ Ollama found: $OLLAMA_PATH"
        echo "  Version: $OLLAMA_VERSION"
        return 0
    else
        echo "✗ Ollama not found in PATH"
        return 1
    fi
}

# Check if Ollama service is running
check_ollama_service() {
    if curl -s http://localhost:11434/api/version > /dev/null 2>&1; then
        echo "✓ Ollama service is running on http://localhost:11434"
        return 0
    else
        echo "✗ Ollama service is not running"
        return 1
    fi
}

# List installed models
list_models() {
    echo ""
    echo "Installed Models:"
    echo "-----------------"
    ollama list 2>/dev/null || echo "  (Unable to list models)"
}

# Main script
echo "Checking for Ollama installation..."
echo ""

if check_ollama; then
    echo ""
    check_ollama_service
    list_models
    
    echo ""
    echo "=================================="
    echo " Ollama is ready for NeuroLynx!"
    echo "=================================="
    echo ""
    echo "If Ollama is not running, start it with:"
    echo "  ollama serve"
    echo ""
    echo "To pull recommended models:"
    echo "  ollama pull llama3.3      # Great all-around model"
    echo "  ollama pull mistral       # Fast and efficient"
    echo "  ollama pull phi3          # Lightweight, good for coding"
    echo "  ollama pull qwen2.5       # Multilingual support"
    echo ""
else
    echo ""
    echo "=================================="
    echo " Ollama Installation Required"
    echo "=================================="
    echo ""
    echo "To install Ollama, visit: https://ollama.ai/download"
    echo ""
    echo "Quick install commands:"
    echo ""
    echo "  macOS / Linux:"
    echo "    curl -fsSL https://ollama.ai/install.sh | sh"
    echo ""
    echo "  Windows:"
    echo "    Download from: https://ollama.ai/download/windows"
    echo ""
    echo "After installation:"
    echo "  1. Start Ollama: ollama serve"
    echo "  2. Pull a model: ollama pull llama3.3"
    echo "  3. Open NeuroLynx and go to Settings > AI Configuration"
    echo ""
fi

echo "=================================="
echo ""
