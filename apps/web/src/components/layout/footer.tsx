import Link from "next/link";

export function Footer() {
  const socialLinks = [
    { href: "https://instagram.com/kwikdeals", label: "Instagram" },
    { href: "https://x.com/kwikdeals", label: "Twitter/X" },
    { href: "https://facebook.com/kwikdeals", label: "Facebook" },
    { href: "https://youtube.com/kwikdeals", label: "Youtube" },
  ];

  const footerLinks = [
    {
      title: "About",
      links: [
        { href: "/info/about", label: "About Us" },
        { href: "/info/contact", label: "Contact Us" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/info/terms", label: "Terms of Service" },
        { href: "/info/privacy", label: "Privacy Policy" },
        { href: "/info/rules", label: "Community Rules" },
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