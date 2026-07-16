import { ApId, ApMultipartFile, isNil } from '@activepieces/core-utils'
import { apDayjs } from '@activepieces/server-utils'
import {
    AP_MAXIMUM_PROFILE_PICTURE_SIZE,
    FileType,
    PrincipalType,
    PROFILE_PICTURE_ALLOWED_TYPES,
    SERVICE_KEY_SECURITY_OPENAPI,
    UpdateMeResponse,
    UserStatus,
    UserWithBadges,
} from '@activepieces/shared'
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'
import { userIdentityService } from '../../authentication/user-identity/user-identity-service'
import { securityAccess } from '../../core/security/authorization/fastify-security'
import { platformProjectService } from '../../ee/projects/platform-project-service'
import { fileService } from '../../file/file.service'
import { systemJobsSchedule } from '../../helper/system-jobs/system-job'
import { userService } from '../../user/user-service'
import { SystemJobName } from '../../helper/system-jobs/common'
import { userRepo } from '../../user/user-service'

export const usersController: FastifyPluginAsyncZod = async (app) => {
    app.get('/:id', GetUserByIdRequest, async (req): Promise<UserWithBadges> => {
        const userId = req.params.id
        const platformId = req.principal.platform.id
        return userService(req.log).getOneByIdAndPlatformIdOrThrow({
            id: userId,
            platformId,
        })
    })

    app.post('/me', UpdateMeRequest, async (req) => {
        const userId = req.principal.id
        const user = await userService(req.log).getOrThrow({ id: userId })
        const identityId = user.identityId
        const platformId = req.principal.platform.id

        const imageUrl = await fileService(app.log).uploadPublicAsset({
            file: req.body.profilePicture,
            type: FileType.USER_PROFILE_PICTURE,
            platformId,
            allowedMimeTypes: PROFILE_PICTURE_ALLOWED_TYPES,
            maxFileSizeInBytes: AP_MAXIMUM_PROFILE_PICTURE_SIZE,
            metadata: { identityId },
        })

        if (!isNil(imageUrl)) {
            await userIdentityService(app.log).update(identityId, {
                imageUrl,
            })
        }

        return userIdentityService(app.log).getBasicInformation(identityId)
    })

    app.delete('/me/profile-picture', DeleteProfilePictureRequest, async (req) => {
        const userId = req.principal.id
        const user = await userService(req.log).getOrThrow({ id: userId })
        const identityId = user.identityId

        await userIdentityService(app.log).update(identityId, {
            imageUrl: null,
        })

        return {
            success: true,
        }
    })

    app.delete('/me', DeleteMeRequest, async (req) => {
        const platformId = req.principal.platform.id

        const user = await userService(req.log).getOneOrFail({
            id: req.principal.id,
        })
        await userRepo().update(
            {
                id: user.id,
                platformId,
            },
            {
                status: UserStatus.INACTIVE,
            }
        )

        await platformProjectService(req.log).deletePersonalProjectForUser({
            userId: user.id,
            platformId,
        })

        await systemJobsSchedule(req.log).upsertJob({
            job: {
                name: SystemJobName.HARD_DELETE_USER,
                data: {
                    platformId,
                    userId: user.id,
                    identityId: user.identityId,
                },
                jobId: `hard-delete-user-${user.id}`,
            },
            schedule: {
                type: 'one-time',
                date: apDayjs(),
            },
            customConfig: {
                attempts: 25,
                backoff: {
                    type: 'fixed',
                    delay: 60000,
                },
            },
        })

        return {
            success: true,
        }
    })
}

const GetUserByIdRequest = {
    schema: {
        tags: ['users'],
        description: 'Get a user by id',
        security: [SERVICE_KEY_SECURITY_OPENAPI],
        params: z.object({
            id: ApId,
        }),
        response: {
            [StatusCodes.OK]: UserWithBadges,
        },
    },
    config: {
        security: securityAccess.publicPlatform([
            PrincipalType.USER,
            PrincipalType.SERVICE,
        ]),
    },
}

const UpdateMeRequest = {
    config: {
        security: securityAccess.publicPlatform([PrincipalType.USER]),
    },
    schema: {
        consumes: ['multipart/form-data'],
        body: z.object({
            profilePicture: z.optional(ApMultipartFile),
        }),
        response: {
            [StatusCodes.OK]: UpdateMeResponse,
        },
    },
}

const DeleteMeRequest = {
    schema: {
        response: {
            [StatusCodes.OK]: z.object({
                success: z.boolean(),
            }),
        },
    },
    config: {
        security: securityAccess.publicPlatform([PrincipalType.USER]),
    },
}

const DeleteProfilePictureRequest = {
    schema: {
        response: {
            [StatusCodes.OK]: z.object({
                success: z.boolean(),
            }),
        },
    },
    config: {
        security: securityAccess.publicPlatform([PrincipalType.USER]),
    },
}