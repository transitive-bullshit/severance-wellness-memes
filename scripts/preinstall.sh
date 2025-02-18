#!/bin/bash
export COREPACK_ENABLE=0
export COREPACK_DISABLE_SIGNATURE_CHECK=1
corepack disable
npx only-allow pnpm
