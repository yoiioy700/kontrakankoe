#!/bin/bash
TOKEN="vca_2MI0eUf0DIVfW8MBKNYiaqDMiSYlQwJ5FmYmKxLtzGjlLYnSHx4YwuyV"
PROJECT_ID="prj_gYCdO78McZzThdiGBCdMGcnPSiyQ"

add_env() {
  local KEY=$1
  local VALUE=$2
  
  # For NEXTAUTH_URL, override with production URL
  if [ "$KEY" == "NEXTAUTH_URL" ]; then
    VALUE="https://kontrakankoe.vercel.app"
  fi

  echo "Adding $KEY..."
  
  curl -s -X POST "https://api.vercel.com/v10/projects/$PROJECT_ID/env?upsert=true" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$(jq -n --arg k "$KEY" --arg v "$VALUE" '{
      key: $k,
      value: $v,
      type: "encrypted",
      target: ["production", "preview", "development"]
    }')" | grep -o '"key": *"[^"]*"' || echo "Failed $KEY"
}

# Read .env and parse
while IFS='=' read -r key value; do
  # skip empty lines or comments
  if [[ -n "$key" && "$key" != \#* ]]; then
    # strip quotes from value
    value=$(echo "$value" | sed -e 's/^"//' -e 's/"$//')
    add_env "$key" "$value"
  fi
done < .env
