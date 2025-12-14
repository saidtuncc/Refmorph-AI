# Refmorph-AI

> Full-stack (monorepo) project: Python backend + TypeScript web frontend.

## Project Status (WIP)
This repository is **work in progress** and currently **incomplete**.
Some flows are partially implemented; setup steps and interfaces may change as development continues.

## Repository Structure
- `adapt-backend/` — Backend service (Python) 
- `refmorph-web/` — Web frontend (TypeScript) 

## High-Level Architecture
- Frontend (`refmorph-web`) communicates with the backend (`adapt-backend`) over HTTP (API).
- Backend is responsible for business logic, data processing, and integration points (to be finalized).

> Note: Exact framework details (e.g., FastAPI/Flask, React/Vite/Next.js) should be reflected here once stabilized.

---

## Getting Started (Local Development)

### Prerequisites
- Node.js (LTS recommended)
- Python 3.10+ (recommended)
- Git

### 1) Clone
```bash
git clone https://github.com/saidtuncc/Refmorph-AI.git
cd Refmorph-AI
