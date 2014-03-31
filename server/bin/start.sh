#!/bin/sh

# Set oxPushServer variables
{
    while read -r line; do
        export "$line"
    done < ./oxPushStartupVariables.sh
} &> /dev/null

cd ..
node oxPushServer.js
