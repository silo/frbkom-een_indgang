import sgMail from '@sendgrid/mail'

type RuntimeConfig = {
  sendgridApiKey: string
  sendgridFromEmail: string
  sendgridFromName: string
  sendgridTemplateRejected: string
  sendgridTemplateApproved: string
}

declare const useRuntimeConfig: () => RuntimeConfig

let sendgridInitialized = false

const ensureSendgridClient = () => {
  const config = useRuntimeConfig()
  const {
    sendgridApiKey,
    sendgridFromEmail,
    sendgridFromName,
    sendgridTemplateRejected,
    sendgridTemplateApproved,
  } = config

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
      approved: sendgridTemplateApproved,
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

export type ApprovalEmailPayload = {
  to: string
  applicantName?: string | null
  eventTitle: string
  departmentName: string
  adminMessage: string
}

export const sendApprovalEmail = async (payload: ApprovalEmailPayload) => {
  const config = ensureSendgridClient()

  if (!config.templates.approved) {
    throw new Error('SendGrid approved template is not configured')
  }

  await sgMail.send({
    to: payload.to,
    from: config.from,
    templateId: config.templates.approved,
    dynamicTemplateData: {
      applicantName: payload.applicantName ?? 'Ansøger',
      eventTitle: payload.eventTitle,
      departmentName: payload.departmentName,
      adminMessage: payload.adminMessage,
    },
  })
}

export type DepartmentNotificationEmailPayload = {
  to: string
  departmentName: string
  eventTitle: string
  eventLocation?: string | null
  eventDates?: string | null
  applicantName?: string | null
}

export const sendDepartmentNotificationEmail = async (
  payload: DepartmentNotificationEmailPayload,
) => {
  const config = ensureSendgridClient()
  const lines = [
    `Hej ${payload.departmentName},`,
    '',
    `Der er en ny ansøgning klar til behandling: ${payload.eventTitle}.`,
  ]

  if (payload.eventDates) {
    lines.push(`Dato: ${payload.eventDates}`)
  }

  if (payload.eventLocation) {
    lines.push(`Sted: ${payload.eventLocation}`)
  }

  if (payload.applicantName) {
    lines.push(`Ansøger: ${payload.applicantName}`)
  }

  lines.push('', 'Log ind i administrationspanelet for at se alle detaljer.')

  await sgMail.send({
    to: payload.to,
    from: config.from,
    subject: `Ny ansøgning: ${payload.eventTitle}`,
    text: lines.join('\n'),
  })
}
