import type { Selectable } from 'kysely'
import type { User } from 'kysely-codegen'
import { generateToken, validateJWT } from '@/utils/authFunctions'

export default defineEventHandler(async (event) => {
    const { refreshToken } = await readBody<{ refreshToken: string }>(event)

    if (!refreshToken)
        throw createError({
            statusCode: 400,
            statusMessage: 'No refreshToken provided in the payload.'
        })

    // Decode the refresh token
    const decoded = validateJWT(refreshToken)

    if (!decoded)
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid token provided.'
        })

    /*
     * This piece of code is not the ideal solution.
     * We want a User object without the JwtToken object properties
     * and there is no good way of doing this, the simplest solution of casting the
     * object to User will NOT remove the properties we don't want
     *
     * https://stackoverflow.com/questions/50378612/how-to-cast-object-to-another-type-and-remove-unneeded-fields-in-typescript
     */
    const jwtUser: Omit<Selectable<User>, 'password'> = {
        id: decoded.id,
        first_name: decoded.first_name,
        last_name: decoded.last_name,
        email: decoded.email,
        username: decoded.username,
        avatar: decoded.avatar,
        is_admin: decoded.is_admin,
        deleted: false
    }
    /* --------------------------------------------------- */

    const accessToken = generateToken(jwtUser)
    const newRefreshToken = generateToken(jwtUser, 60 * 60 * 24)

    return {
        token: {
            accessToken,
            newRefreshToken
        }
    }
})
