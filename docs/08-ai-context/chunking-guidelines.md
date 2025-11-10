---
title: Chunkingretningslinjer / Chunking Guidelines
slug: chunking-guidelines
version: 0.1.0
status: draft
lastUpdated: 2025-11-10
audience: [ai]
owners: [platform-team]
tags: [chunking, rag]
summary: Recommended strategy for splitting project docs into retrieval chunks.
i18n:
  defaultLocale: da-DK
  keysNamespace: docs.ai.chunking
---

# Chunking Guidelines

Mål: Optimere kontekstlevering til AI (RAG) med semantisk men stabile chunk-grænser.

## Grundprincipper
- Max 800 tokens per chunk (ca. 6-8 KB tekst) for gpt-5 kontekstbalance
- Bevar YAML frontmatter som eget chunk (metadata) – ikke bland med brødtekst
- Split kun ved logiske overskrifter (H2/H3) – undgå midt i lister
- Kombinér små sektioner (<150 tokens) med nærliggende for at undgå for små chunks
- Indsæt "CHUNK_START" og "CHUNK_END" markører ved behov (kun i indeks, ikke i filerne)

## Udeladelser
- Store kodeblokke >200 linjer: overvej separat reference-chunk
- Tabeller >40 rækker: split per tema

## Metadatainkludering
Hvert chunk i `retrieval-index.json` bør indeholde:
```json
{
  "slug": "code-style#naming",
  "source": "docs/03-standards/code-style.md",
  "title": "Kodestandard / Code Style and Conventions",
  "section": "Naming Conventions",
  "tags": ["style","naming"],
  "summary": "Naming rules for variables, functions, classes and files.",
  "lang": "da-DK"
}
```

## Heuristikker / Heuristics
1. Overskrift med < 50 tokens efterfølges af kort liste -> sammenføres
2. Hvis sektion > 900 tokens -> find naturlig underoverskrift til split
3. Yaml frontmatter -> altid eget chunk med tag `meta`
4. Sikkerhedsrelaterede sektioner får `security` tag

## Eksempel Split (Best Practices)
- Testing Requirements (mid-size) -> eget chunk
- Security Considerations + Error Handling (hver for sig)
- Performance Guidelines -> hvis >800 tokens: split på underpunkter (database / caching / bundle)

## Kvalitetssikring
- Kontroller at ingen chunk overlapper tekst (ingen duplikeret sætninger)
- Sørg for at summaries er 1 sætning, aktiv form, ingen marketing
- Validér JSON mod schema (fremtidigt) før deployment

## Fremtidige forbedringer
- Automatisk parser til heading-baseret chunking
- Token-baseret reduktion med semantisk scoring (embeddings) for over-lange sektioner
- Versionfelt pr. chunk for diff-baseret opdatering

Disse retningslinjer kan tilpasses efter empirisk evaluering af svar-kvalitet.
