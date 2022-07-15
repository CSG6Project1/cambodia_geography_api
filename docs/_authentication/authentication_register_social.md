---
title: /user/register
position_number: 2.1
type: post
description: Register with Social
parameters:
content_markdown: |-
left_code_blocks:
  - code_block: |-
      {
          "grant_type": "credential",
          "username": "Social user",
          "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjM2NGU4NTQ1NzI5O"
      }
    title: Body
    language: javascript
right_code_blocks:
  - code_block: |-
      {
        "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.",
        "token_type": "Bearer",
        "expires_in": 7200,
        "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.",
        "created_at": 1630642616689
      }
    title: Response
    language: json
  - code_block: |-
      {
          "message": "Account is already existed"
      }
    title: Error
    language: json
---


