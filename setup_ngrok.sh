#!/bin/bash

# Setup ngrok for BotShop Mini App
# Usage: ./setup_ngrok.sh YOUR_AUTHTOKEN

if [ -z "$1" ]; then
    echo "❌ Error: No authtoken provided"
    echo ""
    echo "Usage: ./setup_ngrok.sh YOUR_AUTHTOKEN"
    echo ""
    echo "Get your authtoken here:"
    echo "https://dashboard.ngrok.com/get-started/your-authtoken"
    exit 1
fi

AUTHTOKEN=$1

echo "🔧 Configuring ngrok..."
ngrok config add-authtoken "$AUTHTOKEN"

echo ""
echo "✅ ngrok configured!"
echo ""
echo "🚀 Starting ngrok tunnel..."
echo ""

# Start ngrok (will run in foreground)
ngrok http 8000 --log=stdout
