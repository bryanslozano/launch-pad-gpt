# Deployment Notes

## Firebase Authentication Domain Authorization

When deploying this application to a production environment, remember to add your production domain to the list of authorized domains in your Firebase project. This ensures that users can sign in from your deployed application.

Steps:
1. Go to the Firebase Console (https://console.firebase.google.com/).
2. Select your project.
3. Go to Authentication > Settings.
4. Scroll to the "Authorized domains" section.
5. Click "Add domain" and add your production domain (e.g., yourcustomgptchat.com).
6. Click "Add" to save the new domain.

Failure to add your production domain will result in authentication errors when users try to sign in.