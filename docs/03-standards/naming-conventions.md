# Naming Conventions

## Critical Rule: English Only in Code

**NEVER use Danish in:**
- File names
- Directory names
- Function names
- Variable names
- Class names
- Component names
- CSS class names
- Route paths
- Type/Interface names
- Constant names

**Danish is ONLY allowed in:**
- `app/locales/*.json` - Translation files
- User-facing text content
- Comments (when needed for context)
- Documentation markdown files (when explaining Danish concepts)

## Examples

### ❌ WRONG (Danish in code)
```typescript
// File: pages/ansog/kontaktoplysninger.vue
export const useAnsogStore = defineStore('ansog', {
  actions: {
    gemKladde() { }
    indsendAnsøgning() { }
  }
})

const formData = {
  fuldeNavn: '',
  telefon: '',
}
```

### ✅ CORRECT (English in code, Danish in translations)
```typescript
// File: pages/application/contact-info.vue
export const useApplicationStore = defineStore('application', {
  actions: {
    saveDraft() { }
    submitApplication() { }
  }
})

const formData = {
  fullName: '',
  phone: '',
}

// In template
<label>{{ $t('form.fullName') }}</label>
```

```json
// app/locales/da-DK.json
{
  "form": {
    "fullName": "Fulde navn",
    "phone": "Telefon"
  }
}
```

## File Naming Patterns

### Pages
- Use kebab-case for multi-word names
- English descriptive names
- Examples:
  - ✅ `contact-info.vue`
  - ✅ `event-info.vue`
  - ✅ `practical-safety.vue`
  - ❌ `kontaktoplysninger.vue`
  - ❌ `ansøgning.vue`

### Components
- Use PascalCase for component files
- English descriptive names
- Examples:
  - ✅ `MultiStepForm.vue`
  - ✅ `EventCard.vue`
  - ✅ `ApplicationWizard.vue`
  - ❌ `AnsoegFormular.vue`

### Stores
- Use kebab-case for file names
- English descriptive names
- Examples:
  - ✅ `event-form.ts`
  - ✅ `application-state.ts`
  - ❌ `ansog-store.ts`

### Types/Interfaces
- Use PascalCase for type names
- English descriptive names
- Examples:
  - ✅ `EventFormData`
  - ✅ `ApplicationStep`
  - ❌ `AnsoegningsData`

## Function & Variable Naming

### Functions
- Use camelCase
- English verb-based names
- Examples:
  - ✅ `saveAsDraft()`
  - ✅ `submitApplication()`
  - ✅ `validateContactInfo()`
  - ❌ `gemSomKladde()`
  - ❌ `indsendAnsøgning()`

### Variables
- Use camelCase
- English descriptive names
- Examples:
  - ✅ `isCommercial`
  - ✅ `fullName`
  - ✅ `eventTypeTag`
  - ❌ `erKommerciel`
  - ❌ `fuldeNavn`

### Constants
- Use UPPER_SNAKE_CASE
- English descriptive names
- Examples:
  - ✅ `MAX_FILE_SIZE_BYTES`
  - ✅ `DEFAULT_ATTENDANCE_RANGE`
  - ❌ `MAKS_FIL_STØRRELSE`

## Route Paths

### URL Structure
- Use English lowercase with hyphens
- Examples:
  - ✅ `/application/contact-info`
  - ✅ `/application/event-info`
  - ✅ `/admin/review`
  - ❌ `/ansog/kontaktoplysninger`
  - ❌ `/admin/gennemgang`

## CSS Class Names

### Naming Pattern
- Use English kebab-case
- BEM methodology where appropriate
- Examples:
  - ✅ `.step-contact-info`
  - ✅ `.form-field`
  - ✅ `.application-wizard__step--active`
  - ❌ `.trin-kontakt`
  - ❌ `.ansog-formular`

## Translation Keys

### Structure
- Use English keys with dot notation
- Values in Danish (or other languages)
- Examples:

```json
{
  "form": {
    "contactInfo": {
      "title": "Kontaktoplysninger",
      "fullName": "Fulde navn",
      "phone": "Telefon"
    },
    "eventInfo": {
      "title": "Eventoplysninger",
      "startDate": "Startdato"
    }
  }
}
```

## Database Schema

### Table & Column Names
- Use snake_case (as per Drizzle config)
- English names
- Examples:
  - ✅ `event_application`
  - ✅ `contact_person_name`
  - ❌ `ansøgning`
  - ❌ `kontakt_person_navn`

## API Endpoints

### tRPC Router Names
- Use camelCase for procedures
- English descriptive names
- Examples:
  - ✅ `events.create`
  - ✅ `events.saveDraft`
  - ✅ `admin.updateReviewStatus`
  - ❌ `begivenheder.opret`
  - ❌ `admin.opdaterStatus`

## Git Commit Messages

### Commit Message Language
- Write in English
- Use conventional commits format
- Examples:
  - ✅ `feat: add contact info step to application form`
  - ✅ `fix: validate phone number format`
  - ✅ `refactor: rename Danish files to English`
  - ❌ `feat: tilføj kontaktoplysninger trin`

## Why English Only?

1. **International Collaboration**: Code can be understood by developers worldwide
2. **Documentation**: Most programming resources and docs are in English
3. **Tooling**: Better IDE support, linting, and autocomplete
4. **Consistency**: Reduces confusion between Danish and English
5. **Best Practice**: Industry standard for codebases
6. **Maintenance**: Easier for future developers to understand
7. **Library Integration**: Matches naming conventions of frameworks/libraries

## Translation Workflow

When adding user-facing text:

1. **Never hardcode Danish in templates/components**
   ```vue
   <!-- ❌ WRONG -->
   <h1>Kontaktoplysninger</h1>
   
   <!-- ✅ CORRECT -->
   <h1>{{ $t('form.contactInfo.title') }}</h1>
   ```

2. **Add translation key to locales file**
   ```json
   {
     "form": {
       "contactInfo": {
         "title": "Kontaktoplysninger"
       }
     }
   }
   ```

3. **Use descriptive English keys**
   - Keys should be self-documenting
   - Use nested structure for organization

## Enforcement

### Pre-commit Checks
- Consider adding linting rules to catch Danish characters in file names
- Code review checklist to verify English-only naming

### IDE Settings
- Configure file templates with English placeholders
- Set up snippets with English naming patterns

## Migration Checklist

When renaming existing Danish code:

- [ ] Rename files and directories
- [ ] Update imports and references
- [ ] Rename functions and variables
- [ ] Update CSS class names
- [ ] Fix route paths
- [ ] Move hardcoded Danish text to translation files
- [ ] Update documentation
- [ ] Run tests to verify nothing broke
- [ ] Search codebase for remaining Danish terms

## Reference: Phase 2 Renaming

### Files Renamed
- `pages/ansog/` → `pages/application/`
- `ansog.vue` → `application.vue`
- `kontaktoplysninger.vue` → `contact-info.vue`
- `eventoplysninger.vue` → `event-info.vue`
- `praktiske-forhold.vue` → `practical-safety.vue`
- `tilladelser-drift.vue` → `permits-operations.vue`
- `opsummering.vue` → `summary.vue`

### Routes Updated
- `/ansog/*` → `/application/*`
- `/ansog/kontaktoplysninger` → `/application/contact-info`
- etc.

### Store Keys Updated
- `'kontaktoplysninger'` → `'contact-info'`
- `'eventoplysninger'` → `'event-info'`
- `'praktiske-forhold'` → `'practical-safety'`
- `'tilladelser-drift'` → `'permits-operations'`
- `'opsummering'` → `'summary'`

---

**Remember: Code in English, UI in Danish (via translations)**
