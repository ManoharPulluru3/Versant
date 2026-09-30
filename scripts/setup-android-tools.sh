#!/usr/bin/env bash
# Links bundled JDK + Android SDK from the ElytEdu platform repo when available.
# Safe to re-run; creates or updates Versant App/.tools symlink.

set -euo pipefail

_REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
_TOOLS="${_REPO_ROOT}/.tools"

_CANDIDATES=(
  "/home/manohar/Documents/ElytEdu/hycoder-multi-tenant-saas-platform/.tools"
  "${HOME}/Documents/ElytEdu/hycoder-multi-tenant-saas-platform/.tools"
)

_SOURCE=""
for _path in "${_CANDIDATES[@]}"; do
  if [[ -d "${_path}/jdk17" && -d "${_path}/android-sdk" ]]; then
    _SOURCE="${_path}"
    break
  fi
done

if [[ -z "${_SOURCE}" ]]; then
  echo "Could not find ElytEdu .tools (jdk17 + android-sdk)."
  echo "Either:"
  echo "  1) Clone/setup hycoder-multi-tenant-saas-platform and install .tools there, then re-run this script"
  echo "  2) Copy jdk17 and android-sdk into: ${_TOOLS}/"
  exit 1
fi

if [[ -L "${_TOOLS}" ]]; then
  rm "${_TOOLS}"
elif [[ -d "${_TOOLS}" ]]; then
  echo ".tools already exists as a directory (not a symlink). Leave it or remove it manually."
  exit 1
fi

ln -sfn "${_SOURCE}" "${_TOOLS}"
echo "Linked ${_TOOLS} -> ${_SOURCE}"
echo "Next: source scripts/android-dev-env.sh"
