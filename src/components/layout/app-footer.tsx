import Link from 'next/link';

export function AppFooter() {
  return (
    <footer className="bg-background py-10">
      <div className="mx-auto max-w-6xl px-10">
        {/* Top Section */}
        <div className="flex flex-col items-center justify-between md:flex-row">
          {/* Branding */}
          <div>
            <p className="text-2xl font-semibold text-foreground">CMS.</p>
            <p className="mt-2 text-muted-foreground">
              The open-source, minimal CMS for everyone.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="mt-6 flex space-x-6 md:mt-0">
            <Link
              href="/docs"
              className="text-muted-foreground hover:text-foreground"
            >
              Docs
            </Link>
            <Link
              href="https://github.com/your-repo"
              className="text-muted-foreground hover:text-foreground"
            >
              GitHub
            </Link>
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-border"></div>

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between text-muted-foreground md:flex-row">
          {/* Copyright */}
          <p>&copy; {new Date().getFullYear()} CMS. All rights reserved.</p>

          {/* Social Links */}
          <div className="mt-4 flex space-x-4 md:mt-0">
            <a
              href="https://twitter.com/your-handle"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.56a9.83 9.83 0 0 1-2.83.78 4.92 4.92 0 0 0 2.15-2.71c-.94.56-1.98.97-3.08 1.19A4.92 4.92 0 0 0 16.7 3c-2.72 0-4.92 2.2-4.92 4.92 0 .38.04.76.12 1.12A13.97 13.97 0 0 1 1.64 3.16a4.92 4.92 0 0 0-.67 2.48c0 1.71.87 3.22 2.2 4.1a4.92 4.92 0 0 1-2.23-.61v.06c0 2.4 1.7 4.4 3.94 4.84a4.92 4.92 0 0 1-2.22.08c.63 1.97 2.46 3.41 4.63 3.45A9.86 9.86 0 0 1 0 19.54a13.91 13.91 0 0 0 7.55 2.21c9.05 0 14-7.49 14-13.97 0-.21 0-.42-.01-.63A9.93 9.93 0 0 0 24 4.56z" />
              </svg>
            </a>
            <a
              href="https://github.com/your-repo"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 .296c-6.63 0-12 5.373-12 12 0 5.304 3.438 9.8 8.207 11.387.6.11.793-.26.793-.577v-2.234c-3.338.726-4.033-1.415-4.033-1.415-.546-1.387-1.333-1.754-1.333-1.754-1.089-.745.083-.729.083-.729 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.776.42-1.305.762-1.605-2.665-.305-5.466-1.333-5.466-5.932 0-1.31.467-2.381 1.236-3.221-.124-.304-.536-1.527.118-3.176 0 0 1.008-.322 3.3 1.23a11.505 11.505 0 0 1 6.002 0c2.292-1.552 3.3-1.23 3.3-1.23.656 1.649.244 2.872.12 3.176.772.84 1.235 1.911 1.235 3.221 0 4.608-2.803 5.624-5.475 5.921.432.372.823 1.104.823 2.222v3.293c0 .321.193.694.8.577 4.768-1.587 8.205-6.083 8.205-11.387 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
