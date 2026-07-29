# App loads and redirects to dashboard

GET {{base_url}}/
HTTP 307

# Dashboard redirects to auth when not logged in
GET {{base_url}}/dashboard
HTTP 307

# Auth sign-in page loads
GET {{base_url}}/auth/sign-in
HTTP 200
[Asserts]
body contains "Sign in"
