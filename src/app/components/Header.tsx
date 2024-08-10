'use client';
import {
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton,
    useUser
} from '@clerk/nextjs';
import Link from 'next/link';
import { CATEGORY } from '../constants/recipe.constants';
import { useState } from 'react';
import useClickOutside from '../hooks/useClickOutSide';
import { FaPizzaSlice, FaHamburger, FaUtensils, FaSignInAlt } from "react-icons/fa";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
    const user = useUser();
    const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
    const [recipeMenuOpen, setRecipeMenuOpen] = useState(false);

    const recipeMenuRef: any = useClickOutside(() => {
        setRecipeMenuOpen(false);
    });

    const categoryMenuRef: any = useClickOutside(() => {
        setCategoryMenuOpen(false);
    });

    return (
        <header className='bg-gray-900 shadow-md py-4 border-b-2 border-gray-300'>
            <div className='container mx-auto flex justify-between items-center px-4'>
                {/* Centered Title */}
                <div className='flex-grow text-center'>
                    <Link legacyBehavior href='/'>
                        <a className='text-4xl font-bold text-white' style={{ fontFamily: 'Playfair Display, serif', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)' }}>
                            GLOBAL <span style={{ fontFamily: 'Dancing Script, cursive', marginLeft: '5px', marginRight: '5px', color: 'gray' }}>FLAVOR</span> HUB
                        </a>
                    </Link>
                </div>

                {/* Navigation on the Right */}
                <nav className='flex space-x-8 items-center'>
                    <li>
                        <Link href='/recipes/create-edit' legacyBehavior>
                            <a className='text-white hover:text-gray-400 transition-colors duration-300 flex items-center'>
                                <FaUtensils className="mr-1" /> Add Recipe
                            </a>
                        </Link>
                    </li>
                    <li className='relative' ref={categoryMenuRef}>
                        <button
                            className='text-white hover:text-gray-400 transition-colors duration-300 flex items-center'
                            onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}>
                            <FaHamburger className="mr-1" /> Categories
                        </button>
                        <ul
                            className={`absolute top-full left-0 bg-white shadow-lg py-2 rounded-md mt-1 ${
                                categoryMenuOpen ? 'block' : 'hidden'}`}> 
                            {CATEGORY.map((category: string) => (
                                <li key={category} className='px-4 py-2'>
                                    <Link
                                        href={`/?category=${category}`}
                                        className='text-gray-800 hover:text-blue-500 transition-colors duration-300'>
                                        {category}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                    {user.isSignedIn && (
                        <li className='relative' ref={recipeMenuRef}>
                            <button
                                className='text-white hover:text-gray-400 transition-colors duration-300 flex items-center'
                                onClick={() => setRecipeMenuOpen(!recipeMenuOpen)}>
                                <FaUtensils className="mr-1" /> Recipes
                            </button>
                            <ul
                                className={`absolute top-full left-0 bg-white shadow-lg py-2 rounded-md mt-1 ${
                                    recipeMenuOpen ? 'block' : 'hidden' }`} >
                                <li className='px-4 py-2'>
                                    <Link
                                        href={`/recipes/my/all`} legacyBehavior >
                                        <a className='text-gray-800 hover:text-blue-500 transition-colors duration-300'>
                                            My Uploaded
                                        </a>
                                    </Link>
                                </li>
                                <li className='px-4 py-2'>
                                    <Link href={`/recipes/my/saved`} legacyBehavior>
                                        <a className='text-gray-800 hover:text-blue-500 transition-colors duration-300'>
                                            Saved
                                        </a>
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    )}
                    <li>
                        <SignedOut>
                            <SignInButton>
                                <button className='text-white hover:text-gray-400 transition-colors duration-300 flex items-center'>
                                    <FaSignInAlt className="mr-1" /> Sign in
                                </button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </li>
                </nav>
            </div>
        </header>
    );
};

export default Header;
