# FLOW for admin users managing event applications

1. Admin login via AD (OIDC authentication) on /admin route
2. After login admin is redirected to the admin dashboard with list of "All Events" ( sorted by newest submitted on top )
3. Admin can click on any event to view details and edit the event application
4. Admin can assign the event to any department ( Byliv og drift /  Klima og miljø / Byggeri og arkitektur ) , Byliv og drift is default and cannot be removed
5. Admin for each department can review and change the status for their part of the event application
6. Admin can upload 1 or more PDF approval documents when accepting the event application
7. Admin must write a note when declining the event application, user is notified by email
