import { prisma } from "@/lib/db";
import { randomInt } from "crypto";
import nodemailer from "nodemailer";
import { handleError, ValidationError } from "@/lib/utils/errorHandler";
import { sendSuccessResponse } from "@/lib/utils/responseHandler";
// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Generate a 6-digit verification code
function generateVerificationCode() {
  return randomInt(100000, 999999).toString();
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      throw new ValidationError("Email is required");
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();

    // Store verification code in database
    await prisma.verificationCode.create({
      data: {
        email,
        code: verificationCode,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
      },
    });

    // Send verification email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Verify your email for Codeforces Contest Analyzer",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 10px;">Email Verification</h1>
            <div style="width: 50px; height: 3px; background-color: #ef4444; margin: 0 auto;"></div>
          </div>
          
          <div style="background-color: white; padding: 25px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <p style="color: #4b5563; font-size: 16px; margin-bottom: 15px;">Your verification code is:</p>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 4px; text-align: center; margin-bottom: 20px;">
              <strong style="color: #1a1a1a; font-size: 24px; letter-spacing: 2px;">${verificationCode}</strong>
            </div>
            <p style="color: #6b7280; font-size: 14px; text-align: center;">This code will expire in 10 minutes.</p>
          </div>
        </div>
      `,
    });

    return sendSuccessResponse({ success: true }, "Verification email sent");
  } catch (error) {
    const errorResponse = handleError(
      new ValidationError(`Failed to send verification email: ${error}`)
    );
    return new Response(errorResponse.body, {
      status: errorResponse.statusCode,
    });
  }
}

export async function PUT(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      throw new ValidationError("Email and verification code are required");
    }

    // Find the verification code
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        email,
        code,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!verificationCode) {
      throw new ValidationError("Invalid or expired verification code");
    }

    // Delete the used verification code
    await prisma.verificationCode.delete({
      where: {
        id: verificationCode.id,
      },
    });

    return sendSuccessResponse({ success: true }, "Code verified successfully");
  } catch (error) {
    const errorResponse = handleError(
      new ValidationError(`Failed to verify code: ${error}`)
    );
    return new Response(errorResponse.body, {
      status: errorResponse.statusCode,
    });
  }
}
