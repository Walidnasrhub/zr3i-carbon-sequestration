import sgMail from "@sendgrid/mail";

// Initialize SendGrid with API key
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = "noreply@zr3i.com";
const ADMIN_EMAIL = "info@zr3i.com";

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject?: string;
  audience?: "farmer" | "investor" | "partner" | "enterprise" | "general";
}

/**
 * Send confirmation email to the user who submitted the contact form
 */
export async function sendContactConfirmationEmail(
  data: ContactFormData
): Promise<void> {
  if (!SENDGRID_API_KEY) {
    console.warn("[Email] SendGrid API key not configured");
    return;
  }

  try {
    const audienceLabel = data.audience
      ? `(${data.audience.charAt(0).toUpperCase() + data.audience.slice(1)})`
      : "";

    const msg = {
      to: data.email,
      from: FROM_EMAIL,
      subject: `Thank you for contacting Zr3i ${audienceLabel}`,
      html: generateConfirmationEmailHTML(data),
      text: generateConfirmationEmailText(data),
    };

    await sgMail.send(msg);
    console.log(`[Email] Confirmation email sent to ${data.email}`);
  } catch (error) {
    console.error("[Email] Failed to send confirmation email:", error);
    throw error;
  }
}

/**
 * Send notification email to admin about new contact form submission
 */
export async function sendAdminNotificationEmail(
  data: ContactFormData
): Promise<void> {
  if (!SENDGRID_API_KEY) {
    console.warn("[Email] SendGrid API key not configured");
    return;
  }

  try {
    const audienceLabel = data.audience
      ? `${data.audience.charAt(0).toUpperCase() + data.audience.slice(1)}`
      : "General";

    const msg = {
      to: ADMIN_EMAIL,
      from: FROM_EMAIL,
      subject: `New Contact Form Submission - ${audienceLabel}`,
      html: generateAdminNotificationHTML(data),
      text: generateAdminNotificationText(data),
    };

    await sgMail.send(msg);
    console.log(`[Email] Admin notification sent for ${data.email}`);
  } catch (error) {
    console.error("[Email] Failed to send admin notification:", error);
    throw error;
  }
}

/**
 * Send partnership application confirmation email
 */
export async function sendPartnershipApplicationEmail(
  data: ContactFormData & { companyName?: string; website?: string }
): Promise<void> {
  if (!SENDGRID_API_KEY) {
    console.warn("[Email] SendGrid API key not configured");
    return;
  }

  try {
    const msg = {
      to: data.email,
      from: FROM_EMAIL,
      subject: "Partnership Application Received - Zr3i",
      html: generatePartnershipApplicationHTML(data),
      text: generatePartnershipApplicationText(data),
    };

    await sgMail.send(msg);
    console.log(`[Email] Partnership application confirmation sent to ${data.email}`);
  } catch (error) {
    console.error("[Email] Failed to send partnership application email:", error);
    throw error;
  }
}

/**
 * Send enterprise inquiry confirmation email
 */
export async function sendEnterpriseInquiryEmail(
  data: ContactFormData & { companyName?: string; employees?: number }
): Promise<void> {
  if (!SENDGRID_API_KEY) {
    console.warn("[Email] SendGrid API key not configured");
    return;
  }

  try {
    const msg = {
      to: data.email,
      from: FROM_EMAIL,
      subject: "Enterprise Inquiry Received - Zr3i",
      html: generateEnterpriseInquiryHTML(data),
      text: generateEnterpriseInquiryText(data),
    };

    await sgMail.send(msg);
    console.log(`[Email] Enterprise inquiry confirmation sent to ${data.email}`);
  } catch (error) {
    console.error("[Email] Failed to send enterprise inquiry email:", error);
    throw error;
  }
}

// ============================================================================
// EMAIL TEMPLATE GENERATORS
// ============================================================================

function generateConfirmationEmailHTML(data: ContactFormData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #001F3F 0%, #00BCD4 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #666; }
          .button { display: inline-block; background: #00BCD4; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin-top: 20px; }
          h1 { margin: 0; font-size: 28px; }
          h2 { color: #001F3F; margin-top: 20px; }
          .highlight { color: #00BCD4; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Contacting Zr3i</h1>
          </div>
          <div class="content">
            <p>Dear <span class="highlight">${escapeHtml(data.name)}</span>,</p>
            
            <p>We have received your message and appreciate your interest in Zr3i's carbon sequestration platform. Our team will review your inquiry and get back to you as soon as possible.</p>
            
            <h2>Your Message Details:</h2>
            <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
            <p><strong>Phone:</strong> ${escapeHtml(data.phone || '')}</p>
            <p><strong>Message:</strong></p>
            <p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
            
            <h2>What's Next?</h2>
            <p>A member of our team will contact you within 24-48 hours to discuss your inquiry further. In the meantime, feel free to explore our platform and learn more about how Zr3i is transforming date palm cultivation into a sustainable income source.</p>
            
            <a href="https://zr3i.com" class="button">Visit Zr3i Platform</a>
            
            <div class="footer">
              <p>© 2025 Zr3i. All rights reserved.</p>
              <p>This is an automated response. Please do not reply to this email.</p>
              <p>For urgent matters, contact us at <strong>info@zr3i.com</strong> or call <strong>+201006055320</strong></p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateConfirmationEmailText(data: ContactFormData): string {
  return `
Thank You for Contacting Zr3i

Dear ${data.name},

We have received your message and appreciate your interest in Zr3i's carbon sequestration platform. Our team will review your inquiry and get back to you as soon as possible.

Your Message Details:
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || ''}
Message:
${data.message}

What's Next?
A member of our team will contact you within 24-48 hours to discuss your inquiry further. In the meantime, feel free to explore our platform and learn more about how Zr3i is transforming date palm cultivation into a sustainable income source.

© 2025 Zr3i. All rights reserved.
This is an automated response. Please do not reply to this email.
For urgent matters, contact us at info@zr3i.com or call +201006055320
  `;
}

function generateAdminNotificationHTML(data: ContactFormData): string {
  const audienceLabel = data.audience
    ? `${data.audience.charAt(0).toUpperCase() + data.audience.slice(1)}`
    : "General";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #001F3F; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #001F3F; }
          .badge { display: inline-block; background: #00BCD4; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
          .button { display: inline-block; background: #001F3F; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Contact Form Submission</h2>
            <span class="badge">${audienceLabel}</span>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">Name:</span> ${escapeHtml(data.name)}
            </div>
            <div class="field">
              <span class="label">Email:</span> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>
            </div>
            ${data.phone || '' ? `<div class="field">
              <span class="label">Phone:</span> <a href="tel:${escapeHtml(data.phone || '')}">${escapeHtml(data.phone || '')}</a>
            </div>` : ''}
            <div class="field">
              <span class="label">Audience:</span> ${audienceLabel}
            </div>
            <div class="field">
              <span class="label">Message:</span>
              <p>${escapeHtml(data.message).replace(/\n/g, "<br>")}</p>
            </div>
            
            <a href="mailto:${escapeHtml(data.email)}" class="button">Reply to ${data.name}</a>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateAdminNotificationText(data: ContactFormData): string {
  const audienceLabel = data.audience
    ? `${data.audience.charAt(0).toUpperCase() + data.audience.slice(1)}`
    : "General";

  return `
New Contact Form Submission - ${audienceLabel}

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || ''}
Audience: ${audienceLabel}

Message:
${data.message}
  `;
}

function generatePartnershipApplicationHTML(
  data: ContactFormData & { companyName?: string; website?: string }
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #001F3F 0%, #32CD32 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #666; }
          h1 { margin: 0; font-size: 28px; }
          h2 { color: #001F3F; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Partnership Application Received</h1>
          </div>
          <div class="content">
            <p>Dear ${escapeHtml(data.name)},</p>
            
            <p>Thank you for your interest in partnering with Zr3i! We're excited about the potential collaboration and will review your application carefully.</p>
            
            <h2>Next Steps</h2>
            <p>Our partnership team will contact you within 3-5 business days to discuss partnership opportunities, benefits, and next steps.</p>
            
            <p>In the meantime, you can learn more about our partnership program on our website.</p>
            
            <div class="footer">
              <p>© 2025 Zr3i. All rights reserved.</p>
              <p>For questions, contact partnerships@zr3i.com</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generatePartnershipApplicationText(
  data: ContactFormData & { companyName?: string; website?: string }
): string {
  return `
Partnership Application Received

Dear ${data.name},

Thank you for your interest in partnering with Zr3i! We're excited about the potential collaboration and will review your application carefully.

Next Steps
Our partnership team will contact you within 3-5 business days to discuss partnership opportunities, benefits, and next steps.

© 2025 Zr3i. All rights reserved.
For questions, contact partnerships@zr3i.com
  `;
}

function generateEnterpriseInquiryHTML(
  data: ContactFormData & { companyName?: string; employees?: number }
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #001F3F 0%, #00BCD4 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #666; }
          h1 { margin: 0; font-size: 28px; }
          h2 { color: #001F3F; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Enterprise Inquiry Received</h1>
          </div>
          <div class="content">
            <p>Dear ${escapeHtml(data.name)},</p>
            
            <p>Thank you for your interest in Zr3i's enterprise solutions. We're committed to helping your organization achieve its sustainability and carbon offset goals.</p>
            
            <h2>What Happens Next</h2>
            <p>Our enterprise sales team will contact you within 1-2 business days to discuss your requirements, custom solutions, and pricing options tailored to your organization's needs.</p>
            
            <p>We look forward to partnering with you!</p>
            
            <div class="footer">
              <p>© 2025 Zr3i. All rights reserved.</p>
              <p>For urgent inquiries, contact enterprise@zr3i.com</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

function generateEnterpriseInquiryText(
  data: ContactFormData & { companyName?: string; employees?: number }
): string {
  return `
Enterprise Inquiry Received

Dear ${data.name},

Thank you for your interest in Zr3i's enterprise solutions. We're committed to helping your organization achieve its sustainability and carbon offset goals.

What Happens Next
Our enterprise sales team will contact you within 1-2 business days to discuss your requirements, custom solutions, and pricing options tailored to your organization's needs.

© 2025 Zr3i. All rights reserved.
For urgent inquiries, contact enterprise@zr3i.com
  `;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
