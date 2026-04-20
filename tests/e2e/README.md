# Tests E2E

Los tests E2E se ejecutan directamente con el **MCP de Playwright** desde el agente,
no con `playwright test` local. El flujo para cada escenario es:

1. Iniciar el servidor de desarrollo: `npm run dev` (puerto 5173).
2. Invocar las tools `mcp__playwright__*` (navigate, click, fill, snapshot, take_screenshot).
3. Validar el comportamiento y reportar en lenguaje natural.

Los casos mínimos (ver PLAN.MD §Testing) están definidos como pasos en `scenarios.md`.
