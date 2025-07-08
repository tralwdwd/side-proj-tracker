export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        let db = await import("@/lib/db")
        await db.initDB()
    }
}