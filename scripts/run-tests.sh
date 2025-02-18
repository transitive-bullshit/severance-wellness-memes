#!/bin/bash
env COREPACK_DISABLE_SIGNATURE_CHECK=1 COREPACK_ENABLE=0 node ./node_modules/vitest/vitest.mjs run