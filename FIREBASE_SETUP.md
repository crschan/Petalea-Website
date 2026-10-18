# Firebase setup

The store and admin dashboard use Firebase Authentication and Cloud Firestore. They do not fall back to mock data: configure Firebase before deploying the site.

1. Create a Firebase project and register a web app. Copy its web app settings into `firebaseConfig` in `data.js`.
2. In **Authentication → Sign-in method**, enable **Email/Password**, then create the account you will use to sign in.
3. Give that account the `admin: true` custom claim using the Firebase Admin SDK in a trusted server-side environment (for example, `setCustomUserClaims(uid, { admin: true })`). Never put Admin SDK credentials or claim-setting code in this website. The dashboard rejects accounts without this claim.
4. In the admin dashboard, add bouquet products and the individual flower options customers can select for custom bouquets. Put each image in the project's `assets/` folder and enter its relative path (for example, `assets/pink-rose.png`) with its price. Flower prices are shown per flower; the final custom bouquet price is quoted after review.
5. Add customer photos to `assets/`, then publish their display name and feedback from the **Customer Stories** panel. Confirm the customer gave permission before publishing their photo and feedback. Use a first name, nickname, or generic attribution if they prefer not to be identified.
6. In **Firestore Database → Rules**, publish the rules from `firestore.rules`. They allow public product, flower, and testimonial reads and anonymous order and custom-request submissions, while limiting catalog changes, testimonial publishing, and customer data access to accounts with the admin claim.
7. Ready-made checkout and custom requests collect the customer's name, phone, email, Facebook name, preferred Cash or GCash payment method, and pickup or delivery choice. Delivery requires an address; its fee is marked for a quote and is not included in the bouquet subtotal. Confirm the delivery fee with the customer before collecting payment.
8. Serve the site over HTTP (for example, with your hosting provider or a local static server) and test a product listing, checkout, custom flower selection, custom request, customer story, and admin sign-in.

Firebase web app settings are intended to be used in browser applications; they are not a substitute for Firestore Security Rules. Do not deploy with permissive database rules.
