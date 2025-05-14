#!/bin/bash

REPO_URL="git@github.com:dickdangle/sphera-vm.git"
BRANCH="main"
LOG_FILE="memory/logs.md"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo "[Gal] Initializing Sphera git deployment..."

# Initialize if not already a git repo
if [ ! -d ".git" ]; then
  git init
  git branch -M $BRANCH
  git remote add origin $REPO_URL
fi

git add .
git commit -m "GalNet sync: $TIMESTAMP"
git push -u origin $BRANCH

# Ritual log entry
mkdir -p memory
echo "- [$TIMESTAMP] Deployment pushed to $REPO_URL on branch $BRANCH" >> $LOG_FILE

echo "[Gal] Deployment complete. Memory etched into logs.md."
