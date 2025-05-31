export function magicLinkTemplate(link: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 2rem; background-color: #f9f9f9; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 2rem;">
        <img src="https://news-briefs.vercel.app/images/email.svg" alt="News Briefs" width="120" height="60" />
        <h2 style="color: #222;">Sign in to News Briefs</h2>
      </div>
      <p style="color: #333; font-size: 16px;">Click the button below to securely log in:</p>
      <div style="text-align: center; margin: 2rem 0;">
        <a href="${link}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          🔐 Log in
        </a>
      </div>
      <p style="font-size: 14px; color: #666;">This link will expire in 10 minutes. If you didn’t request the link, you can ignore this email.</p>
    </div>
  `;

  const subject = "Your Magic Login Link for News Briefs";

  return { subject, html };
}
