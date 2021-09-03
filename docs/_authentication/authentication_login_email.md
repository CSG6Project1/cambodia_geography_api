---
title: /user/token
position_number: 1
type: post
description: Login with Email & Password
parameters:
content_markdown: |-
left_code_blocks:
  - code_block: |-
      {
        "grant_type": "password",
        "email": "jekyll@gmail.com",
        "password": "jek123"
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
        "message": "grant_type not found"
      }
    title: Error
    language: json
---


