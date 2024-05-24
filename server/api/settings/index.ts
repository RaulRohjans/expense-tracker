import { ensureAuth } from "@/utils/authFunctions"
import { db } from '@/utils/dbEngine'
import { UserSettingsObject } from "~/types/Settings"

export default defineEventHandler(async (event) => {
    const user = ensureAuth(event)
    
    // Build query to fetch user settings
    const query = await db.selectFrom('user_settings')
        .selectAll()
        .where('user', '=', user.id)
        .executeTakeFirst()

    if(!query)
        throw createError({
            statusCode: 500,
            statusMessage: 'Could not load user settings.'
        })
        
    return {
        success: true,
        data: query as UserSettingsObject
    }
})