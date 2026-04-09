const nodemailer = require("nodemailer");

// Lazy transporter — created on first use so env vars are guaranteed to be loaded
let _transporter = null;

const getTransporter = () => {
  if (!_transporter) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("❌ EMAIL_USER or EMAIL_PASS is missing from .env");
      return null;
    }
    _transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS.replace(/\s+/g, ""), // strip ALL spaces automatically
      },
    });
    console.log(`✅ Email transporter created for: ${process.env.EMAIL_USER}`);
  }
  return _transporter;
};

/**
 * Send confirmation email to the applicant
 */
const sendApplicationConfirmation = async ({
  toEmail,
  applicantName,
  projectTitle,
  projectType,
  roleName,
  resumeUrl,
}) => {
  const typeLabel = {
    capstone: "Capstone Project",
    hackathon: "Hackathon",
    group: "Group Project",
    freelancing: "Freelancing Project",
  }[projectType] || projectType;

  const mailOptions = {
    from: `"ConnectIn" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `✅ Application Submitted – ${projectTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
        <div style="max-width:580px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
          
          <!-- Header -->
          <div style="background:linear-gradient(135deg,#2563eb,#7c3aed);padding:36px 32px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">ConnectIn</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Student Collaboration Platform</p>
          </div>

          <!-- Body -->
          <div style="padding:36px 32px;">
            <h2 style="margin:0 0 8px;color:#0f172a;font-size:20px;font-weight:700;">Hey ${applicantName}! 👋</h2>
            <p style="margin:0 0 24px;color:#64748b;font-size:15px;line-height:1.6;">
              Your application has been successfully submitted. Here's a summary:
            </p>

            <!-- Details Card -->
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 0;color:#94a3b8;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;width:130px;">Project</td>
                  <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:700;">${projectTitle}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#94a3b8;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Type</td>
                  <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:700;">${typeLabel}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#94a3b8;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Role Applied</td>
                  <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:700;">${roleName}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#94a3b8;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Status</td>
                  <td style="padding:8px 0;">
                    <span style="background:#fef9c3;color:#854d0e;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:700;">Pending Review</span>
                  </td>
                </tr>
                ${resumeUrl ? `
                <tr>
                  <td style="padding:8px 0;color:#94a3b8;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Resume</td>
                  <td style="padding:8px 0;">
                    <a href="${resumeUrl}" target="_blank" style="color:#2563eb;font-size:13px;font-weight:700;text-decoration:none;">📄 View Submitted Resume →</a>
                  </td>
                </tr>` : ''}
              </table>
            </div>

            <p style="margin:0 0 28px;color:#64748b;font-size:14px;line-height:1.7;">
              The project creator will review your application and get back to you. 
              You can track your application status anytime on the 
              <strong style="color:#2563eb;">My Applications</strong> page.
            </p>

            <div style="text-align:center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/my-applications" 
                 style="display:inline-block;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;text-decoration:none;padding:13px 32px;border-radius:50px;font-size:14px;font-weight:700;letter-spacing:0.3px;">
                View My Applications →
              </a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 32px;text-align:center;">
            <p style="margin:0;color:#94a3b8;font-size:12px;">
              © 2026 ConnectIn. All rights reserved.<br/>
              <span style="font-size:11px;">You received this email because you applied to a project on ConnectIn.</span>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const transport = getTransporter();
    if (!transport) {
      console.error("❌ Cannot send email — transporter not initialized (check EMAIL_USER/EMAIL_PASS in .env)");
      return;
    }
    await transport.sendMail(mailOptions);
    console.log(`✅ Confirmation email sent to ${toEmail}`);
  } catch (err) {
    console.error("❌ Error sending confirmation email:", err.message);
    console.error("   Full error:", err);
  }
};

/**
 * Notify the creator when someone applies to their project
 */
const sendCreatorNotification = async ({
  toEmail,
  creatorName,
  applicantName,
  projectTitle,
  roleName,
}) => {
  const mailOptions = {
    from: `"ConnectIn" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `🔔 New Application – ${projectTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
        <div style="max-width:580px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">
          
          <div style="background:linear-gradient(135deg,#2563eb,#7c3aed);padding:36px 32px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;">ConnectIn</h1>
            <p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Project Dashboard Alert</p>
          </div>

          <div style="padding:36px 32px;">
            <h2 style="margin:0 0 8px;color:#0f172a;font-size:20px;font-weight:700;">New applicant, ${creatorName}! 🎉</h2>
            <p style="margin:0 0 24px;color:#64748b;font-size:15px;line-height:1.6;">
              Someone just applied to your project. Review their profile and take action.
            </p>

            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px 24px;margin-bottom:24px;">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 0;color:#94a3b8;font-size:13px;font-weight:600;text-transform:uppercase;width:130px;">Project</td>
                  <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:700;">${projectTitle}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#94a3b8;font-size:13px;font-weight:600;text-transform:uppercase;">Applicant</td>
                  <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:700;">${applicantName}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#94a3b8;font-size:13px;font-weight:600;text-transform:uppercase;">Role</td>
                  <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:700;">${roleName}</td>
                </tr>
              </table>
            </div>

            <div style="text-align:center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin-dashboard"
                 style="display:inline-block;background:linear-gradient(135deg,#2563eb,#7c3aed);color:#fff;text-decoration:none;padding:13px 32px;border-radius:50px;font-size:14px;font-weight:700;">
                Review Applications →
              </a>
            </div>
          </div>

          <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 32px;text-align:center;">
            <p style="margin:0;color:#94a3b8;font-size:12px;">© 2026 ConnectIn. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const transport = getTransporter();
    if (!transport) {
      console.error("❌ Cannot send email — transporter not initialized (check EMAIL_USER/EMAIL_PASS in .env)");
      return;
    }
    await transport.sendMail(mailOptions);
    console.log(`✅ Creator notification sent to ${toEmail}`);
  } catch (err) {
    console.error("❌ Error sending creator notification:", err.message);
    console.error("   Full error:", err);
  }
};

module.exports = { sendApplicationConfirmation, sendCreatorNotification };
