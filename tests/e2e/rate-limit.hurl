# Rate limiting is applied

# Verify rate limit headers are present on any endpoint
GET {{base_url}}/api/notes
Authorization: Bearer {{token}}
HTTP 200

[Asserts]
header "X-RateLimit-Limit" exists
header "X-RateLimit-Remaining" exists
header "X-RateLimit-Reset" exists
