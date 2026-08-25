import { useEffect, useRef, useState } from 'react';
import type { ContactLink } from '../types';
import { Modal } from './Modal';

interface ContactIconsProps {
  contacts: ContactLink[];
}

export function ContactIcons({ contacts }: ContactIconsProps) {
  const [wechatOpen, setWechatOpen] = useState(false);
  const [wechatQr, setWechatQr] = useState<string | undefined>();
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailAddress, setEmailAddress] = useState<string | undefined>();
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const copyEmail = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
    } catch {
      window.location.href = `mailto:${address}`;
      return;
    }
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="profile-links">
      {contacts.map((c) => {
        if (c.type === 'email') {
          return (
            <button
              key={c.label}
              type="button"
              className={`profile-link profile-link-${c.type}`}
              onClick={() => {
                setEmailAddress(c.href);
                setEmailOpen(true);
              }}
            >
              {c.label}
            </button>
          );
        }
        if (c.type === 'wechat') {
          return (
            <button
              key={c.label}
              type="button"
              className="profile-link profile-link-wechat"
              onClick={() => {
                setWechatQr(c.qrcode);
                setWechatOpen(true);
              }}
            >
              {c.label}
            </button>
          );
        }
        const isExternal = c.href.startsWith('http');
        return (
          <a
            key={c.label}
            href={c.href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className={`profile-link profile-link-${c.type}`}
          >
            {c.label}
          </a>
        );
      })}

      <Modal
        open={emailOpen}
        onClose={() => setEmailOpen(false)}
        title="Contact via Email"
      >
        {emailAddress && (
          <div className="email-modal-body">
            <p className="email-modal-subtitle">
              Click the address to copy it to your clipboard.
            </p>
            <button
              type="button"
              className="email-row"
              onClick={() => copyEmail(emailAddress)}
            >
              <span className="email-address">{emailAddress}</span>
              <span className="email-copy">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        )}
      </Modal>

      <Modal
        open={wechatOpen}
        onClose={() => setWechatOpen(false)}
        title="WeChat"
      >
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
