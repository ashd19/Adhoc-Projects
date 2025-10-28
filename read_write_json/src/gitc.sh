#!/bin/bash
# filepath: ~/bin/gitc
# Small helper to quickly add & commit in the current git repo.
# Usage:
#   gitc [--no-add] [--amend] [message]
#   gitc           (prompts for message)
# Flags:
#   --no-add   : don't run `git add .` before committing
#   --amend    : pass --amend to `git commit`
#   -h, --help : show this help

no_add=0
amend=0
message=""

show_help() {
  sed -n '1,120p' "$0" | sed -n '1,120p' >/dev/stderr
}

# Parse options; first non-option token and the rest become the message
while [ "$#" -gt 0 ]; do
  case "$1" in
    --no-add)
      no_add=1; shift ;;
    --amend)
      amend=1; shift ;;
    -h|--help)
      cat <<'EOF'
Usage: gitc [--no-add] [--amend] [message]

Quick helper to add and commit changes in the current Git repo.

Options:
  --no-add   Do not run `git add .` before committing.
  --amend    Pass `--amend` to `git commit`.
  -h, --help Show this help.

Examples:
  gitc "Fix typo"
  gitc --no-add --amend "Update commit message"
EOF
      exit 0
      ;;
    --)
      shift; break ;;
    -* )
      echo "Unknown option: $1" >&2; exit 2 ;;
    * )
      # everything else is the message
      message="${*:1}"
      break
      ;;
  esac
done

# If still no message, prompt
if [ -z "$message" ]; then
  read -r -p "Enter the git commit message: " message
fi

# Verify we're inside a git work tree
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: current directory is not inside a Git repository." >&2
  exit 1
fi

# Stage changes unless user asked not to
if [ "$no_add" -eq 0 ]; then
  git add .
fi

# Build commit command
commit_cmd=(git commit)
if [ "$amend" -eq 1 ]; then
  commit_cmd+=(--amend)
fi
commit_cmd+=(-m "$message")

if "${commit_cmd[@]}"; then
  echo "Operation successful."
else
  echo "Operation failed." >&2
  exit 1
fi
git push