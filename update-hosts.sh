#!/bin/bash
# This script adds edsa.localhost to the hosts file for testing
# Run with sudo permissions

echo "Adding edsa.localhost to hosts file..."
echo "127.0.0.1 edsa.localhost" | sudo tee -a /etc/hosts

echo "Hosts file updated. You can now access http://edsa.localhost:3004"
