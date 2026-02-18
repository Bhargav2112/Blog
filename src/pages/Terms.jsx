import React from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function Terms() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing and using Luxe Blog ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.`,
    },
    {
      title: "2. Description of Service",
      content: `Luxe Blog is a digital publishing platform that provides articles, blog posts, and other content for informational and entertainment purposes. We reserve the right to modify, suspend, or discontinue the Service at any time without notice.`,
    },
    {
      title: "3. User Accounts",
      content: `To access certain features of our Service, you may need to create an account. You are responsible for:
• Maintaining the confidentiality of your account credentials
• All activities that occur under your account
• Notifying us immediately of any unauthorized use
• Providing accurate and complete information

We reserve the right to suspend or terminate accounts that violate these terms.`,
    },
    {
      title: "4. User Content",
      content: `By submitting content to our Service, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and distribute your content. You represent that you own or have the necessary rights to submit such content.

You agree not to submit content that:
• Is unlawful, harmful, threatening, or harassing
• Infringes on intellectual property rights
• Contains viruses or malicious code
• Is spam or unauthorized advertising`,
    },
    {
      title: "5. Intellectual Property",
      content: `All content on Luxe Blog, including text, graphics, logos, and software, is the property of Luxe Blog or its content suppliers and is protected by copyright laws. You may not reproduce, distribute, or create derivative works without our express written permission.`,
    },
    {
      title: "6. Privacy",
      content: `Your use of our Service is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding your personal information.`,
    },
    {
      title: "7. Disclaimers",
      content: `THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE. WE ARE NOT RESPONSIBLE FOR THE ACCURACY OR RELIABILITY OF ANY CONTENT.`,
    },
    {
      title: "8. Limitation of Liability",
      content: `IN NO EVENT SHALL LUXE BLOG BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE PAST TWELVE MONTHS.`,
    },
    {
      title: "9. Indemnification",
      content: `You agree to indemnify and hold harmless Luxe Blog, its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of the Service or violation of these terms.`,
    },
    {
      title: "10. Governing Law",
      content: `These Terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of New York.`,
    },
    {
      title: "11. Changes to Terms",
      content: `We reserve the right to modify these Terms at any time. We will notify you of significant changes by posting a notice on our Service. Your continued use of the Service after changes constitutes acceptance of the new terms.`,
    },
    {
      title: "12. Contact Information",
      content: `If you have questions about these Terms, please contact us at:
Email: legal@luxeblog.com
Address: 123 Luxury Ave, Suite 100, New York, NY 10001`,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6"
          >
            <FileText className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-400 font-medium">
              Terms of Service
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Terms & Conditions
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400"
          >
            Last updated: February 12, 2025
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <p className="text-slate-300 text-lg leading-relaxed mb-12">
              Please read these Terms of Service carefully before using our
              website. These terms govern your access to and use of Luxe Blog.
            </p>

            <div className="space-y-8">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-8"
                >
                  <h2 className="text-xl font-bold text-white mb-4">
                    {section.title}
                  </h2>
                  <div className="text-slate-400 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
