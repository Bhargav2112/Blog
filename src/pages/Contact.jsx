import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import {
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Send,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  MessageSquare,
} from "lucide-react";
import { GoldInput, GoldTextarea } from "../components/ui/GoldInput";
import GoldButton from "../components/ui/GoldButton";
import GlassCard from "../components/ui/GlassCard";
import { Label } from "@/components/ui/label";

export default function Contact({ addToast }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      addToast?.("Please fill in all required fields", "warning");
      return;
    }

    setLoading(true);

    await base44.entities.ContactMessage.create(formData);

    setFormData({ name: "", email: "", subject: "", message: "" });
    setLoading(false);
    addToast?.(
      "Message sent successfully! We'll get back to you soon.",
      "success",
    );
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "hello@luxeblog.com",
      href: "mailto:hello@luxeblog.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+1 (555) 123-4567",
      href: "tel:+15551234567",
    },
    {
      icon: MapPin,
      label: "Address",
      value: "123 Luxury Ave, Suite 100\nNew York, NY 10001",
      href: "#",
    },
  ];

  const socials = [
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Instagram, label: "Instagram", href: "#" },
    { icon: Linkedin, label: "LinkedIn", href: "#" },
    { icon: Github, label: "GitHub", href: "#" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6"
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-400 font-medium">
              Get In Touch
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Contact{" "}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Us
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Have a question, suggestion, or just want to say hello? We'd love to
            hear from you.
          </motion.p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Contact Information
                </h2>
                <p className="text-slate-400">
                  Fill out the form and we'll get back to you within 24 hours.
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                      <item.icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">{item.label}</p>
                      <p className="text-white whitespace-pre-line group-hover:text-amber-400 transition-colors">
                        {item.value}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <GlassCard className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-300">Name *</Label>
                      <GoldInput
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-300">Email *</Label>
                      <GoldInput
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-slate-300">Subject</Label>
                    <GoldInput
                      id="subject"
                      name="subject"
                      type="text"
                      autoComplete="off"
                      placeholder="What's this about?"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-slate-300">Message *</Label>
                    <GoldTextarea
                      id="message"
                      name="message"
                      autoComplete="off"
                      placeholder="Tell us what's on your mind..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                    />
                  </div>

                  <GoldButton
                    type="submit"
                    size="lg"
                    loading={loading}
                    className="w-full sm:w-auto"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </GoldButton>
                </form>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden h-[400px] bg-slate-800"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.25280949924!2d-74.11976373946229!3d40.697403441901946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1650000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{
                border: 0,
                filter: "invert(90%) hue-rotate(180deg) grayscale(50%)",
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
