import Link from "next/link";
import { Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <h3 className="text-white font-bold text-lg">TEELI</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">Google Docs for 3D Rendering</p>
          </div>

          {/* Core Products */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm">Core Products</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  3D Viewer
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  Asset Library
                </Link>
              </li>
              <li>
                <Link href="/demo" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  Version Control
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  Collaboration
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-400 hover:text-white text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm">Connect</h4>
            <div className="flex gap-3">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                <Twitter className="size-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                <Linkedin className="size-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                <Github className="size-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-500 text-center md:text-left">
            © {new Date().getFullYear()} TEELI. All rights reserved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Link href="/privacy" className="text-sm text-zinc-500 hover:text-white transition-colors text-center">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-zinc-500 hover:text-white transition-colors text-center">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
