import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Navbar } from './Navbar';
import type { CustomSection } from '../types';

const custom: CustomSection[] = [
  { id: 'hobbies', title: 'Hobbies', layout: 'list', items: [] },
];

describe('Navbar', () => {
  it('renders all fixed section links', () => {
    render(
      <Navbar theme="light" onToggleTheme={() => {}} nameEn="Jane Doe" customSections={[]} />,
    );
    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '#about');
    expect(screen.getByRole('link', { name: /publications/i })).toHaveAttribute(
      'href',
      '#publications',
    );
    expect(screen.getByRole('link', { name: /projects/i })).toHaveAttribute('href', '#projects');
  });

  it('appends custom section links', () => {
    render(
      <Navbar theme="light" onToggleTheme={() => {}} nameEn="Jane Doe" customSections={custom} />,
    );
    expect(screen.getByRole('link', { name: 'Hobbies' })).toHaveAttribute('href', '#hobbies');
  });

  it('renders the theme toggle button', () => {
    render(
      <Navbar theme="dark" onToggleTheme={() => {}} nameEn="Jane Doe" customSections={[]} />,
    );
    expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument();
  });
});
