#!/bin/bash
# Deploy PPC DASH na VPS via Docker
# Execute na VPS: bash deploy.sh

set -e

REPO="https://github.com/Pedrolopespro/ppc-dash.git"
DIR="/docker/ppc-dash"
IMAGE="ppc-dash"
CONTAINER="ppc-dash-app"

echo "=== PPC DASH Deploy ==="

# Clonar ou atualizar
if [ -d "$DIR" ]; then
  echo "→ Atualizando repositório..."
  cd "$DIR" && git pull
else
  echo "→ Clonando repositório..."
  git clone "$REPO" "$DIR"
  cd "$DIR"
fi

# Build da imagem Docker
echo "→ Building Docker image..."
docker build -t "$IMAGE" .

# Parar container anterior se existir
docker rm -f "$CONTAINER" 2>/dev/null || true

# Iniciar novo container
echo "→ Iniciando container..."
docker run -d \
  --name "$CONTAINER" \
  --restart unless-stopped \
  --network traefik-net \
  --label "traefik.enable=true" \
  --label "traefik.http.routers.ppc-dash.rule=Host(\`dash-uzcu.srv1627758.hstgr.cloud\`)" \
  --label "traefik.http.routers.ppc-dash.entrypoints=websecure" \
  --label "traefik.http.routers.ppc-dash.tls.certresolver=myresolver" \
  --label "traefik.http.services.ppc-dash.loadbalancer.server.port=80" \
  "$IMAGE"

echo "✅ Deploy concluído!"
echo "   URL: https://dash-uzcu.srv1627758.hstgr.cloud"
