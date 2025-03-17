'use client'

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Wrench } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { config } from "@/config";

// Define the form schema with Zod
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").nonempty("Name is required"),
  email: z.string().email("Please enter a valid email address").nonempty("Email is required"),
  subject: z.string().min(3, "Subject must be at least 3 characters").nonempty("Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters long").nonempty("Message is required")
});

// Infer TypeScript type from schema
type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactPage() {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Initialize the form with react-hook-form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: ""
    },
    mode: "onBlur" // Validate on blur for better UX
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Execute reCAPTCHA
      if (recaptchaRef.current) {
        const token = await recaptchaRef.current.executeAsync();
        
        // Send the data to your backend
        const response = await fetch(`${config.api.url}/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...values,
            recaptchaToken: token,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to send message');
        }
        
        // If success
        setFormStatus('success');
        form.reset(); // Reset form fields after successful submission
        
        // Reset reCAPTCHA
        recaptchaRef.current.reset();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('error');
    } finally {
      setIsSubmitting(false);
      
      // Reset the status after 5 seconds
      setTimeout(() => {
        setFormStatus('idle');
      }, 10000);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
      <p className="text-center mb-12 max-w-2xl mx-auto">
        We&apos;d love to hear from you! Whether you have a question, feedback,
        or need support, here&apos;s how you can reach us:
      </p>

      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Contact Information */}
        <div className="flex-1 space-y-8">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Email</h3>
              <p>
                <a
                  href="mailto:support@kwikdeals.net"
                  className="text-primary hover:underline"
                >
                  support@kwikdeals.net
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="mt-1">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Headquarters</h3>
              <p>KwikDeals, Canada</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="mt-1">
              <Wrench className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Need Help?</h3>
              <p>
                Contact our{" "}
                <Link href="/support" className="text-primary hover:underline">
                  support
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="font-semibold text-lg mb-3">📱 Follow Us</h3>
            <p className="mb-2">
              Stay updated with the latest deals and announcements!
            </p>
            <ul className="space-y-2 pl-2">
              <li className="flex items-center gap-2">
                <span className="text-primary">🔹</span>
                <span>
                  Twitter/X:{" "}
                  <a
                    href="https://twitter.com/KwikDeals"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    @KwikDeals
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">🔹</span>
                <span>
                  Facebook:{" "}
                  <a
                    href="https://facebook.com/KwikDeals"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    KwikDeals
                  </a>
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">🔹</span>
                <span>
                  Instagram:{" "}
                  <a
                    href="https://instagram.com/KwikDealsOfficial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    @KwikDealsOfficial
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Form */}
        <div className="flex-1 bg-card rounded-lg p-6 shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Send us a message</h2>
          <p className="mb-6 text-muted-foreground">
            Got a great deal? Found a bug? Have a business inquiry? Drop us a
            message, and we&apos;ll get back to you ASAP! 🚀
          </p>

          {formStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded mb-6">
              Thank you! Your message has been sent successfully. We&apos;ll get back to you soon.
            </div>
          )}
          
          {formStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
              There was an error sending your message. Please try again later.
            </div>
          )}

          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your name" 
                          {...field} 
                          aria-required="true"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email*</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Your email" 
                          {...field} 
                          aria-required="true"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                name="subject"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject*</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="What is this regarding?" 
                        {...field} 
                        aria-required="true"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="message"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide as much detail as possible..."
                        rows={5}
                        {...field}
                        aria-required="true"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ReCAPTCHA
                ref={recaptchaRef}
                size="invisible"
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
              />

              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full md:w-auto" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
