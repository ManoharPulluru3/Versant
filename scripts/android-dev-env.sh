#!/usr/bin/env bash
# Source before Android builds / adb (every new terminal):
#   source scripts/android-dev-env.sh

_REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

export JAVA_HOME="${_REPO_ROOT}/.tools/jdk17"
export ANDROID_HOME="${_REPO_ROOT}/.tools/android-sdk"
export ANDROID_SDK_ROOT="${ANDROID_HOME}"
export PATH="${JAVA_HOME}/bin:${ANDROID_HOME}/platform-tools:${_REPO_ROOT}/.tools/platform-tools:${PATH}"

unset _REPO_ROOT

if [[ ! -d "${JAVA_HOME}" || ! -d "${ANDROID_HOME}" ]]; then
  echo "Missing .tools/ — run: bash scripts/setup-android-tools.sh"
  return 1 2>/dev/null || exit 1
fi

echo "Android dev environment loaded:"
echo "  JAVA_HOME=${JAVA_HOME}"
echo "  ANDROID_HOME=${ANDROID_HOME}"
java -version 2>&1 | sed -n '1p'
adb version 2>&1 | sed -n '1p'
