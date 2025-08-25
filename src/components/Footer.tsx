
import { Heart, Mail, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Authentic Moments</h3>
            <p className="text-sm text-muted-foreground">
              60 seconds to real. No edits, no filters, just authentic moments.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-medium">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/capture" className="text-muted-foreground hover:text-foreground transition-colors">
                  Capture
                </a>
              </li>
              <li>
                <a href="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                  Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-medium">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="mailto:hello@authenticmoments.app" 
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Contact Us
                </a>
              </li>
              <li>
                <a 
                  href="mailto:support@authenticmoments.app" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Get Help
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h4 className="font-medium">Connect</h4>
            <div className="flex gap-4">
              {/* Disabled - wrong profile link */}
              {/* <a 
                href="https://bsky.app/profile/authenticmoments.bsky.social" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a> */}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-border/40">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Authentic Moments Digital LLC. Made with{" "}
              <Heart className="h-4 w-4 inline text-red-500" /> for authentic connections.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
