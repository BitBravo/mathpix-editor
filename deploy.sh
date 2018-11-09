#!/bin/bash
npm run build
aws s3 sync build s3://editor.mathpix.com --delete
aws cloudfront create-invalidation --distribution-id E2923IFCZZHFJB --paths "/*"
