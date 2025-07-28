#!/bin/bash

# WanGov Cloudflare Tunnel Setup Script
# This creates beautiful subdomains for your unified digital identity platform

echo "🌐 Setting up Cloudflare Tunnel for WanGov Digital Identity System..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if cloudflared is installed
if ! command -v cloudflared &> /dev/null; then
    echo -e "${RED}❌ cloudflared is not installed. Please install it first:${NC}"
    echo "   brew install cloudflared"
    exit 1
fi

echo -e "${GREEN}✅ cloudflared is installed${NC}"

# Step 1: Login to Cloudflare (if not already done)
echo ""
echo -e "${BLUE}📋 Step 1: Cloudflare Authentication${NC}"
echo "If you haven't logged in yet, run:"
echo -e "${YELLOW}   cloudflared tunnel login${NC}"
echo ""
echo "This will open a browser window to authenticate with Cloudflare."
echo "Make sure you have a domain added to your Cloudflare account."
echo ""

# Step 2: Create the tunnel
echo -e "${BLUE}📋 Step 2: Create Tunnel${NC}"
echo "Run this command to create your tunnel:"
echo -e "${YELLOW}   cloudflared tunnel create wangov-digital-id${NC}"
echo ""

# Step 3: Configure DNS
echo -e "${BLUE}📋 Step 3: Configure DNS Records${NC}"
echo "Add these DNS records in your Cloudflare dashboard:"
echo ""
echo -e "${YELLOW}Type    Name                Value${NC}"
echo "CNAME   wangov              wangov-digital-id.cfargotunnel.com"
echo "CNAME   finance.wangov      wangov-digital-id.cfargotunnel.com"
echo "CNAME   health.wangov       wangov-digital-id.cfargotunnel.com"
echo "CNAME   education.wangov    wangov-digital-id.cfargotunnel.com"
echo "CNAME   edsa.wangov         wangov-digital-id.cfargotunnel.com"
echo "CNAME   nassit.wangov       wangov-digital-id.cfargotunnel.com"
echo "CNAME   mbsse.wangov        wangov-digital-id.cfargotunnel.com"
echo "CNAME   tax.wangov          wangov-digital-id.cfargotunnel.com"
echo ""
echo "Or use the wildcard:"
echo "CNAME   *.wangov            wangov-digital-id.cfargotunnel.com"
echo ""

# Step 4: Run the tunnel
echo -e "${BLUE}📋 Step 4: Start the Tunnel${NC}"
echo "Run this command to start your tunnel:"
echo -e "${YELLOW}   cloudflared tunnel --config cloudflare-tunnel-config.yml run wangov-digital-id${NC}"
echo ""

# Step 5: Test the subdomains
echo -e "${BLUE}📋 Step 5: Test Your Subdomains${NC}"
echo "Once running, you can access:"
echo ""
echo -e "${GREEN}🏛️  Main Portal:${NC}        https://wangov.com"
echo -e "${GREEN}💰 Finance Portal:${NC}      https://finance.wangov.com"
echo -e "${GREEN}🏥 Health Portal:${NC}       https://health.wangov.com"
echo -e "${GREEN}🎓 Education Portal:${NC}    https://education.wangov.com"
echo -e "${GREEN}⚡ EDSA Portal:${NC}         https://edsa.wangov.com"
echo -e "${GREEN}🛡️  NASSIT Portal:${NC}      https://nassit.wangov.com"
echo -e "${GREEN}🏫 MBSSE Portal:${NC}        https://mbsse.wangov.com"
echo ""

# Step 6: Background service
echo -e "${BLUE}📋 Step 6: Run as Background Service (Optional)${NC}"
echo "To run the tunnel as a background service:"
echo -e "${YELLOW}   cloudflared service install${NC}"
echo ""

echo -e "${GREEN}🎉 Setup complete! Your unified digital identity platform will have beautiful subdomains!${NC}"
echo ""
echo -e "${YELLOW}💡 Note:${NC} Replace 'wangov.com' with your actual domain name in the config file."
echo -e "${YELLOW}💡 Note:${NC} Make sure your domain is added to your Cloudflare account first."
echo ""

# Quick commands reference
echo -e "${BLUE}📚 Quick Commands Reference:${NC}"
echo "Login:           cloudflared tunnel login"
echo "Create tunnel:   cloudflared tunnel create wangov-digital-id"
echo "List tunnels:    cloudflared tunnel list"
echo "Run tunnel:      cloudflared tunnel --config cloudflare-tunnel-config.yml run wangov-digital-id"
echo "Delete tunnel:   cloudflared tunnel delete wangov-digital-id"
echo ""
