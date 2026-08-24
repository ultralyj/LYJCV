import { useEffect, useRef, useState } from 'react';
import type { ContactLink } from '../types';
import { Modal } from './Modal';

interface ContactIconsProps {
  contacts: ContactLink[];
}

const ICONS: Record<ContactLink['type'], string> = {
  email: '✉️',
  scholar: '📚',
  github: '💻',
  twitter: '🐦',
  wechat: '💬',
  cv: '📄',
  link: '🔗',
};

export function ContactIcons({ contacts }: ContactIconsProps) {
  const [wechatOpen, setWechatOpen] = useState(false);
  const [wechatQr, setWechatQr] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const handleEmail = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      window.location.href = `mailto:${address}`;
    }
  };

  return (
    <div className="relative flex flex-wrap gap-x-5 gap-y-2 text-sm">
      {contacts.map((c) => {
        if (c.type === 'email') {
          return (
            <button
              key={c.label}
              type="button"
              onClick={() => handleEmail(c.href)}
              className="text-accent hover:underline dark:text-accent-dark"
            >
              <span aria-hidden="true">{ICONS.email}</span> {c.label}
            </button>
          );
        }
        if (c.type === 'wechat') {
          return (
            <button
              key={c.label}
              type="button"
              onClick={() => {
                setWechatQr(c.qrcode);
                setWechatOpen(true);
              }}
              className="text-accent hover:underline dark:text-accent-dark"
            >
              <span aria-hidden="true">{ICONS.wechat}</span> {c.label}
            </button>
          );
        }
        return (
          <a
            key={c.label}
            href={c.href}
            target={c.href.startsWith('http') ? '_blank' : undefined}
            rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="text-accent hover:underline dark:text-accent-dark"
          >
            <span aria-hidden="true">{ICONS[c.type]}</span> {c.label}
          </a>
        );
      })}
      {copied && (
        <span
          role="status"
          className="absolute -bottom-6 left-0 rounded bg-slate-800 px-2 py-0.5 text-xs text-white dark:bg-slate-200 dark:text-slate-900"
        >
          Email copied!
        </span>
      )}
      <Modal open={wechatOpen} onClose={() => setWechatOpen(false)} title="WeChat">
        {wechatQr && (
          <img
            src={wechatQr}
            alt="WeChat QR code"
            className="mx-auto h-48 w-48 rounded object-contain"
          />
        )}
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-300">
          Scan to add me on WeChat
        </p>
      </Modal>
    </div>
  );
}
