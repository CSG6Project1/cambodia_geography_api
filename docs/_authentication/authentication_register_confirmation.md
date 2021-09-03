---
title: /confirmation
position_number: 3.0
type: post
description: Confirm your email
parameters:
content_markdown: |-
  This will send a mail to email to verify it.
headers:
  - name: Authorization
    content: Bearer {{ACCESS_TOKEN}}
left_code_blocks:
  - code_block:
    title: Body
    language: javascript
right_code_blocks:
  - code_block: |-
      {
        "message": "Message sent",
        "expires_in": "30"
      }
    title: Response
    language: json
  - code_block: |-
      {
        "message": "JWT expired"
      }
    title: Error
    language: json
---


