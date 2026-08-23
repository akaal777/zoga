# Zoga

Static product pages powered by Firebase Authentication and Cloud Firestore.

## Firestore product setup

The product collection is read by `watch.html` from Firestore collection `products`.
Create one document per product. Each document should use this shape:

```json
{
	"name": "Forest Tiger Skeleton",
	"category": "Forest Timepieces",
	"price": 1500,
	"badge": "Bestseller",
	"images": ["boys watches/Forest2.PNG", "boys watches/Forest3.PNG"],
	"variants": ["Gold", "Silver"],
	"sortOrder": 1
}
```

`id` is taken from the Firestore document ID. `sortOrder` is optional and controls display order.
The page falls back to `products.json` if Firestore is unavailable, so the static catalog remains usable during setup.

## Module structure

- `db_config.js` initializes Firebase and exports `app`, `auth`, and `db`.
- `db_operations.js` contains Firestore product reads and exposes the product promise used by `watch.html`.
- `auth_operations.js` contains sign-in, sign-up, sign-out, and authentication UI behavior.
- `watch.html` owns product rendering and page interactions only.

## Firebase setup

1. In the Firebase console for the configured project, create a Cloud Firestore database.
2. Add the `products` documents using the shape above.
3. Publish Firestore rules that allow public reads only if that is appropriate for the catalog. Keep writes restricted to administrators.
4. Serve this folder through a local web server or Firebase Hosting. Opening an HTML file directly can block module and JSON requests in the browser.