import axios from "axios";
import { getSyncQueue, clearSyncQueue } from "./db";


export const syncQueuedProduct = async (token: string) => {
    const queuedProducts = await getSyncQueue()
    if (queuedProducts.length === 0) return

    console.log('🔁 Synchronizacja produktów...', queuedProducts)

    try {
        for (const product of queuedProducts) {
            await axios.post('http://127.0.0.1:8000/api/products/', product, {
                headers: {Authorization: `Bearer ${token}`},
            })
        }
        await clearSyncQueue()
        console.log('✅ Synchronizacja zakończona.')
    } catch (err) {
        console.error('❌ Błąd synchronizacji:', err)
    }
}
