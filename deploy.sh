#!/bin/bash
rm -rf editor.zip
zip editor.zip -r * .[^.]* -x "node_modules**" "*.zip"
eb deploy --timeout 50
