import { db, auth } from './firebase';
import { 
  collection, 
  addDoc, 
  updateDoc,
  deleteDoc,
  doc, 
  getDocs, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { encrypt, decrypt } from './encryption';

const ENTRIES_COLLECTION = 'journal_entries';

// Add new entry
export const addEntry = async (entryData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const encryptedContent = encrypt(entryData.content);
    
    const docRef = await addDoc(collection(db, ENTRIES_COLLECTION), {
      userId: user.uid,
      content: encryptedContent,
      summarized: entryData.summarized || false,
      summary: entryData.summary ? encrypt(entryData.summary) : null,
      category: entryData.category || null,
      mood: entryData.mood || null,
      clarifications: entryData.clarifications || [],
      dismissedQuestions: entryData.dismissedQuestions || [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { id: docRef.id, ...entryData };
  } catch (error) {
    console.error('Error adding entry:', error);
    throw error;
  }
};

// Get all entries for current user
export const getEntries = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const q = query(
      collection(db, ENTRIES_COLLECTION),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        content: decrypt(data.content),
        summary: data.summary ? decrypt(data.summary) : null,
        timestamp: data.createdAt?.toDate().toISOString() || new Date().toISOString()
      };
    });
  } catch (error) {
    console.error('Error getting entries:', error);
    throw error;
  }
};

// Update entry
export const updateEntry = async (entryId, updates) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const docRef = doc(db, ENTRIES_COLLECTION, entryId);
    
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    };

    // Encrypt content fields if present
    if (updates.content) {
      updateData.content = encrypt(updates.content);
    }
    if (updates.summary) {
      updateData.summary = encrypt(updates.summary);
    }

    await updateDoc(docRef, updateData);
    return { id: entryId, ...updates };
  } catch (error) {
    console.error('Error updating entry:', error);
    throw error;
  }
};

// Delete entry
export const deleteEntry = async (entryId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const docRef = doc(db, ENTRIES_COLLECTION, entryId);
    await deleteDoc(docRef);
    return entryId;
  } catch (error) {
    console.error('Error deleting entry:', error);
    throw error;
  }
};