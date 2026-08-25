// Import necessary functions from the Firebase Firestore SDK.
// - collection: Gets a reference to a specific collection (folder) in your database.
// - getDocs: Retrieves multiple documents from a collection or query.
// - query: Creates a new query to filter or sort data.
// - where: Adds a filtering condition to a query.
// - addDoc: Adds a new document with an auto-generated ID.
// - doc: Gets a reference to a specific document by its ID.
// - updateDoc: Modifies existing fields in a document.
// - deleteDoc: Removes a document from the database.
import { 
    collection, 
    getDocs, 
    query, 
    where,
    addDoc,
    doc,
    updateDoc,
    deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Import the initialized Firebase database instance from your configuration file.
// This 'db' object is required to tell Firestore WHICH database we are trying to access.
import { db } from "./db_config.js";



/**
 * Retrieves all eyewear products from the database and sorts them.
 * This is an 'async' function because fetching data over the network takes time.
 * We use 'await' inside to pause the execution until the data is fully loaded.
 */
export async function getEyewearProducts() {
    try {
        // 1. Create a reference to the "eyewear" collection in your Firestore database.
        const eyewearCollectionRef = collection(db, "eyewear");

        // 2. Fetch all documents (items) inside that collection.
        // 'snapshot' contains the raw, unformatted data returned from Firebase.
        const snapshot = await getDocs(eyewearCollectionRef);

        // 3. Transform the raw snapshot into a clean JavaScript array.
        const products = snapshot.docs.map(productDoc => {
            // productDoc.data() gets the actual fields (name, price, image, etc.)
            // We use the spread operator (...) to expand those fields into a new object.
            // We also manually add the 'id' because Firestore stores the document ID separately from the data.
            return { id: productDoc.id, ...productDoc.data() };
        });

        // 4. Sort the products based on a 'sortOrder' field (if it exists).
        // If sortOrder is missing, it defaults to 0 using the logical OR (||) operator.
        // Returning a negative number puts 'first' before 'second'.
        return products.sort((first, second) => (first.sortOrder || 0) - (second.sortOrder || 0));

    } catch (error) {
        // If anything goes wrong (e.g., no internet, wrong permissions), log it to the console.
        console.error("Error fetching eyewear products: ", error);
        return []; // Return an empty array so the website doesn't crash
    }
}



/**
 * Retrieves eyewear products filtered by a specific category.
 * Useful for sections like "Women's Eyewear" in your HTML.
 * 
 * @param {string} categoryName - The name of the category to filter by (e.g., "Women Cat-Eye").
 */
export async function getEyewearByCategory(categoryName) {
    try {
        // 1. Reference the collection
        const eyewearCollectionRef = collection(db, "eyewear");

        // 2. Create a specialized query. 
        // This tells Firestore: "Only get documents where the 'category' field exactly matches the categoryName variable."
        const categoryQuery = query(eyewearCollectionRef, where("category", "==", categoryName));

        // 3. Execute the query using getDocs
        const snapshot = await getDocs(categoryQuery);

        // 4. Map the results into a clean array just like the previous function
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    } catch (error) {
        console.error(`Error fetching category ${categoryName}: `, error);
        return [];
    }
}



/**
 * Adds a brand new eyewear product to the database.
 * 
 * @param {Object} productData - An object containing the product details (name, price, etc.)
 * @returns {string|null} - Returns the newly generated unique ID, or null if it failed.
 */
export async function addEyewearProduct(productData) {
    try {
        const eyewearCollectionRef = collection(db, "eyewear");
        
        // addDoc automatically generates a highly unique, random ID for this new product.
        const newDocRef = await addDoc(eyewearCollectionRef, productData);
        
        console.log("New product added with ID: ", newDocRef.id);
        return newDocRef.id; 
    } catch (error) {
        console.error("Error adding product: ", error);
        return null;
    }
}

/**
 * Updates an existing eyewear product.
 * 
 * @param {string} productId - The unique ID of the document you want to change.
 * @param {Object} updatedFields - An object containing ONLY the fields you want to change (e.g., { price: 1500 })
 */
export async function updateEyewearProduct(productId, updatedFields) {
    try {
        // 1. Get a specific reference to the single document using its ID
        const productRef = doc(db, "eyewear", productId);

        // 2. Apply the updates. 
        // Note: updateDoc only changes the fields you pass in; it won't overwrite or delete other existing fields.
        await updateDoc(productRef, updatedFields);
        
        console.log(`Product ${productId} successfully updated.`);
        return true;
    } catch (error) {
        console.error("Error updating product: ", error);
        return false;
    }
}

/**
 * Deletes an eyewear product from the database permanently.
 * 
 * @param {string} productId - The unique ID of the document to delete.
 */
export async function deleteEyewearProduct(productId) {
    try {
        // 1. Reference the specific document
        const productRef = doc(db, "eyewear", productId);

        // 2. Delete it
        await deleteDoc(productRef);
        
        console.log(`Product ${productId} successfully deleted.`);
        return true;
    } catch (error) {
        console.error("Error deleting product: ", error);
        return false;
    }
}