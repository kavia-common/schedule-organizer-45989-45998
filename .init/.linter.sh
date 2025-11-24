#!/bin/bash
cd /home/kavia/workspace/code-generation/schedule-organizer-45989-45998/react_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

