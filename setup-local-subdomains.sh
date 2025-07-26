#!/bin/bash

# Setup script for local subdomain development
# This adds the necessary entries to /etc/hosts for subdomain routing

echo "Setting up local subdomain routing for WanGov multi-tenant system..."

# Backup current hosts file
sudo cp /etc/hosts /etc/hosts.backup.$(date +%Y%m%d_%H%M%S)

# Add subdomain entries for provider portals
echo "Adding subdomain entries to /etc/hosts..."

# Provider subdomains
SUBDOMAINS=(
    "tax.localhost"
    "education.localhost" 
    "health.localhost"
    "edsa.localhost"
    "nassit.localhost"
    "mbsse.localhost"
)

for subdomain in "${SUBDOMAINS[@]}"; do
    # Check if entry already exists
    if ! grep -q "$subdomain" /etc/hosts; then
        echo "127.0.0.1       $subdomain" | sudo tee -a /etc/hosts
        echo "✅ Added $subdomain"
    else
        echo "⚠️  $subdomain already exists in hosts file"
    fi
done

echo ""
echo "🎉 Local subdomain setup complete!"
echo ""
echo "You can now access provider portals at:"
echo "  • http://tax.localhost:3004 (Tax Authority Portal)"
echo "  • http://education.localhost:3004 (Education Portal)"
echo "  • http://health.localhost:3004 (Health Portal)"
echo "  • http://edsa.localhost:3004 (EDSA Portal)"
echo "  • http://nassit.localhost:3004 (NASSIT Portal)"
echo "  • http://mbsse.localhost:3004 (MBSSE Portal)"
echo ""
echo "Main portal: http://localhost:3004"
echo ""
echo "To remove these entries later, restore from backup:"
echo "  sudo cp /etc/hosts.backup.* /etc/hosts"
