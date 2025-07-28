#!/bin/bash

# Script to update domain name in Cloudflare tunnel configuration

if [ $# -eq 0 ]; then
    echo "Usage: ./update-domain.sh <your-domain.com>"
    echo "Example: ./update-domain.sh wangov.sl"
    echo "Example: ./update-domain.sh yourdomain.com"
    exit 1
fi

NEW_DOMAIN=$1
CONFIG_FILE="cloudflare-tunnel-config.yml"

echo "🔄 Updating domain from 'wangov.com' to '$NEW_DOMAIN' in $CONFIG_FILE..."

# Create backup
cp $CONFIG_FILE "${CONFIG_FILE}.backup.$(date +%Y%m%d_%H%M%S)"

# Update domain in config file
sed -i '' "s/wangov\.com/$NEW_DOMAIN/g" $CONFIG_FILE

echo "✅ Domain updated successfully!"
echo ""
echo "Your new subdomains will be:"
echo "🏛️  Main Portal:        https://$NEW_DOMAIN"
echo "💰 Finance Portal:      https://finance.$NEW_DOMAIN"
echo "🏥 Health Portal:       https://health.$NEW_DOMAIN"
echo "🎓 Education Portal:    https://education.$NEW_DOMAIN"
echo "⚡ EDSA Portal:         https://edsa.$NEW_DOMAIN"
echo "🛡️  NASSIT Portal:      https://nassit.$NEW_DOMAIN"
echo "🏫 MBSSE Portal:        https://mbsse.$NEW_DOMAIN"
echo ""
echo "Remember to:"
echo "1. Add $NEW_DOMAIN to your Cloudflare account"
echo "2. Update DNS records to point to your tunnel"
echo "3. Restart your tunnel with the new configuration"
