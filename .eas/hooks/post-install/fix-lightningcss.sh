#!/bin/bash
set -e

echo "Fixing lightningcss native binaries for Linux..."

LIGHTNINGCSS_PATH="node_modules/react-native-css-interop/node_modules/lightningcss"

if [ -d "$LIGHTNINGCSS_PATH" ]; then
    echo "Found lightningcss at $LIGHTNINGCSS_PATH"
    cd "$LIGHTNINGCSS_PATH"
    npm rebuild lightningcss --verbose || {
        echo "Rebuild failed, installing at root level..."
        cd /home/expo/workingdir/build
        npm install lightningcss --save-dev
    }
else
    echo "lightningcss not found, installing at root level..."
    cd /home/expo/workingdir/build
    npm install lightningcss --save-dev
fi

echo "lightningcss fix completed"
