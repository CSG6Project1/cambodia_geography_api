---
title: /user/token
position_number: 1.3
type: post
description: ReAuthentication
parameters:
content_markdown: |-
left_code_blocks:
  - code_block: |-
      {
          "grant_type": "refresh_token",
          "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
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
          "message": "Invalid Token"
      }
    title: Error
    language: json
---


