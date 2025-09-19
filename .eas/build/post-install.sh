#!/bin/bash
set -e

echo "Fixing lightningcss native binaries for Linux..."

LIGHTNINGCSS_PATH="node_modules/react-native-css-interop/node_modules/lightningcss"

if [ -d "$LIGHTNINGCSS_PATH" ]; then
    echo "Found lightningcss at $LIGHTNINGCSS_PATH"
    cd "$LIGHTNINGCSS_PATH"

    # Try to rebuild the native binaries
    npm rebuild lightningcss --verbose || {
        echo "Rebuild failed, installing fallback..."
        npm install lightningcss@1.25.1 --save-dev
    }
else
    echo "No nested lightningcss, installing at project root..."
    cd /home/expo/workingdir/build
    npm install lightningcss@1.25.1 --save-dev
fi

echo "lightningcss fix completed"
