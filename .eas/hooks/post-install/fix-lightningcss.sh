#!/bin/bash
set -e

echo "Starting lightningcss fix for EAS build..."

# Force clean install of lightningcss at root level
echo "Installing lightningcss at root level..."
npm install lightningcss --save-dev --force

# Also install it in the react-native-css-interop location
REACT_CSS_PATH="node_modules/react-native-css-interop"
if [ -d "$REACT_CSS_PATH" ]; then
    echo "Installing lightningcss in react-native-css-interop..."
    cd "$REACT_CSS_PATH"
    npm install lightningcss --no-save --force
    cd /home/expo/workingdir/build
fi

# Rebuild native modules
echo "Rebuilding native modules..."
npm rebuild

echo "lightningcss fix completed successfully"