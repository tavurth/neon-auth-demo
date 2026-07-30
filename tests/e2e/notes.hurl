# List notes (may be empty)
GET {{base_url}}/api/notes
Authorization: Bearer {{token}}
HTTP 200
[Asserts]
jsonpath "$" isList

# Create note
POST {{base_url}}/api/notes
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "title": "Test Note"
}

HTTP 200
[Asserts]
jsonpath "$.id" exists
jsonpath "$.title" == "Test Note"

# List notes now has at least one
GET {{base_url}}/api/notes
Authorization: Bearer {{token}}
HTTP 200
[Asserts]
jsonpath "$[0].title" == "Test Note"
