import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Sparkles,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from "lucide-react";
import { GoldInput } from "../ui/GoldInput";
import GoldButton from "../ui/GoldButton";

export default function Footer() {
  return (
    <footer className="relative bg-slate-900 border-t border-slate-800">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link
              to={createPageUrl("Home")}
              className="flex items-center gap-2 mb-6"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-slate-900" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Luxe Blog
              </span>
            </Link>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Discover stories, ideas, and expertise from the world's best
              writers and thinkers.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", path: "Home" },
                { name: "Blog", path: "BlogListing" },
                { name: "About Us", path: "About" },
                { name: "Contact", path: "Contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={createPageUrl(link.path)}
                    className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-6">Legal</h3>
            <ul className="space-y-3">
              {[
                { name: "Privacy Policy", path: "Privacy" },
                { name: "Terms & Conditions", path: "Terms" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={createPageUrl(link.path)}
                    className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-4 h-4 opacity-0 -ml-6 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-white font-semibold mt-8 mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-slate-400">
                <Mail className="w-4 h-4 text-amber-500" />
                hello@luxeblog.com
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <Phone className="w-4 h-4 text-amber-500" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-start gap-3 text-slate-400">
                <MapPin className="w-4 h-4 text-amber-500 mt-1" />
                123 Luxury Ave, Suite 100
                <br />
                New York, NY 10001
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-6">Stay Updated</h3>
            <p className="text-slate-400 mb-4">
              Subscribe to our newsletter for the latest posts and updates.
            </p>
            <div className="space-y-3">
              <GoldInput
                type="email"
                placeholder="Enter your email"
                className="bg-slate-800/80"
              />
              <GoldButton className="w-full">Subscribe</GoldButton>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Luxe Blog. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm">
            Crafted with <span className="text-amber-500">♥</span> for the
            modern web
          </p>
        </div>
      </div>
    </footer>
  );
}
