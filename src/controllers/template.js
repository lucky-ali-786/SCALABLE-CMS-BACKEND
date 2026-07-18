   export const htmlTemplate = (name, otp) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Blogger - Email Verification</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                padding: 24px 16px;
                color: #0f172a;
                line-height: 1.6;
            }
            .wrapper {
                max-width: 600px;
                margin: 0 auto;
            }
            .container {
                background: #ffffff;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 0 40px 60px rgba(0, 0, 0, 0.25), 0 20px 40px rgba(0, 0, 0, 0.15);
            }
            .header {
                background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 50%, #FFA500 100%);
                padding: 60px 40px;
                text-align: center;
                color: white;
                position: relative;
                overflow: hidden;
            }
            .header::before {
                content: '';
                position: absolute;
                top: -50%;
                right: -50%;
                width: 400px;
                height: 400px;
                background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
                border-radius: 50%;
            }
            .header::after {
                content: '';
                position: absolute;
                bottom: -30%;
                left: -20%;
                width: 300px;
                height: 300px;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                border-radius: 50%;
            }
            .brand-logo-container {
                width: 100px;
                height: 100px;
                margin: 0 auto 24px;
                background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%);
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                z-index: 1;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255, 255, 255, 0.3);
            }
            .brand-logo-container svg {
                width: 70px;
                height: 70px;
                filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
            }
            .header h1 {
                font-size: 32px;
                font-weight: 900;
                margin-bottom: 8px;
                letter-spacing: -1px;
                position: relative;
                z-index: 1;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header p {
                font-size: 15px;
                opacity: 0.98;
                font-weight: 600;
                position: relative;
                z-index: 1;
                letter-spacing: 0.5px;
            }
            .content {
                padding: 48px 40px;
            }
            .greeting-section {
                background: linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 100%);
                border: 2px solid rgba(255, 152, 83, 0.3);
                border-radius: 18px;
                padding: 32px;
                margin-bottom: 32px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }
            .greeting-section::before {
                content: '✨';
                position: absolute;
                top: 16px;
                right: 20px;
                font-size: 32px;
                opacity: 0.3;
            }
            .greeting-emoji {
                font-size: 48px;
                margin-bottom: 16px;
                display: block;
            }
            .greeting-text {
                color: #1f2937;
                font-size: 18px;
                line-height: 1.8;
                font-weight: 600;
            }
            .user-highlight {
                font-weight: 900;
                background: linear-gradient(135deg, #FF6B6B 0%, #FFA500 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-size: 20px;
            }
            .divider-premium {
                height: 3px;
                background: linear-gradient(90deg, transparent, #FF8E53 20%, #FFA500 50%, #FF8E53 80%, transparent);
                margin: 32px 0;
                border-radius: 2px;
                box-shadow: 0 2px 8px rgba(255, 152, 83, 0.2);
            }
            .otp-showcase {
                background: linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 100%);
                border: 2px solid rgba(255, 152, 83, 0.3);
                border-radius: 18px;
                padding: 48px 40px;
                margin-bottom: 32px;
                position: relative;
                overflow: hidden;
                text-align: center;
            }
            .otp-showcase::before {
                content: '✨';
                position: absolute;
                top: 16px;
                right: 20px;
                font-size: 32px;
                opacity: 0.3;
            }
            .otp-badge {
                font-size: 14px;
                font-weight: 900;
                color: #FF6B6B;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin-bottom: 24px;
                display: inline-block;
                background: rgba(255, 107, 107, 0.1);
                padding: 8px 16px;
                border-radius: 8px;
                position: relative;
                z-index: 2;
            }
            .otp-code {
                font-size: 52px;
                font-weight: 900;
                color: #FF6B6B;
                letter-spacing: 12px;
                position: relative;
                z-index: 2;
                margin: 32px 0;
                font-family: 'Courier New', monospace;
                text-shadow: 0 2px 8px rgba(255, 107, 107, 0.15);
                display: block;
            }
            .otp-description {
                color: #1f2937;
                font-size: 16px;
                line-height: 1.8;
                font-weight: 600;
                position: relative;
                z-index: 2;
            }
            .timer-section {
                background: linear-gradient(135deg, #F5F3FF 0%, #FAF8FF 100%);
                border: 3px solid rgba(124, 58, 237, 0.3);
                border-left: 6px solid #7C3AED;
                border-radius: 18px;
                padding: 28px;
                margin-bottom: 36px;
                position: relative;
                overflow: hidden;
                text-align: center;
            }
            .timer-section::before {
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                width: 150px;
                height: 150px;
                background: radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%);
                border-radius: 50%;
            }
            .timer-badge {
                font-size: 12px;
                font-weight: 900;
                color: #7C3AED;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin-bottom: 16px;
                display: inline-block;
                background: rgba(124, 58, 237, 0.1);
                padding: 6px 12px;
                border-radius: 8px;
            }
            .timer-text {
                color: #374151;
                font-size: 15px;
                line-height: 1.8;
                font-weight: 600;
                position: relative;
                z-index: 1;
            }
            .timer-highlight {
                color: #7C3AED;
                font-weight: 900;
                font-size: 18px;
            }
            .closing-section {
                background: linear-gradient(135deg, rgba(255, 152, 83, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%);
                border-radius: 16px;
                padding: 28px;
                text-align: center;
                margin-bottom: 24px;
                border: 2px solid rgba(255, 152, 83, 0.15);
            }
            .closing-text {
                font-size: 15px;
                color: #475569;
                line-height: 1.8;
                font-weight: 600;
                margin-bottom: 12px;
            }
            .brand-signature {
                font-size: 18px;
                font-weight: 900;
                background: linear-gradient(135deg, #FF6B6B 0%, #FFA500 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                display: block;
                margin-top: 12px;
                letter-spacing: 0.5px;
            }
            .footer {
                background: linear-gradient(135deg, #FFF7ED 0%, #F3F4F6 100%);
                padding: 36px 40px;
                text-align: center;
                border-top: 3px solid rgba(255, 152, 83, 0.15);
            }
            .footer-text {
                font-size: 13px;
                color: #64748b;
                line-height: 1.8;
                font-weight: 600;
                margin-bottom: 12px;
            }
            .footer-divider {
                height: 2px;
                background: linear-gradient(90deg, transparent, rgba(255, 152, 83, 0.3), transparent);
                margin: 16px 0;
            }
            .footer-brand {
                margin-top: 16px;
                font-size: 12px;
                color: #94a3b8;
                font-weight: 700;
                letter-spacing: 0.5px;
            }
            .footer-brand-highlight {
                background: linear-gradient(135deg, #FF6B6B 0%, #FFA500 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-weight: 900;
                font-size: 13px;
            }
            .security-note {
                display: inline-block;
                padding: 8px 16px;
                background: rgba(255, 152, 83, 0.1);
                border-radius: 12px;
                font-size: 12px;
                color: #FF6B6B;
                font-weight: 700;
                margin-top: 8px;
            }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="container">
                <div class="header">
                    <div class="brand-logo-container">
                         <img src="cid:logo" alt="Blogger Logo" style="\\width: 70px; height: 70px;" />
                    </div>
                    <h1>Blogger</h1>
                    <p>Email Verification</p>
                </div>
                <div class="content">
                    <div class="greeting-section">
                        <span class="greeting-emoji">🎉</span>
                        <div class="greeting-text">
                            Welcome <span class="user-highlight">${name}</span>!<br>
                            Let's verify your email to get started
                        </div>
                    </div>
                    <div class="divider-premium"></div>
                    <div class="otp-showcase">
                        <div class="otp-badge">🔐 Verification Code</div>
                        <div class="otp-code">${otp}</div>
                        <div class="otp-description">
                            Enter this code in the verification box on your screen to confirm your email address.
                        </div>
                    </div>
                    
                    <div class="timer-section">
                        <div class="timer-badge">⏱️ Valid For</div>
                        <p class="timer-text">
                            This code is valid for <span class="timer-highlight">3 minutes</span> only. Please verify your email promptly.
                        </p>
                    </div>
                    
                    <div class="closing-section">
                        <p class="closing-text">
                            If you didn't request this verification code, please ignore this email. Your account won't be created without confirming it.
                        </p>
                        <span class="brand-signature">Keep Writing, Keep Inspiring 🚀</span>
                        <div class="security-note">🔒 For your security, never share this code</div>
                    </div>
                </div>
                
                <div class="footer">
                    <p class="footer-text">
                        💌 You're receiving this because you requested email verification on Blogger
                    </p>
                    <div class="footer-divider"></div>
                    <p class="footer-brand">
                        <span class="footer-brand-highlight">© 2025 Blogger</span> · Share Your Stories
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;}
    export const htmlTemplateComment = (posttitle,username,content) => {
        return  `
   <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Blogger - New Comment Notification</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                padding: 24px 16px;
                color: #0f172a;
                line-height: 1.6;
            }
            .wrapper {
                max-width: 600px;
                margin: 0 auto;
            }
            .container {
                background: #ffffff;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 0 40px 60px rgba(0, 0, 0, 0.25), 0 20px 40px rgba(0, 0, 0, 0.15);
            }
            .header {
                background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 50%, #FFA500 100%);
                padding: 60px 40px;
                text-align: center;
                color: white;
                position: relative;
                overflow: hidden;
            }
            .header::before {
                content: '';
                position: absolute;
                top: -50%;
                right: -50%;
                width: 400px;
                height: 400px;
                background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
                border-radius: 50%;
            }
            .header::after {
                content: '';
                position: absolute;
                bottom: -30%;
                left: -20%;
                width: 300px;
                height: 300px;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                border-radius: 50%;
            }
            .brand-logo-container {
                width: 100px;
                height: 100px;
                margin: 0 auto 24px;
                background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%);
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                z-index: 1;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255, 255, 255, 0.3);
            }
            .brand-logo-container svg {
                width: 70px;
                height: 70px;
                filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
            }
            .header h1 {
                font-size: 32px;
                font-weight: 900;
                margin-bottom: 8px;
                letter-spacing: -1px;
                position: relative;
                z-index: 1;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header p {
                font-size: 15px;
                opacity: 0.98;
                font-weight: 600;
                position: relative;
                z-index: 1;
                letter-spacing: 0.5px;
            }
            .content {
                padding: 48px 40px;
            }
            .greeting-section {
                background: linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 100%);
                border: 2px solid rgba(255, 152, 83, 0.3);
                border-radius: 18px;
                padding: 32px;
                margin-bottom: 32px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }
            .greeting-section::before {
                content: '✨';
                position: absolute;
                top: 16px;
                right: 20px;
                font-size: 32px;
                opacity: 0.3;
            }
            .greeting-emoji {
                font-size: 48px;
                margin-bottom: 16px;
                display: block;
            }
            .greeting-text {
                color: #1f2937;
                font-size: 18px;
                line-height: 1.8;
                font-weight: 600;
            }
            .user-highlight {
                font-weight: 900;
                background: linear-gradient(135deg, #FF6B6B 0%, #FFA500 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-size: 20px;
            }
            .divider-premium {
                height: 3px;
                background: linear-gradient(90deg, transparent, #FF8E53 20%, #FFA500 50%, #FF8E53 80%, transparent);
                margin: 32px 0;
                border-radius: 2px;
                box-shadow: 0 2px 8px rgba(255, 152, 83, 0.2);
            }
            .post-showcase {
                background: linear-gradient(135deg, #F0F4FF 0%, #FFF7ED 100%);
                border: 3px solid rgba(255, 152, 83, 0.4);
                border-radius: 18px;
                padding: 28px;
                margin-bottom: 28px;
                position: relative;
                overflow: hidden;
            }
            .post-showcase::before {
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                width: 120px;
                height: 120px;
                background: radial-gradient(circle, rgba(255, 152, 83, 0.1) 0%, transparent 70%);
                border-radius: 50%;
            }
            .post-badge {
                font-size: 12px;
                font-weight: 900;
                color: #FF6B6B;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin-bottom: 12px;
                display: inline-block;
                background: rgba(255, 107, 107, 0.1);
                padding: 6px 12px;
                border-radius: 8px;
            }
            .post-title {
                font-size: 22px;
                font-weight: 800;
                color: #1f2937;
                line-height: 1.5;
                position: relative;
                z-index: 1;
            }
            .comment-showcase {
                background: linear-gradient(135deg, #F5F3FF 0%, #FAF8FF 100%);
                border: 3px solid rgba(124, 58, 237, 0.3);
                border-left: 6px solid #7C3AED;
                border-radius: 18px;
                padding: 32px;
                margin-bottom: 36px;
                position: relative;
                overflow: hidden;
            }
            .comment-showcase::before {
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                width: 150px;
                height: 150px;
                background: radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%);
                border-radius: 50%;
            }
            .comment-badge {
                font-size: 12px;
                font-weight: 900;
                color: #7C3AED;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin-bottom: 16px;
                display: inline-block;
                background: rgba(124, 58, 237, 0.1);
                padding: 6px 12px;
                border-radius: 8px;
            }
            .comment-content {
                color: #374151;
                font-size: 16px;
                line-height: 1.8;
                font-weight: 500;
                position: relative;
                z-index: 1;
                padding: 16px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 12px;
                border-left: 4px solid #7C3AED;
            }
            .action-button {
                display: block;
                width: 100%;
                background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 50%, #FFA500 100%);
                color: white;
                padding: 18px 32px;
                text-decoration: none;
                border-radius: 14px;
                font-weight: 800;
                font-size: 16px;
                text-align: center;
                margin-bottom: 32px;
                box-shadow: 0 16px 32px rgba(255, 107, 107, 0.4);
                transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                letter-spacing: 0.5px;
                border: none;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }
            .action-button::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.5s;
            }
            .action-button:hover {
                transform: translateY(-3px);
                box-shadow: 0 24px 48px rgba(255, 107, 107, 0.5);
                letter-spacing: 1px;
            }
            .action-button:hover::before {
                left: 100%;
            }
            .closing-section {
                background: linear-gradient(135deg, rgba(255, 152, 83, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%);
                border-radius: 16px;
                padding: 28px;
                text-align: center;
                margin-bottom: 24px;
                border: 2px solid rgba(255, 152, 83, 0.15);
            }
            .closing-text {
                font-size: 15px;
                color: #475569;
                line-height: 1.8;
                font-weight: 600;
                margin-bottom: 12px;
            }
            .brand-signature {
                font-size: 18px;
                font-weight: 900;
                background: linear-gradient(135deg, #FF6B6B 0%, #FFA500 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                display: block;
                margin-top: 12px;
                letter-spacing: 0.5px;
            }
            .footer {
                background: linear-gradient(135deg, #FFF7ED 0%, #F3F4F6 100%);
                padding: 36px 40px;
                text-align: center;
                border-top: 3px solid rgba(255, 152, 83, 0.15);
            }
            .footer-text {
                font-size: 13px;
                color: #64748b;
                line-height: 1.8;
                font-weight: 600;
                margin-bottom: 12px;
            }
            .footer-divider {
                height: 2px;
                background: linear-gradient(90deg, transparent, rgba(255, 152, 83, 0.3), transparent);
                margin: 16px 0;
            }
            .footer-brand {
                margin-top: 16px;
                font-size: 12px;
                color: #94a3b8;
                font-weight: 700;
                letter-spacing: 0.5px;
            }
            .footer-brand-highlight {
                background: linear-gradient(135deg, #FF6B6B 0%, #FFA500 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-weight: 900;
                font-size: 13px;
            }
            .social-proof {
                display: inline-block;
                padding: 8px 16px;
                background: rgba(255, 152, 83, 0.1);
                border-radius: 12px;
                font-size: 12px;
                color: #FF6B6B;
                font-weight: 700;
                margin-top: 8px;
            }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="container">
                <div class="header">
                    <div class="brand-logo-container">
                        <img src="cid:logo" alt="Blogger Logo" style="\\width: 70px; height: 70px;" />
                    </div>
                    <h1>Blogger</h1>
                    <p>New Comment Notification</p>
                </div>
                
                <div class="content">
                    <div class="greeting-section">
                        <span class="greeting-emoji">🎉</span>
                        <div class="greeting-text">
                            <span class="user-highlight">${username}</span><br>
                            just commented on your post!
                        </div>
                    </div>

                    <div class="divider-premium"></div>
                    
                    <div class="post-showcase">
                        <div class="post-badge">📌 Your Post</div>
                        <div class="post-title">${posttitle || 'Your Blog Post'}</div>
                    </div>
                    
                    <div class="comment-showcase">
                        <div class="comment-badge">💬 Comment</div>
                        <div class="comment-content">${content}</div>
                    </div>
                    
                    <a href="#" class="action-button">✨ View & Reply on Blogger</a>
                    
                    <div class="closing-section">
                        <p class="closing-text">
                            Keep engaging with your readers and grow your amazing audience!
                        </p>
                        <span class="brand-signature">Keep Writing, Keep Inspiring 🚀</span>
                        <div class="social-proof">👥 Loved by bloggers worldwide</div>
                    </div>
                </div>
                
                <div class="footer">
                    <p class="footer-text">
                        💌 You're receiving this because comments are enabled on your post
                    </p>
                    <div class="footer-divider"></div>
                    <p class="footer-brand">
                        <span class="footer-brand-highlight">© 2025 Blogger</span> · Share Your Stories
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;}
    export const scheduleHtml=(posttitle,username,time)=>{
        return  `
   <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Blogger - Post Scheduled Notification</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
                background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                padding: 24px 16px;
                color: #0f172a;
                line-height: 1.6;
            }
            .wrapper {
                max-width: 600px;
                margin: 0 auto;
            }
            .container {
                background: #ffffff;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 0 40px 60px rgba(0, 0, 0, 0.25), 0 20px 40px rgba(0, 0, 0, 0.15);
            }
            .header {
                background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 50%, #FFA500 100%);
                padding: 60px 40px;
                text-align: center;
                color: white;
                position: relative;
                overflow: hidden;
            }
            .header::before {
                content: '';
                position: absolute;
                top: -50%;
                right: -50%;
                width: 400px;
                height: 400px;
                background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
                border-radius: 50%;
            }
            .header::after {
                content: '';
                position: absolute;
                bottom: -30%;
                left: -20%;
                width: 300px;
                height: 300px;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                border-radius: 50%;
            }
            .brand-logo-container {
                width: 100px;
                height: 100px;
                margin: 0 auto 24px;
                background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%);
                border-radius: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                z-index: 1;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255, 255, 255, 0.3);
            }
            .brand-logo-container svg {
                width: 70px;
                height: 70px;
                filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15));
            }
            .header h1 {
                font-size: 32px;
                font-weight: 900;
                margin-bottom: 8px;
                letter-spacing: -1px;
                position: relative;
                z-index: 1;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header p {
                font-size: 15px;
                opacity: 0.98;
                font-weight: 600;
                position: relative;
                z-index: 1;
                letter-spacing: 0.5px;
            }
            .content {
                padding: 48px 40px;
            }
            .greeting-section {
                background: linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 100%);
                border: 2px solid rgba(255, 152, 83, 0.3);
                border-radius: 18px;
                padding: 32px;
                margin-bottom: 32px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }
            .greeting-section::before {
                content: '✨';
                position: absolute;
                top: 16px;
                right: 20px;
                font-size: 32px;
                opacity: 0.3;
            }
            .greeting-emoji {
                font-size: 48px;
                margin-bottom: 16px;
                display: block;
            }
            .greeting-text {
                color: #1f2937;
                font-size: 18px;
                line-height: 1.8;
                font-weight: 600;
            }
            .user-highlight {
                font-weight: 900;
                background: linear-gradient(135deg, #FF6B6B 0%, #FFA500 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-size: 20px;
            }
            .divider-premium {
                height: 3px;
                background: linear-gradient(90deg, transparent, #FF8E53 20%, #FFA500 50%, #FF8E53 80%, transparent);
                margin: 32px 0;
                border-radius: 2px;
                box-shadow: 0 2px 8px rgba(255, 152, 83, 0.2);
            }
            .post-showcase {
                background: linear-gradient(135deg, #F0F4FF 0%, #FFF7ED 100%);
                border: 3px solid rgba(255, 152, 83, 0.4);
                border-radius: 18px;
                padding: 28px;
                margin-bottom: 28px;
                position: relative;
                overflow: hidden;
            }
            .post-showcase::before {
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                width: 120px;
                height: 120px;
                background: radial-gradient(circle, rgba(255, 152, 83, 0.1) 0%, transparent 70%);
                border-radius: 50%;
            }
            .post-badge {
                font-size: 12px;
                font-weight: 900;
                color: #FF6B6B;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin-bottom: 12px;
                display: inline-block;
                background: rgba(255, 107, 107, 0.1);
                padding: 6px 12px;
                border-radius: 8px;
            }
            .post-title {
                font-size: 22px;
                font-weight: 800;
                color: #1f2937;
                line-height: 1.5;
                position: relative;
                z-index: 1;
            }
            .schedule-showcase {
                background: linear-gradient(135deg, #F5F3FF 0%, #FAF8FF 100%);
                border: 3px solid rgba(124, 58, 237, 0.3);
                border-left: 6px solid #7C3AED;
                border-radius: 18px;
                padding: 32px;
                margin-bottom: 36px;
                position: relative;
                overflow: hidden;
            }
            .schedule-showcase::before {
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                width: 150px;
                height: 150px;
                background: radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%);
                border-radius: 50%;
            }
            .schedule-badge {
                font-size: 12px;
                font-weight: 900;
                color: #7C3AED;
                text-transform: uppercase;
                letter-spacing: 2px;
                margin-bottom: 16px;
                display: inline-block;
                background: rgba(124, 58, 237, 0.1);
                padding: 6px 12px;
                border-radius: 8px;
            }
            .schedule-content {
                color: #374151;
                font-size: 16px;
                line-height: 1.8;
                font-weight: 500;
                position: relative;
                z-index: 1;
                padding: 16px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 12px;
                border-left: 4px solid #7C3AED;
            }
            .schedule-time {
                font-weight: 900;
                color: #7C3AED;
                font-size: 18px;
                display: block;
                margin-top: 8px;
            }
            .action-button {
                display: block;
                width: 100%;
                background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 50%, #FFA500 100%);
                color: white;
                padding: 18px 32px;
                text-decoration: none;
                border-radius: 14px;
                font-weight: 800;
                font-size: 16px;
                text-align: center;
                margin-bottom: 32px;
                box-shadow: 0 16px 32px rgba(255, 107, 107, 0.4);
                transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                letter-spacing: 0.5px;
                border: none;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }
            .action-button::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.5s;
            }
            .action-button:hover {
                transform: translateY(-3px);
                box-shadow: 0 24px 48px rgba(255, 107, 107, 0.5);
                letter-spacing: 1px;
            }
            .action-button:hover::before {
                left: 100%;
            }
            .closing-section {
                background: linear-gradient(135deg, rgba(255, 152, 83, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%);
                border-radius: 16px;
                padding: 28px;
                text-align: center;
                margin-bottom: 24px;
                border: 2px solid rgba(255, 152, 83, 0.15);
            }
            .closing-text {
                font-size: 15px;
                color: #475569;
                line-height: 1.8;
                font-weight: 600;
                margin-bottom: 12px;
            }
            .brand-signature {
                font-size: 18px;
                font-weight: 900;
                background: linear-gradient(135deg, #FF6B6B 0%, #FFA500 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                display: block;
                margin-top: 12px;
                letter-spacing: 0.5px;
            }
            .footer {
                background: linear-gradient(135deg, #FFF7ED 0%, #F3F4F6 100%);
                padding: 36px 40px;
                text-align: center;
                border-top: 3px solid rgba(255, 152, 83, 0.15);
            }
            .footer-text {
                font-size: 13px;
                color: #64748b;
                line-height: 1.8;
                font-weight: 600;
                margin-bottom: 12px;
            }
            .footer-divider {
                height: 2px;
                background: linear-gradient(90deg, transparent, rgba(255, 152, 83, 0.3), transparent);
                margin: 16px 0;
            }
            .footer-brand {
                margin-top: 16px;
                font-size: 12px;
                color: #94a3b8;
                font-weight: 700;
                letter-spacing: 0.5px;
            }
            .footer-brand-highlight {
                background: linear-gradient(135deg, #FF6B6B 0%, #FFA500 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-weight: 900;
                font-size: 13px;
            }
            .social-proof {
                display: inline-block;
                padding: 8px 16px;
                background: rgba(255, 152, 83, 0.1);
                border-radius: 12px;
                font-size: 12px;
                color: #FF6B6B;
                font-weight: 700;
                margin-top: 8px;
            }
        </style>
    </head>
    <body>
        <div class="wrapper">
            <div class="container">
                <div class="header">
                    <div class="brand-logo-container">
                        <img src="cid:logo" alt="Blogger Logo" style="\\width: 70px; height: 70px;" />
                    </div>
                    <h1>Blogger</h1>
                    <p>Post Scheduled Successfully</p>
                </div>
                
                <div class="content">
                    <div class="greeting-section">
                        <span class="greeting-emoji">⏰</span>
                        <div class="greeting-text">
                            Hey <span class="user-highlight">${username}</span>!<br>
                            Your post is scheduled and ready to go
                        </div>
                    </div>

                    <div class="divider-premium"></div>
                    
                    <div class="post-showcase">
                        <div class="post-badge">📌 Scheduled Post</div>
                        <div class="post-title">${posttitle || 'Your Blog Post'}</div>
                    </div>
                    
                    <div class="schedule-showcase">
                        <div class="schedule-badge">📅 Publishing Schedule</div>
                        <div class="schedule-content">
                            Your post will be automatically published at
                            <span class="schedule-time">${time}</span>
                        </div>
                    </div>
                    
                    <a href="#" class="action-button">✨ View Scheduled Posts</a>
                    
                    <div class="closing-section">
                        <p class="closing-text">
                            Your readers will love this! Keep your audience engaged with consistent, quality content.
                        </p>
                        <span class="brand-signature">Keep Writing, Keep Inspiring 🚀</span>
                        <div class="social-proof">📈 Scheduled posts boost engagement</div>
                    </div>
                </div>
                
                <div class="footer">
                    <p class="footer-text">
                        💌 You're receiving this because you scheduled a post on Blogger
                    </p>
                    <div class="footer-divider"></div>
                    <p class="footer-brand">
                        <span class="footer-brand-highlight">© 2025 Blogger</span> · Share Your Stories
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
    }