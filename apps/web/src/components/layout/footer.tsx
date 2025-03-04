import Link from "next/link";
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";

export function Footer() {
  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Youtube, href: "https://youtube.com", label: "Youtube" },
  ];

  const footerLinks = [
    {
      title: "About",
      links: [
        { href: "/about", label: "About Us" },
        { href: "/contact", label: "Contact Us" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/terms", label: "Terms of Service" },
        { href: "/privacy", label: "Privacy Policy" },
      ],
    },
    {
      title: "Advertisers",
      links: [
        { href: "/advertise", label: "Advertise on KwikDeals" },
      ],
    },
  ];

  return (
    <footer className="mt-auto border-t bg-background">
      <div className="container py-3">
        {/* Grid layout for footer sections */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Social Media Section */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Follow Us</h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary"
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Other Footer Sections */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-sm font-semibold">{section.title}</h4>
              <ul className="space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className="transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright Notice */}
        <div className="mt-2 border-t pt-2 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} KwikDeals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}