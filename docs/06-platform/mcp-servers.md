---
title: MCP-servere / Model Context Protocol Setup
slug: mcp-servers
version: 1.0.0
status: stable
lastUpdated: 2025-11-10
audience: [developers, ai]
owners: [platform-team]
tags: [mcp, tooling, docs]
summary: Overview of configured MCP servers and how to use them within the workspace.
i18n:
  defaultLocale: da-DK
  keysNamespace: docs.platform.mcpServers
---

# MCP Server Configuration for Frederiksberg Events

This project uses Model Context Protocol (MCP) servers to provide enhanced documentation and context for various technologies.

## Configured MCP Servers

The following MCP servers are configured in `.vscode/mcp-servers.json`:

### Core Framework & Language

- **Nuxt 4**: Framework documentation and best practices
- **Vue 3**: Vue framework and Composition API
- **TypeScript**: Language server and type system

### Database & Validation

- **Drizzle ORM**: TypeScript database toolkit and ORM
- **PostgreSQL**: Database documentation
- **Zod**: Schema validation library

### State Management

- **Pinia**: State management for Vue/Nuxt

## Available via Context7

The following libraries are accessible through Context7 MCP server (configured in `.vscode/settings.json`):

- **Nuxt 4** - Full framework documentation
- **Drizzle ORM** - Complete ORM guide
- **Better-auth** - Authentication library docs
- **tRPC** - Type-safe API documentation
- **Zod** - Schema validation
- **Pinia** - State management
- **VueUse** - Composition utilities
- **SendGrid** - Email service API

## How to Use

### With GitHub Copilot Chat

In Copilot Chat, you can ask questions and the MCP servers will provide context:

```
How do I create a new tRPC procedure in Nuxt 4?
Show me how to define a Drizzle schema for PostgreSQL
How to validate form data with Zod?
```

### Context7 Usage

To get documentation for specific libraries:

1. Ask about a library in Copilot Chat
2. The Context7 server will fetch relevant documentation
3. Examples: "Show Nuxt 4 server routes", "Drizzle migrations guide"

## Configuration Files

- `.vscode/settings.json` - VS Code workspace settings with MCP enabled
- `.vscode/mcp-servers.json` - MCP server definitions (if needed for future custom servers)

## Note

Most MCP servers are automatically resolved through the Context7 server, which provides up-to-date documentation for popular libraries. The configuration in `settings.json` enables this functionality.

## Libraries Covered

### Framework

- Nuxt 4 (Full-stack meta-framework)
- Vue 3 (Frontend framework)

### Database

- PostgreSQL (Database)
- Drizzle ORM (TypeScript ORM)
- pg (PostgreSQL client)

### Validation & Types

- TypeScript (Type system)
- Zod (Schema validation)

### State & Auth

- Pinia (State management)
- Better-auth (Authentication)

### API & Utilities

- tRPC (Type-safe APIs)
- VueUse (Vue composables)
- SendGrid (Email service)

## Troubleshooting

If MCP servers aren't working:

1. Ensure you have the latest version of VS Code
2. Check that GitHub Copilot extension is installed and active
3. Reload VS Code window (Cmd+Shift+P → "Reload Window")
4. Check VS Code output panel for MCP server logs
