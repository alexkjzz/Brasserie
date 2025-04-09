'use client';

import React from 'react';

interface HeaderProps {
title: string;
}

export default function Header({ title }: HeaderProps) {
return (
    <header className="w-full bg-[var(--header-bg)] text-[var(--header-text)] py-6 shadow-md">
    <h1 className="text-3xl font-bold text-center">{title}</h1>
    </header>
);
}