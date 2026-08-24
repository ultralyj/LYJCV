import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContactIcons } from './ContactIcons';
import { profileFixture } from '../test/fixtures';

describe('ContactIcons', () => {
  it('renders links for each contact', () => {
    render(<ContactIcons contacts={profileFixture.contacts} />);
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/jane',
    );
  });

  it('renders a WeChat button that opens a QR modal', async () => {
    const contacts = [
      { type: 'wechat' as const, label: 'WeChat', href: '#', qrcode: '/qr.png' },
    ];
    render(<ContactIcons contacts={contacts} />);
    const btn = screen.getByRole('button', { name: /wechat/i });
    await userEvent.click(btn);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByAltText('WeChat QR code')).toHaveAttribute('src', '/qr.png');
  });

  it('copies email to clipboard and shows confirmation', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const contacts = [{ type: 'email' as const, label: 'Email', href: 'jane@example.com' }];
    render(<ContactIcons contacts={contacts} />);
    await userEvent.click(screen.getByRole('button', { name: /email/i }));
    expect(writeText).toHaveBeenCalledWith('jane@example.com');
    expect(await screen.findByText(/copied/i)).toBeInTheDocument();
  });
});
