import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ContactIcons } from './ContactIcons';
import type { ContactLink } from '../types';

const contacts: ContactLink[] = [
  { type: 'email', label: 'Email', href: 'you@example.com' },
  { type: 'github', label: 'GitHub', href: 'https://github.com/you' },
  {
    type: 'wechat',
    label: 'WeChat',
    href: '#',
    qrcode: '/images/qrcode.png',
  },
];

describe('ContactIcons', () => {
  it('renders external links as anchor pills with the profile-link class', () => {
    render(<ContactIcons contacts={contacts} />);
    const github = screen.getByRole('link', { name: 'GitHub' });
    expect(github).toHaveAttribute('href', 'https://github.com/you');
    expect(github).toHaveClass('profile-link', 'profile-link-github');
  });

  it('opens the email modal when the email pill is activated', async () => {
    render(<ContactIcons contacts={contacts} />);
    await userEvent.click(screen.getByRole('button', { name: 'Email' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('you@example.com')).toBeInTheDocument();
  });

  it('opens the WeChat modal with the QR code', async () => {
    render(<ContactIcons contacts={contacts} />);
    await userEvent.click(screen.getByRole('button', { name: 'WeChat' }));
    const qr = screen.getByAltText('WeChat QR code');
    expect(qr).toHaveAttribute('src', '/images/qrcode.png');
  });
});
