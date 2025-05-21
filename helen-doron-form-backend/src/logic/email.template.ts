const emailTemplate = `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html dir="ltr" lang="en">
    <head>
      <link
        rel="preload"
        as="image"
        href="{{logo_url}}" />
      <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
      <meta name="x-apple-disable-message-reformatting" />
      <!--$-->
    </head>
    <body
      style='background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'>
      <table
        align="center"
        width="100%"
        border="0"
        cellpadding="0"
        cellspacing="0"
        role="presentation"
        style="max-width:37.5em;margin:0 auto;padding:20px 0 48px">
        <tbody>
          <tr style="width:100%">
            <td>
              <img
                alt="Koala"
                height="50"
                src="{{logo_url}}"
                style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto"
                width="170" />
              <p
                style="font-size:16px;line-height:26px;margin-top:16px;margin-bottom:16px">
                {{message}}
              </p>
              <p
                style="font-size:16px;line-height:26px;margin-top:16px;margin-bottom:16px">
                Helen Doron English Polska
              </p>
              <hr
                style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#cccccc;margin:20px 0" />
              <p
                style="font-size:12px;line-height:24px;color:#8898aa;margin-top:16px;margin-bottom:16px">
                Jeżeli potrzebujesz więcej informacji lub masz pytania, skontaktuj sie z nami.
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <!--/$-->
    </body>
  </html>

  `;

export function getEmailTemplate(args: {
  logoURL: string;
  message: string;
}) {
  return emailTemplate
    .replaceAll('{{logo_url}}', args.logoURL)
    .replaceAll('{{message}}', args.message)
}
