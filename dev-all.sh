#!/bin/bash

# Display ASCII art banner
echo "
██╗    ██╗ █████╗ ███╗   ██╗ ██████╗  ██████╗ ██╗   ██╗
██║    ██║██╔══██╗████╗  ██║██╔════╝ ██╔═══██╗██║   ██║
██║ █╗ ██║███████║██╔██╗ ██║██║  ███╗██║   ██║██║   ██║
██║███╗██║██╔══██║██║╚██╗██║██║   ██║██║   ██║╚██╗ ██╔╝
╚███╔███╔╝██║  ██║██║ ╚████║╚██████╔╝╚██████╔╝ ╚████╔╝ 
 ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝   ╚═══╝  
                                                        
Dev Environment Starter
"

echo "🔍 Checking for processes on required ports..."

# Define the ports to check and kill processes on
declare -a ports=(3003 3010)

# Kill any processes running on the specified ports
for port in "${ports[@]}"; do
  # Find the PID of any process listening on the port
  pid=$(lsof -i :$port -t 2>/dev/null)
  
  if [ -n "$pid" ]; then
    echo "🚫 Found process with PID $pid on port $port. Killing..."
    kill -9 $pid
    sleep 1
  else
    echo "✅ No process found on port $port"
  fi
done

echo ""
echo "🧹 All ports cleared. Starting services..."
echo ""

# Function to handle Ctrl+C and cleanup
cleanup() {
  echo ""
  echo "🛑 Shutting down services..."
  kill $SSO_PID $FRONTEND_PID 2>/dev/null
  exit 0
}

# Set trap for SIGINT (Ctrl+C)
trap cleanup SIGINT

# Start the SSO server in the background
echo "🔐 Starting SSO server on port 3010..."
cd "$(dirname "$0")/wangov-sso" && NODE_ENV=development node server.js &
SSO_PID=$!

# Wait to make sure the SSO server has started
sleep 2

if ps -p $SSO_PID > /dev/null; then
  echo "✅ SSO server started successfully (PID: $SSO_PID)"
else
  echo "❌ Failed to start SSO server"
  cleanup
fi

# Start the frontend app in the background
echo ""
echo "🌐 Starting frontend React app on port 3003..."
cd "$(dirname "$0")/wangov-id/frontend" && npm run dev &
FRONTEND_PID=$!

# Wait to make sure the frontend has started
sleep 5

if ps -p $FRONTEND_PID > /dev/null; then
  echo "✅ Frontend React app started successfully (PID: $FRONTEND_PID)"
else
  echo "❌ Failed to start frontend React app"
  cleanup
fi

echo ""
echo "🚀 All services are running!"
echo "📋 Service information:"
echo "   - SSO server: http://localhost:3010"
echo "   - Frontend app: http://localhost:3003"
echo "   - Subdomain access: http://edsa.localhost:3003, http://tax.localhost:3003, etc."
echo ""
echo "⚠️  Press Ctrl+C to stop all services"

# Wait for all background processes to finish (or until interrupted)
wait
