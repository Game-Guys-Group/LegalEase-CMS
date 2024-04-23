#!/bin/env bash

# activate the virtual environment
source backend/env/bin/activate


# start frontend
cd frontend
npm run dev&


# start backend
cd ../backend
uvicorn src.main:app --reload&


echo "Press Ctrl+C to stop"
# wait for Ctrl+C

sleep 999d


trap "exit" INT TERM
trap "kill 0" EXIT
