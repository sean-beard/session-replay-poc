// IndexedDB helper for session replay storage
const DB_NAME = "SessionReplayDB";
const STORE_NAME = "sessions";
const DB_VERSION = 1;

/**
 * Initialize and open the IndexedDB database
 * @returns {Promise<IDBDatabase>}
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, {
          keyPath: "id",
          autoIncrement: true,
        });

        // Create indexes for querying
        objectStore.createIndex("timestamp", "timestamp", { unique: false });
        objectStore.createIndex("duration", "duration", { unique: false });
      }
    };
  });
}

/**
 * Save a session to IndexedDB
 * @param {Object} session - Session data
 * @param {Array} session.events - Array of rrweb events
 * @param {number} session.timestamp - Session start timestamp
 * @param {number} session.duration - Session duration in ms
 * @param {string} session.name - Session name
 * @returns {Promise<number>} - The ID of the saved session
 */
async function saveSession(session) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const objectStore = transaction.objectStore(STORE_NAME);

    const sessionData = {
      name: session.name || `Session ${new Date().toLocaleString()}`,
      eventCount: session.events.length,
      timestamp: session.timestamp || Date.now(),
      duration: session.duration || 0,
      events: session.events,
    };

    const request = objectStore.add(sessionData);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
  });
}

/**
 * Get all sessions from IndexedDB
 * @returns {Promise<Array>} - Array of all sessions
 */
async function getAllSessions() {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
  });
}

/**
 * Get a specific session by ID
 * @param {number} id - Session ID
 * @returns {Promise<Object>} - Session data
 */
async function getSession(id) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readonly");
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
  });
}

/**
 * Delete a session by ID
 * @param {number} id - Session ID
 * @returns {Promise<void>}
 */
async function deleteSession(id) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
  });
}

/**
 * Update an existing session
 * @param {number} id - Session ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
async function updateSession(id, updates) {
  const db = await openDB();

  return new Promise(async (resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const objectStore = transaction.objectStore(STORE_NAME);

    // Get existing session
    const getRequest = objectStore.get(id);

    getRequest.onsuccess = () => {
      const session = getRequest.result;
      if (!session) {
        reject(new Error("Session not found"));
        return;
      }

      // Update with new data
      const updatedSession = { ...session, ...updates };
      const updateRequest = objectStore.put(updatedSession);

      updateRequest.onsuccess = () => resolve();
      updateRequest.onerror = () => reject(updateRequest.error);
    };

    getRequest.onerror = () => reject(getRequest.error);

    transaction.oncomplete = () => db.close();
  });
}

/**
 * Clear all sessions
 * @returns {Promise<void>}
 */
async function clearAllSessions() {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const objectStore = transaction.objectStore(STORE_NAME);
    const request = objectStore.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
  });
}
