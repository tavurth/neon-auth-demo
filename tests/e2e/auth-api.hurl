# Auth API responds (returns null session when not authenticated)
# If this fails with 404, check that NEON_AUTH_BASE_URL points to a valid Neon Auth project.

GET {{base_url}}/api/auth/get-session
HTTP 200
