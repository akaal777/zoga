import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "./db_config.js";

export async function getProducts() {
    const snapshot = await getDocs(collection(db, "watches"));

    return snapshot.docs
        .map(productDoc => ({ id: productDoc.id, ...productDoc.data() }))
        .sort((first, second) => (first.sortOrder || 0) - (second.sortOrder || 0));
}
