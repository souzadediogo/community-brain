import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-3">
              <h3 className="font-bold text-lg">Braintrust</h3>
              <p className="text-sm text-muted-foreground">AI-powered executive community for business leaders</p>
            </div>

            {/* Product */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">
                    Search
                  </Link>
                </li>
                <li>
                  <Link href="/threads/new" className="text-muted-foreground hover:text-foreground transition-colors">
                    Ask a Question
                  </Link>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Community</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors">
                    Your Profile
                  </Link>
                </li>
                <li>
                  <Link href="/bookmarks" className="text-muted-foreground hover:text-foreground transition-colors">
                    Bookmarks
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Guidelines
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2025 Braintrust. All rights reserved.</p>
            <p>Built with AI assistance for executive leaders</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
