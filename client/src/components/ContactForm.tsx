import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { trpc } from '@/lib/trpc';
import { Label } from '@/components/ui/label';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const submitContactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success(language === 'ar' ? 'تم إرسال رسالتك بنجاح!' : 'Your message has been sent successfully!');
      reset();
      setIsSubmitting(false);
    },
    onError: () => {
      toast.error(language === 'ar' ? 'فشل إرسال الرسالة. حاول مرة أخرى.' : 'Failed to send message. Please try again.');
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    submitContactMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto">
      <div>
        <Label className="text-sm font-medium text-navy-900 mb-2">
          {language === 'ar' ? 'الاسم' : 'Name'}
        </Label>
        <Input
          {...register('name')}
          placeholder={language === 'ar' ? 'أدخل اسمك' : 'Your name'}
          className="border-cyan-200 focus:border-cyan-500"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <Label className="text-sm font-medium text-navy-900 mb-2">
          {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
        </Label>
        <Input
          {...register('email')}
          type="email"
          placeholder={language === 'ar' ? 'بريدك الإلكتروني' : 'your@email.com'}
          className="border-cyan-200 focus:border-cyan-500"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <Label className="text-sm font-medium text-navy-900 mb-2">
          {language === 'ar' ? 'الهاتف (اختياري)' : 'Phone (Optional)'}
        </Label>
        <Input
          {...register('phone')}
          type="tel"
          placeholder={language === 'ar' ? 'رقم هاتفك' : '+20 100 000 0000'}
          className="border-cyan-200 focus:border-cyan-500"
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-navy-900 mb-2">
          {language === 'ar' ? 'الرسالة' : 'Message'}
        </Label>
        <Textarea
          {...register('message')}
          placeholder={language === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
          className="border-cyan-200 focus:border-cyan-500 min-h-32"
        />
        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white font-semibold py-6"
      >
        {isSubmitting 
          ? (language === 'ar' ? 'جاري الإرسال...' : 'Sending...')
          : (language === 'ar' ? 'إرسال الرسالة' : 'Send Message')
        }
      </Button>
    </form>
  );
}
