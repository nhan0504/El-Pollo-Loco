#### Nodemailer: SMTP Transport

- What is it?
  - Allows you to pipeline emails from NodeJS to an SMTP account for sending
- Outlook
  - Difficulties: Worked great with outlook until Outlook locked our account
    - Most personal email providers like outlook, gmail etc consider services like nodemailer “less secure” and will send to associated emails to spam box or lock accounts
- Email API Services
  - Email API services are commonly used in practice with nodemailer
    - Difficulties: Most of the services require payment (sendgrid, mailgun, postmark, twilio)
  - Mailtrap
    - Email API service with a free tier
    - Requires a custom domain or subdomain to be configured to nodemailer via DNS settings
    - Difficulties: Unable to configure and connect to our Heroku subdomain

#### Nodemailer: Sendmail Transport

- What is it?
  - Allows you to pipeline emails from NodeJS to the Unix Sendmail command in order to send emails
- Difficulties:
  - Difficult to test on windows without Unix
    - Requires Windows Subsystem for Linux or similar installation in order to run Unix Sendmail (Can be configured via the Nodemailer Application as well).
  - Unable to test on Heroku
    - Deploying and testing on Heroku proved to be more difficult than expected and we were not able to sufficiently test Nodemailer with the Sendmail protocol

#### Options for Continued Development

- Nodemailer Application
  - Nodemailer application allows you to create a local SMTP server to upload emails to. This catches emails sent from NodeJS and saves them to disk. They then can be uploaded in “batches” to a SMTP server for sending.
  - Allows for easier testing and scalability, alongside Nodemailer Sendmail or SMTP Transport
  - https://www.nodemailer.com/
- Node-sendmail
  - Package with similar functionality to Nodemailer Sendmail Transport
  - https://www.npmjs.com/package/sendmail
- Email JS
  - Requires SMTP
  - https://www.emailjs.com/
- Nodemailer - other transports
  - Nodemailer supports a few other transports such as AWS SES transport
  - Further research needed
- Node email-templates
  - Uses the Forward Email Transport
  - Further research Needed
  - https://www.npmjs.com/package/email-templates
