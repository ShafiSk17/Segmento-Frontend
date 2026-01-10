'use client';

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { Search, Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function PulseNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const timeoutRef = useRef<number | undefined>(undefined);

    const handleSearchInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const query = e.target.value;
            setSearchQuery(query);

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            if (query.trim().length >= 2) {
                timeoutRef.current = window.setTimeout(() => {
                    router.push(`/pulse/search?q=${encodeURIComponent(query.trim())}`);
                    setIsSearchOpen(false);
                }, 500);
            }
        },
        [router]
    );

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/pulse/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery("");
        }
    };

    const handleSearchClose = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsSearchOpen(false);
        setSearchQuery("");
    };

    const navLinks = [
        { name: "Home", path: "/pulse" },
        { name: "AI", path: "/pulse/news?category=ai" },
        { name: "Data", path: "/pulse/news?category=data-security" },
        { name: "Security", path: "/pulse/news?category=cyber-security" },
        { name: "Blockchain", path: "/pulse/news?category=blockchain" },
        { name: "Cloud", path: "/pulse/news?category=cloud-computing" },
        { name: "Magazines", path: "/pulse/magazines" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
            <div className="container flex h-16 items-center justify-between">
                {/* Logo */}
                <Link href="/pulse" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
                        <span className="font-display text-lg font-bold text-white">
                            S
                        </span>
                    </div>
                    <span className="font-display text-xl font-bold">
                        Segmento<span className="text-blue-600">Pulse</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.path}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden lg:flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        {isSearchOpen ? (
                            <form
                                onSubmit={handleSearchSubmit}
                                className="flex items-center gap-2"
                            >
                                <Input
                                    type="search"
                                    placeholder="Search news..."
                                    className="w-64 h-9"
                                    value={searchQuery}
                                    onChange={handleSearchInput}
                                    autoFocus
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleSearchClose}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </form>
                        ) : (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsSearchOpen(true)}
                            >
                                <Search className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    <Button variant="outline" size="sm" asChild>
                        <Link href="/pulse/login">Login</Link>
                    </Button>

                    <Button size="sm" asChild>
                        <Link href="/pulse/register">Register</Link>
                    </Button>

                    <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
                        Subscribe
                    </Button>
                </div>

                {/* Mobile Buttons */}
                <div className="flex lg:hidden gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                    >
                        <Search className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X /> : <Menu />}
                    </Button>
                </div>
            </div>

            {/* Mobile Search */}
            {isSearchOpen && (
                <div className="lg:hidden border-t p-4">
                    <form onSubmit={handleSearchSubmit} className="flex gap-2">
                        <Input
                            type="search"
                            placeholder="Search news..."
                            value={searchQuery}
                            onChange={handleSearchInput}
                        />
                        <Button type="submit" variant="ghost" size="icon">
                            <Search />
                        </Button>
                    </form>
                </div>
            )}

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden border-t">
                    <nav className="container py-4 flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className="px-4 py-3 rounded-lg hover:bg-secondary"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="mt-4 pt-4 border-t flex flex-col gap-2">
                            <Button variant="outline" asChild>
                                <Link href="/pulse/login">
                                    <User className="h-4 w-4 mr-2" />
                                    Login
                                </Link>
                            </Button>
                            <Button asChild>
                                <Link href="/pulse/register">Register</Link>
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-700">Subscribe</Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
