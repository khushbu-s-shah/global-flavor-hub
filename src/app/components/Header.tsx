import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <header className="bg-green-300 shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link href="/" className="text-3xl font-bold text-white">
          Global Flavor Hub
        </Link>

        <nav>
          <ul className="flex space-x-8 items-center">
            <li>
              <Link
                href="/recipes/create-edit"
                className="items-center text-white hover:text-gray-300 transition-colors duration-300"
              >
                New Recipe
              </Link>
            </li>
            <li className="relative">
              <button className="text-white hover:text-gray-300 transition-colors duration-300">
                Categories
              </button>
              <ul className="absolute top-full left-0 bg-white shadow-lg py-2 rounded-md mt-1 cursor-pointer block">
                <li className="px-4 py-2 text-black">Pizza</li>
                <li className="px-4 py-2 text-black">Snacks</li>
              </ul>
            </li>

            <li className="relative">
              <button className="text-white hover:text-gray-300 transition-colors duration-300">
                Recipes
              </button>
              <ul className="absolute top-full left-0 bg-white shadow-lg py-2 rounded-md mt-1 cursor-pointer block">
                <li className="px-4 py-2 text-black">Uploaded</li>
                <li className="px-4 py-2 text-black">Saved</li>
              </ul>
            </li>

            <li>
              <SignedOut>
                <SignInButton>
                  <button className="items-center text-white hover:text-black transition-colors duration-300">
                    Sign in
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
