import sgMail from '@sendgrid/mail'

type RuntimeConfig = {
  sendgridApiKey: string
  sendgridFromEmail: string
  sendgridFromName: string
  sendgridTemplateRejected: string
}

declare const useRuntimeConfig: () => RuntimeConfig

let sendgridInitialized = false

const ensureSendgridClient = () => {
  const config = useRuntimeConfig()
  const { sendgridApiKey, sendgridFromEmail, sendgridFromName, sendgridTemplateRejected } = config

  if (!sendgridApiKey || !sendgridFromEmail) {
    throw new Error('SendGrid credentials are not configured')
  }

  if (!sendgridTemplateRejected) {
    throw new Error('SendGrid reject template is not configured')
  }

  if (!sendgridInitialized) {
    sgMail.setApiKey(sendgridApiKey)
    sendgridInitialized = true
  }

  return {
    from: {
      email: sendgridFromEmail,
      name: sendgridFromName || 'Frederiksberg Kommune',
    },
    templates: {
      rejected: sendgridTemplateRejected,
    },
  }
}

export type RejectionEmailPayload = {
  to: string
  applicantName?: string | null
  eventTitle: string
  rejectionNote: string
}

export const sendRejectionEmail = async (payload: RejectionEmailPayload) => {
  const config = ensureSendgridClient()

  await sgMail.send({
    to: payload.to,
    from: config.from,
    templateId: config.templates.rejected,
    dynamicTemplateData: {
      applicantName: payload.applicantName ?? 'Ansøger',
      eventTitle: payload.eventTitle,
      rejectionNote: payload.rejectionNote,
    },
  })
}
