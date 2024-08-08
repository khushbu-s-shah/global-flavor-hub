import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { FaPizzaSlice, FaHamburger, FaUtensils, FaSignInAlt } from "react-icons/fa";

export default function Header() {
  return (
    <header className="bg-gray-900 shadow-md py-4 border-b-2 border-gray-300">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex-grow text-center">
          <Link href="/" className="text-5xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' }}>
            GLOBAL <span style={{ fontFamily: 'Dancing Script, cursive', marginLeft: '5px', marginRight: '5px', color: 'gray' }}>FLAVOR</span> HUB
          </Link>
        </div>

        <nav>
          <ul className="flex space-x-8 items-center">
            <li>
              <Link
                href="/recipes/create-edit"
                className="text-white hover:text-gray-400 transition-colors duration-300 flex items-center"
              >
                <FaUtensils className="mr-1" /> New Recipe
              </Link>
            </li>
            <li className="relative group">
              <button className="text-white hover:text-gray-400 transition-colors duration-300 flex items-center">
                <FaHamburger className="mr-1" /> Categories
              </button>
              <ul className="absolute top-full left-0 bg-white shadow-lg py-2 rounded-md mt-1 hidden group-hover:block">
                <li className="px-4 py-2 text-black hover:bg-gray-100 flex items-center">
                  <FaPizzaSlice className="mr-1" /> Pizza
                </li>
                <li className="px-4 py-2 text-black hover:bg-gray-100">Snacks</li>
              </ul>
            </li>

            <li className="relative group">
              <button className="text-white hover:text-gray-400 transition-colors duration-300 flex items-center">
                <FaUtensils className="mr-1" /> Recipes
              </button>
              <ul className="absolute top-full left-0 bg-white shadow-lg py-2 rounded-md mt-1 hidden group-hover:block">
                <li className="px-4 py-2 text-black hover:bg-gray-100">Uploaded</li>
                <li className="px-4 py-2 text-black hover:bg-gray-100">Saved</li>
              </ul>
            </li>

            <li>
              <SignedOut>
                <SignInButton>
                  <button className="text-white hover:text-gray-400 transition-colors duration-300 flex items-center">
                    <FaSignInAlt className="mr-1" /> Sign in
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
