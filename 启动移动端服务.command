#!/bin/zsh

set -u

PROJECT_DIR="${0:A:h}"
START_PORT="${1:-${PORT:-8000}}"
HOME_PAGE="outputs/community-homepage-style-exploration/mobile-home.html"

cd "$PROJECT_DIR" || {
  echo "无法进入移动端项目目录：$PROJECT_DIR"
  read -r "?按回车键关闭窗口..."
  exit 1
}

PYTHON_BIN="$(command -v python3 2>/dev/null || true)"
if [[ -z "$PYTHON_BIN" ]]; then
  echo "未找到 Python 3，无法启动本地服务。"
  echo "请先安装 Python 3，然后重新双击此文件。"
  read -r "?按回车键关闭窗口..."
  exit 1
fi

if [[ "$START_PORT" != <-> ]] || (( START_PORT < 1 || START_PORT > 65535 )); then
  echo "端口无效：$START_PORT"
  echo "请使用 1 到 65535 之间的端口。"
  read -r "?按回车键关闭窗口..."
  exit 1
fi

MAX_PORT=$(( START_PORT + 99 ))
if (( MAX_PORT > 65535 )); then
  MAX_PORT=65535
fi

port_is_available() {
  "$PYTHON_BIN" - "$1" <<'PY'
import socket
import sys

port = int(sys.argv[1])
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
    try:
        sock.bind(("0.0.0.0", port))
    except OSError:
        raise SystemExit(1)
PY
}

PORT_NUMBER="$START_PORT"
while ! port_is_available "$PORT_NUMBER"; do
  (( PORT_NUMBER += 1 ))
  if (( PORT_NUMBER > MAX_PORT )); then
    echo "端口 ${START_PORT}-${MAX_PORT} 均被占用，无法启动服务。"
    read -r "?按回车键关闭窗口..."
    exit 1
  fi
done

DEFAULT_INTERFACE="$(route -n get default 2>/dev/null | awk '/interface:/{print $2; exit}')"
LAN_IP=""
if [[ -n "$DEFAULT_INTERFACE" ]]; then
  LAN_IP="$(ipconfig getifaddr "$DEFAULT_INTERFACE" 2>/dev/null || true)"
fi
if [[ -z "$LAN_IP" ]]; then
  LAN_IP="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || true)"
fi

LOCAL_URL="http://127.0.0.1:${PORT_NUMBER}/${HOME_PAGE}"
if [[ -n "$LAN_IP" ]]; then
  ACCESS_URL="http://${LAN_IP}:${PORT_NUMBER}/${HOME_PAGE}"
else
  ACCESS_URL="$LOCAL_URL"
fi

echo
echo "AI666 移动端服务已启动"
echo "项目目录：$PROJECT_DIR"
echo "本机地址：$LOCAL_URL"
if [[ -n "$LAN_IP" ]]; then
  echo "局域网地址：$ACCESS_URL"
  echo "手机与电脑连接同一 Wi-Fi 后即可访问。"
else
  echo "未检测到局域网 IP，请检查网络连接。"
fi
echo
echo "浏览器即将自动打开。按 Control + C 可停止服务。"
echo

if [[ "${OPEN_BROWSER:-1}" != "0" ]]; then
  (
    sleep 0.8
    open "$ACCESS_URL"
  ) &
fi

exec "$PYTHON_BIN" -m http.server "$PORT_NUMBER" \
  --bind 0.0.0.0 \
  --directory "$PROJECT_DIR"
