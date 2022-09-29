域名: monitor.wushuang5112.gq
Global API Key: 你的Global API Key
Email: xsx900101@gmail.com
Zone ID: 你的Zone ID
Record ID: 你的Record ID

curl -X GET "https://api.cloudflare.com/client/v4/zones" \-H "Content-Type: application/json" \-H "X-Auth-Key: $API_KEY" \  -H "X-Auth-Email: $EMAIL"


curl -X GET "https://api.cloudflare.com/client/v4/zones" \-H "Content-Type: application/json" \-H "X-Auth-Key: 你的Global API Key" \  -H "X-Auth-Email: xsx900101@gmail.com"

curl -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \     -H "Content-Type: application/json" \     -H "X-Auth-Key:$API_KEY" \     -H "X-Auth-Email:$EMAIL"

curl -X GET "https://api.cloudflare.com/client/v4/zones/你的Zone ID/dns_records" \     -H "Content-Type: application/json" \     -H "X-Auth-Key:你的Global API Key" \     -H "X-Auth-Email:xsx900101@gmail.com"



curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/$CFZONE_ID/dns_records/$CFRECORD_ID" -H "X-Auth-Email: $CFUSER" -H "X-Auth-Key: $CFKEY" -H "Content-Type: application/json" --data "{\"id\":\"$CFZONE_ID\",\"type\":\"$CFRECORD_TYPE\",\"name\":\"$CFRECORD_NAME\",\"content\":\"$WAN_IP\", \"ttl\":$CFTTL}"

curl -s -X PUT "https://api.cloudflare.com/client/v4/zones/你的Zone ID/dns_records/你的Record ID" -H "X-Auth-Email: xsx900101@gmail.com" -H "X-Auth-Key: 你的Global API Key" -H "Content-Type: application/json" --data "{\"id\":\"你的Zone ID\",\"type\":\"$CFRECORD_TYPE\",\"name\":\"$CFRECORD_NAME\",\"content\":\"192.168.1.1\", \"ttl\":$CFTTL}"