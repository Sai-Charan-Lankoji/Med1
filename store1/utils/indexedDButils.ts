

export const initIndexedDB = () => {
    const request = indexedDB.open("CanvasAppDB", 1);

    request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("actions")) {
            db.createObjectStore("actions", { keyPath: "id" });
        }
    };

    return request;
};

export const saveStackToDB = (stackName: string, stackData: any[]) => {
    const request = initIndexedDB();

    request.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction(["actions"], "readwrite");
        const store = transaction.objectStore("actions");

        const stackObject = { id: stackName, data: stackData };
        store.put(stackObject);
    };
};

export const getStackFromDB = (stackName: string, callback: (data: any[]) => void) => {
    const request = initIndexedDB();

    request.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction(["actions"], "readonly");
        const store = transaction.objectStore("actions");

        const getRequest = store.get(stackName);

        getRequest.onsuccess = () => {
            callback(getRequest.result?.data || []);
        };
    };
};

export const clearStackFromDB = (stackName: string) => {
    const request = initIndexedDB();

    request.onsuccess = (event: any) => {
        const db = event.target.result;
        const transaction = db.transaction(["actions"], "readwrite");
        const store = transaction.objectStore("actions");

        store.delete(stackName);
    };
};
