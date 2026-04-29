# Build the project
npm run build

# Automation: Find and remove all .map files to harden production
find ./dist -name "*.js.map" -type f -delete

echo "Production build cleaned of source maps."