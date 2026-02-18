import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import {
  Sparkles,
  Users,
  BookOpen,
  Award,
  Heart,
  Target,
  Lightbulb,
  Globe,
  ArrowRight,
} from "lucide-react";
import GoldButton from "../components/ui/GoldButton";
import GlassCard from "../components/ui/GlassCard";

export default function About() {
  const team = [
    {
      name: "Alexandra Chen",
      role: "Founder & Editor",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    },
    {
      name: "Marcus Johnson",
      role: "Lead Writer",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    },
    {
      name: "Sofia Rodriguez",
      role: "Creative Director",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    },
    {
      name: "David Kim",
      role: "Tech Editor",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    },
  ];

  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "We constantly push boundaries to bring you fresh perspectives and cutting-edge content.",
    },
    {
      icon: Heart,
      title: "Passion",
      description:
        "Every article is crafted with love and dedication by writers who truly care.",
    },
    {
      icon: Target,
      title: "Quality",
      description:
        "We never compromise on the quality of our content. Excellence is our standard.",
    },
    {
      icon: Globe,
      title: "Inclusivity",
      description:
        "We welcome diverse voices and perspectives from around the world.",
    },
  ];

  const stats = [
    { value: "500+", label: "Articles Published" },
    { value: "50K+", label: "Monthly Readers" },
    { value: "100+", label: "Expert Writers" },
    { value: "25+", label: "Countries Reached" },
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
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-400 font-medium">About Us</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Stories That{" "}
            <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              Matter
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            We're on a mission to deliver exceptional content that informs,
            inspires, and empowers our readers to think differently about the
            world around them.
          </motion.p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our Story
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full mb-6" />
              <div className="space-y-4 text-slate-400 leading-relaxed">
                <p>
                  Founded in 2020, Luxe Blog emerged from a simple belief: that
                  quality content can change lives. What started as a small
                  passion project has grown into a thriving platform reaching
                  thousands of readers worldwide.
                </p>
                <p>
                  Our team of dedicated writers, editors, and creators work
                  tirelessly to bring you stories that matter. From in-depth
                  analysis to inspiring narratives, we cover topics that
                  resonate with our diverse audience.
                </p>
                <p>
                  Today, we're proud to be one of the leading voices in digital
                  publishing, setting new standards for excellence and
                  authenticity in online content.
                </p>
              </div>
              <div className="mt-8">
                <Link to={createPageUrl("BlogListing")}>
                  <GoldButton>
                    Explore Our Content
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </GoldButton>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-purple-500/20 rounded-3xl blur-xl" />
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                alt="Our team"
                className="relative rounded-2xl w-full h-[400px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our Values
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              These core principles guide everything we do and shape the content
              we create.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6 h-full text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-amber-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-slate-400 text-sm">{value.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              The brilliant minds behind the content you love.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative rounded-2xl overflow-hidden mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                </div>
                <h3 className="text-lg font-bold text-white">{member.name}</h3>
                <p className="text-amber-400">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 rounded-3xl blur-xl" />
            <div className="relative rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-8 md:p-12">
              <Award className="w-12 h-12 text-amber-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Want to Join Our Team?
              </h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                We're always looking for talented writers, editors, and
                creators. If you're passionate about quality content, we'd love
                to hear from you.
              </p>
              <Link to={createPageUrl("Contact")}>
                <GoldButton size="lg">
                  Get In Touch
                  <ArrowRight className="w-5 h-5 ml-2" />
                </GoldButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
