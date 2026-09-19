import { ArrowUpRight, Menu, X, Linkedin } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';

const navigation = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/work', label: 'Work' },
];

export function SiteShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="grain min-h-[100dvh] bg-background">
      <header className="relative z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <Link href="/" data-testid="link-logo" className="group flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground transition-transform group-hover:rotate-12">h</span>
            <span className="text-[15px] font-semibold tracking-[-.02em]">harbor<span className="text-accent">/</span>people</span>
          </Link>
          <nav className="hidden items-center gap-9 md:flex" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} data-testid={`link-nav-${item.label.toLowerCase()}`} className={`text-sm transition-colors hover:text-accent ${location === item.href ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
                {item.label}
              </Link>
            ))}
            <Link href="/contact" data-testid="link-nav-contact" className="group flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5">
              Start a conversation <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </nav>
          <button type="button" data-testid="button-menu" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)} className="grid h-10 w-10 place-items-center rounded-full border border-border md:hidden">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="absolute left-0 right-0 top-full border-b border-border bg-background px-5 py-5 shadow-xl md:hidden">
            <nav className="flex flex-col gap-1">
              {navigation.map((item) => <Link onClick={() => setMenuOpen(false)} key={item.href} href={item.href} data-testid={`link-mobile-${item.label.toLowerCase()}`} className="rounded-xl px-3 py-3 text-lg font-medium hover:bg-muted">{item.label}</Link>)}
              <Link onClick={() => setMenuOpen(false)} href="/contact" data-testid="link-mobile-contact" className="mt-3 rounded-xl bg-accent px-4 py-3 text-center font-semibold text-accent-foreground">Start a conversation</Link>
            </nav>
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_.7fr_.7fr]">
            <div>
              <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-sm font-bold text-accent-foreground">h</span><span className="text-[15px] font-semibold">harbor<span className="text-accent">/</span>people</span></div>
              <p className="mt-7 max-w-sm font-display text-3xl leading-[1.1] text-primary-foreground/95">Good work starts with people who feel looked after.</p>
            </div>
            <div><p className="eyebrow text-primary-foreground/50">Explore</p><div className="mt-5 grid gap-3">{[...navigation, { href: '/contact', label: 'Contact' }].map((item) => <Link key={item.href} href={item.href} data-testid={`link-footer-${item.label.toLowerCase()}`} className="w-fit text-sm text-primary-foreground/75 transition-colors hover:text-accent">{item.label}</Link>)}</div></div>
            <div><p className="eyebrow text-primary-foreground/50">Find us</p><p className="mt-5 text-sm leading-6 text-primary-foreground/75">London · New York<br />Working wherever good people are.</p><a href="mailto:hello@harborpeople.co" data-testid="link-footer-email" className="mt-4 inline-block text-sm text-accent hover:underline">hello@harborpeople.co</a></div>
          </div>
          <div className="mt-16 flex flex-col justify-between gap-4 border-t border-primary-foreground/15 pt-5 text-xs text-primary-foreground/50 sm:flex-row"><span>© 2025 Harbor People Studio</span><span className="flex items-center gap-2">People, thoughtfully <Linkedin className="h-3.5 w-3.5" /></span></div>
        </div>
      </footer>
    </div>
  );
}

export function PageIntro({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return <section className="mx-auto max-w-[1320px] px-5 pb-16 pt-16 sm:px-8 sm:pt-24 lg:px-12 lg:pb-24"><p className="eyebrow reveal text-accent">{eyebrow}</p><h1 data-testid="heading-page-title" className="reveal delay-1 mt-5 max-w-4xl font-display text-5xl leading-[.98] tracking-[-.045em] text-primary sm:text-7xl lg:text-[6.7rem]">{title}</h1>{children && <div className="reveal delay-2 mt-8 max-w-xl text-lg leading-7 text-muted-foreground">{children}</div>}</section>;
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="eyebrow text-accent">{children}</p>;
}

export function ArrowLink({ href, children, light = false }: { href: string; children: ReactNode; light?: boolean }) {
  return <Link href={href} data-testid={`link-arrow-${String(children).toLowerCase().replaceAll(' ', '-')}`} className={`group inline-flex items-center gap-2 border-b pb-2 text-sm font-semibold transition-colors ${light ? 'border-primary-foreground/40 text-primary-foreground hover:border-accent hover:text-accent' : 'border-primary/30 text-primary hover:border-accent hover:text-accent'}`}>{children}<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></Link>;
}