import React from "react";
import { motion } from "framer-motion";
import { Shield, Sparkles } from "lucide-react";

export default function Privacy() {
  const sections = [
    {
      title: "Information We Collect",
      content: `We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us. This may include your name, email address, and any other information you choose to provide.

We automatically collect certain information when you use our Service, including your IP address, device and browser type, operating system, referral URLs, and how you interact with our Service.`,
    },
    {
      title: "How We Use Your Information",
      content: `We use the information we collect to:
• Provide, maintain, and improve our Service
• Send you technical notices, updates, and support messages
• Respond to your comments, questions, and requests
• Communicate with you about products, services, and events
• Monitor and analyze trends, usage, and activities
• Detect, investigate, and prevent fraudulent transactions and abuse`,
    },
    {
      title: "Information Sharing",
      content: `We may share information about you as follows:
• With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf
• In response to a request for information if we believe disclosure is in accordance with applicable law
• If we believe your actions are inconsistent with our user agreements or policies
• To protect the rights, property, and safety of us or others
• In connection with any merger, sale of company assets, or acquisition`,
    },
    {
      title: "Data Security",
      content: `We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access. However, no Internet or email transmission is ever fully secure or error-free.`,
    },
    {
      title: "Your Choices",
      content: `You may update, correct, or delete information about you at any time by logging into your account. If you wish to delete your account, please contact us, but note that we may retain certain information as required by law or for legitimate business purposes.`,
    },
    {
      title: "Cookies",
      content: `We use cookies and similar tracking technologies to track activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.`,
    },
    {
      title: "Changes to This Policy",
      content: `We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy. We encourage you to review the Privacy Policy whenever you access our Service.`,
    },
    {
      title: "Contact Us",
      content: `If you have any questions about this Privacy Policy, please contact us at privacy@luxeblog.com.`,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
          >
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400 font-medium">
              Privacy Policy
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Your Privacy Matters
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
              At Luxe Blog, we take your privacy seriously. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you visit our website or use our services.
            </p>

            <div className="space-y-12">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
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
