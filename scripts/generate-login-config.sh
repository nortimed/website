#!/bin/sh
set -e

echo "{\n  \"enabled\": true,\n  \"username\": \"$LOGIN_USERNAME\",\n  \"password\": \"$LOGIN_PASSWORD\"\n}" > ./out/login-config.json
