import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { notifyOwner } from "./_core/notification";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import {
  sendContactConfirmationEmail,
  sendAdminNotificationEmail,
  sendPartnershipApplicationEmail,
  sendEnterpriseInquiryEmail,
} from "./email";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string().optional(),
        message: z.string().min(10),
        audience: z.enum(["farmer", "investor", "partner", "enterprise", "general"]).optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          // Send confirmation email to user
          await sendContactConfirmationEmail(input);
          
          // Send admin notification
          await sendAdminNotificationEmail(input);
          
          // Notify owner about new contact submission
          await notifyOwner({
            title: `New Contact Form Submission (${input.audience || 'General'})`,
            content: `Name: ${input.name}\nEmail: ${input.email}\nPhone: ${input.phone}\nAudience: ${input.audience || 'General'}\n\nMessage:\n${input.message}`,
          });

          return { success: true, message: 'Contact form submitted successfully' };
        } catch (error) {
          console.error('Contact form submission error:', error);
          return { success: false, message: 'Failed to submit contact form' };
        }
      }),

    partnership: publicProcedure
      .input(z.object({
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string().optional(),
        companyName: z.string().min(2),
        website: z.string().url().optional(),
        message: z.string().min(10),
      }))
      .mutation(async ({ input }) => {
        try {
          // Send partnership application confirmation
          await sendPartnershipApplicationEmail(input);
          
          // Send admin notification
          await sendAdminNotificationEmail({
            name: input.name,
            email: input.email,
            phone: input.phone,
            message: `Partnership Application\n\nCompany: ${input.companyName}\nWebsite: ${input.website || 'N/A'}\n\n${input.message}`,
            audience: "partner",
          });
          
          // Notify owner
          await notifyOwner({
            title: 'New Partnership Application',
            content: `Company: ${input.companyName}\nContact: ${input.name}\nEmail: ${input.email}\nPhone: ${input.phone}\nWebsite: ${input.website || 'N/A'}\n\nMessage:\n${input.message}`,
          });

          return { success: true, message: 'Partnership application submitted' };
        } catch (error) {
          console.error('Partnership application error:', error);
          return { success: false, message: 'Failed to submit partnership application' };
        }
      }),

    enterprise: publicProcedure
      .input(z.object({
        name: z.string().min(2),
        email: z.string().email(),
        phone: z.string().optional(),
        companyName: z.string().min(2),
        employees: z.number().min(1).optional(),
        message: z.string().min(10),
      }))
      .mutation(async ({ input }) => {
        try {
          // Send enterprise inquiry confirmation
          await sendEnterpriseInquiryEmail(input);
          
          // Send admin notification
          await sendAdminNotificationEmail({
            name: input.name,
            email: input.email,
            phone: input.phone,
            message: `Enterprise Inquiry\n\nCompany: ${input.companyName}\nEmployees: ${input.employees || 'N/A'}\n\n${input.message}`,
            audience: "enterprise",
          });
          
          // Notify owner
          await notifyOwner({
            title: 'New Enterprise Inquiry',
            content: `Company: ${input.companyName}\nContact: ${input.name}\nEmail: ${input.email}\nPhone: ${input.phone}\nEmployees: ${input.employees || 'N/A'}\n\nMessage:\n${input.message}`,
          });

          return { success: true, message: 'Enterprise inquiry submitted' };
        } catch (error) {
          console.error('Enterprise inquiry error:', error);
          return { success: false, message: 'Failed to submit enterprise inquiry' };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
