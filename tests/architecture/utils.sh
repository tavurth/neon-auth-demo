#!/usr/bin/env bash

# Include both tracked and untracked files (excluding ignored)
git_files() {
  git ls-files --cached --others --exclude-standard "$@"
}
