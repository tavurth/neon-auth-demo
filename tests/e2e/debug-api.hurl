# Notes API with ?debug=1 - returns [data, debug] array
# Test debug format on unauthenticated response
GET {{base_url}}/api/notes?debug=1
HTTP 401
[Asserts]
jsonpath "$" isList
jsonpath "$[1].__debug" exists
jsonpath "$[1].__hint" exists
jsonpath "$[0].code" == "UNAUTHORIZED"
