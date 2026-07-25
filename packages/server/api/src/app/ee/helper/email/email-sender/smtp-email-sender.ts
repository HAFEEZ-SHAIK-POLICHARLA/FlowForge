import { readFile } from 'node:fs/promises'
import { ActivepiecesError, ErrorCode, isNil } from '@activepieces/core-utils'
import { ApEdition, ApEnvironment, PlatformWithoutFederatedAuth } from '@activepieces/shared'
import axios from 'axios'
import { FastifyBaseLogger } from 'fastify'
import Mustache from 'mustache'
import { defaultTheme } from '../../../../flags/theme'
import { system } from '../../../../helper/system/system'
import { AppSystemProp } from '../../../../helper/system/system-props'
import { platformService } from '../../../../platform/platform.service'
import { EmailSender, EmailTemplateData } from './email-sender'

const smtpEmailSender = (log: FastifyBaseLogger): SMTPEmailSender => {
    return {
        async validateOrThrow() {
            if (system.getOrThrow(AppSystemProp.ENVIRONMENT) !== ApEnvironment.PRODUCTION) {
                return
            }
            const brevoApiKey = system.get(AppSystemProp.BREVO_API_KEY)
            if (isNil(brevoApiKey)) {
                throw new ActivepiecesError({
                    code: ErrorCode.INVALID_SMTP_CREDENTIALS,
                    params: { message: 'Brevo API key is missing' },
                })
            }
        },
        async send({ emails, platformId, templateData }) {
            try {
                const platform = await getPlatform(platformId, log)
                const emailSubject = getEmailSubject(templateData.name, templateData.vars)
                const senderName = system.get(AppSystemProp.SMTP_SENDER_NAME)
                const senderEmail = system.get(AppSystemProp.SMTP_SENDER_EMAIL)
    
                const apiKey = system.get(AppSystemProp.BREVO_API_KEY)
                if (isNil(apiKey)) {
                    log.error({ emailSubject }, '[smtpEmailSender#send] Brevo API is not configured')
                    return
                }
    
                const emailBody = await renderEmailBody({
                    platform,
                    templateData,
                })
    
                log.info({
                    emails,
                    platform: { id: platformId },
                    templateData,
                }, '[smtpEmailSender#send] sending email')

                await axios.post('https://api.brevo.com/v3/smtp/email', {
                    sender: {
                        name: senderName,
                        email: senderEmail,
                    },
                    to: emails.map(email => ({ email })),
                    subject: emailSubject,
                    htmlContent: emailBody,
                }, {
                    headers: {
                        'api-key': apiKey,
                        'content-type': 'application/json',
                        'accept': 'application/json',
                    },
                })
            }
            catch (e) {
                log.error({
                    error: e,
                    brevo: axios.isAxiosError(e) ? e.response?.data : undefined,
                    emails,
                    platform: { id: platformId },
                    title: templateData.name,
                }, '[smtpEmailSender#send] error sending email')
                throw e
            }
        },

        isSmtpConfigured(): boolean {
            return !isNil(system.get(AppSystemProp.BREVO_API_KEY))
        },
    }
}

const getPlatform = async (platformId: string | undefined, log: FastifyBaseLogger): Promise<PlatformWithoutFederatedAuth | null> => {
    return platformId ? platformService(log).getOne(platformId) : null
}

const renderEmailBody = async ({ platform, templateData }: RenderEmailBodyArgs): Promise<string> => {
    const templatePath = `packages/server/api/src/assets/emails/${templateData.name}.html`
    const footerPath = 'packages/server/api/src/assets/emails/footer.html'
    const template = await readFile(templatePath, 'utf-8')
    const footer = await readFile(footerPath, 'utf-8')
    const edition = system.getEdition()
    const primaryColor = platform?.primaryColor ?? defaultTheme.colors.primary.default
    const primaryColorLight = hexToLightTint({ hex: primaryColor, opacity: 0.08 })
    const fullLogoUrl = platform?.fullLogoUrl ?? defaultTheme.logos.fullLogoUrl
    const platformName = platform?.name ?? defaultTheme.websiteName

    return Mustache.render(template, {
        ...templateData.vars,
        primaryColor,
        primaryColorLight,
        fullLogoUrl,
        platformName,
        footerContent: edition === ApEdition.CLOUD ? 'Activepieces, Inc. 398 11th Street, 2nd floor, San Francisco, CA 94103' : '',
    },
    {
        footer,
    },
    )
}

const getEmailSubject = (templateName: EmailTemplateData['name'], vars: Record<string, string>): string => {
    const templateToSubject: Record<EmailTemplateData['name'], string> = {
        'invitation-email': `You have been invited to "${vars.projectName}" project ✉️`,
        'project-member-added': `Welcome to ${vars.projectName} 🎉`,
        'badge-awarded': 'Congratulations, you earned a new badge! 🎉',
        'verify-email': 'Verify your email address ✅',
        'reset-password': 'Reset your password 🔑',
        'issue-created': `[${vars.projectName}] Flow has an issue "${vars.flowName}" ⚠️`,
        'scim-user-welcome': 'Welcome! Your account has been created 🎉',
    }

    return templateToSubject[templateName]
}

const hexToLightTint = ({ hex, opacity }: { hex: string, opacity: number }): string => {
    let raw = hex.replace('#', '')
    if (raw.length === 3) {
        raw = raw[0] + raw[0] + raw[1] + raw[1] + raw[2] + raw[2]
    }
    if (raw.length !== 6) {
        return '#ffffff'
    }
    const r = Math.round(255 - (255 - parseInt(raw.substring(0, 2), 16)) * opacity)
    const g = Math.round(255 - (255 - parseInt(raw.substring(2, 4), 16)) * opacity)
    const b = Math.round(255 - (255 - parseInt(raw.substring(4, 6), 16)) * opacity)
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export type SMTPEmailSender = EmailSender & {
    validateOrThrow(): Promise<void>
    isSmtpConfigured(): boolean
}

export { smtpEmailSender }

type RenderEmailBodyArgs = {
    platform: PlatformWithoutFederatedAuth | null
    templateData: EmailTemplateData
}
