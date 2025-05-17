import { openDB } from "idb";

export const initDB = async () => {
    return openDB('storage-app', 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains('products')) {
                db.createObjectStore('products', {
                    keyPath: 'id',
                    autoIncrement: true
                })
            }
            if (!db.objectStoreNames.contains('syncQueue')) {
                db.createObjectStore('syncQueue', {
                    keyPath: 'localId',
                    autoIncrement: true
                })
            }
        },
    })
}

export const addProductToLocalDb = async (product: any) => {
    const db = await initDB()
    await db.add('products', product)
}

export const getLocalProducts = async () => {
    const db = await initDB()
    return db.getAll('products')
}

export const clearLocalProducts = async () => {
    const db = await initDB()
    return db.clear('products')
}

export const queueForSync = async (product: any) => {
  const db = await initDB()
  await db.add('syncQueue', product)
}

export const getSyncQueue = async () => {
  const db = await initDB()
  return db.getAll('syncQueue')
}

export const clearSyncQueue = async () => {
  const db = await initDB()
  return db.clear('syncQueue')
}
