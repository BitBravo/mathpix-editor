#!/bin/bash
rm -rf editor.zip
zip editor.zip -r * .[^.]*  -x "node_modules**" "*.zip" ".git**"
eb deploy --timeout 50
