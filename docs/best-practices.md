# Best Practices

## Testing Requirements

- Write unit tests for critical parts of the application
- Use Vue Test Utils and Vitest for component and unit testing
- Test all API endpoints and server routes
- Mock external dependencies (database, authentication, email service)
- Test edge cases, error conditions, and validation logic
- Ensure drag-and-drop functionality works correctly with interaction tests
- Test role-based access control (user vs. admin permissions)
- Validate Zod schemas with comprehensive test cases

## Documentation

- Add JSDoc/docstrings for all public APIs
- Update README.md when adding new features
- Document complex algorithms and business logic
- Keep inline comments concise and meaningful

## Security Considerations

- **Never commit sensitive data**: API keys, passwords, tokens, database credentials
- **Environment Variables**: Use `.env` files for all configuration (managed by dotenv)
- **Input Validation**: Validate and sanitize all user inputs using Zod schemas
- **Authentication**: Secure MitID authentication flow with proper session handling
- **Authorization**: Implement role-based access control (user vs. admin)
- **OWASP Best Practices**: Follow OWASP top 10 security guidelines
- **Error Handling**: Never expose sensitive information in error messages
- **SQL Injection**: Use Drizzle ORM's parameterized queries (never raw SQL with user input)
- **XSS Protection**: Sanitize user-generated content before rendering
- **CSRF Protection**: Implement CSRF tokens for state-changing operations
- **Rate Limiting**: Apply rate limiting to API endpoints to prevent abuse

## Error Handling

- Use try-catch blocks for operations that may fail
- Provide meaningful error messages
- Log errors appropriately
- Never swallow exceptions silently
- Return user-friendly error responses

## Performance Guidelines

- **Database Optimization**: Write efficient Drizzle ORM queries with proper indexing
- **Pagination**: Implement pagination and filtering for large datasets
- **Lazy Loading**: Use lazy loading for components and routes
- **Image Optimization**: Optimize static map images in `public/` directory
- **Caching**: Implement caching strategies for frequently accessed data
- **Bundle Size**: Monitor and minimize JavaScript bundle size
- **SSR Optimization**: Leverage Nuxt's server-side rendering for better initial load
- **Grid Performance**: Optimize custom grid rendering for smooth drag-and-drop interactions
- **Debouncing**: Use debouncing/throttling for frequent events (drag, resize, input)
- **Code Splitting**: Utilize Nuxt's automatic code splitting capabilities

## Accessibility Guidelines

- **WCAG 2.1 Compliance**: Follow all WCAG 2.1 Level AA guidelines
- **Responsive Design**: Application must work on all screen sizes (desktop, tablet, mobile)
- **Mobile Support**: All features available in mobile view, including map planner
- **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
- **Screen Reader Support**: Use proper ARIA labels and semantic HTML
- **Color Contrast**: Maintain sufficient contrast ratios for text and UI elements
- **Focus Indicators**: Clear visual focus states for all interactive elements
- **Touch Targets**: Minimum 44x44px touch targets for mobile devices

## Internationalization (i18n)

- **Default Language**: Danish (da-DK)
- **Multi-language Support**: Use Vue I18n for all user-facing text
- **Translation Keys**: Organize by feature/component in locale files
- **Date Format**: dd/MM-YYYY - HH:mm (Danish standard)
- **Currency Format**: DKK 20.000,00 (Danish kroner with thousand separator)
- **Timezone**: Europe/Copenhagen (Danish timezone)
- **Number Format**: Use comma for decimals, period for thousands (Danish convention)
- **Language Switching**: Support runtime language switching (if multiple languages added)
- **Fallback**: Always provide fallback to Danish if translation missing

## Don't Do

- **Don't use deprecated APIs** or outdated libraries
- **Don't use Vue 2 or Options API**: Always use Vue 3 Composition API with `<script setup>`
- **Don't manually import** components or composables (Nuxt auto-imports them)
- **Don't use `var`**: Always use `const` or `let`
- **Don't ignore TypeScript errors**: Fix all type errors before committing
- **Don't ignore ESLint/Prettier warnings**: Keep code formatted and linted
- **Don't commit secrets**: Never commit API keys, tokens, or credentials
- **Don't write raw SQL**: Use Drizzle ORM for database queries
- **Don't skip validation**: Always validate user input with Zod
- **Don't create god components**: Keep components small and focused
- **Don't copy-paste code**: Understand and adapt code to the context
- **Don't skip error handling**: Always handle errors properly
- **Don't hardcode values**: Use environment variables for configuration
- **Don't violate single responsibility**: Each function/component should do one thing
- **Don't introduce unnecessary dependencies**: Evaluate before adding new packages
- **Don't hardcode text**: Use Vue I18n for all user-facing text (internationalization)
- **Don't skip accessibility**: Ensure WCAG 2.1 compliance for all features
- **Don't implement auto-save**: Save only on user action ("Save as Draft" or "Next" button)
- **Don't allow event deletion**: Only status changes (decline, not delete) in v1
