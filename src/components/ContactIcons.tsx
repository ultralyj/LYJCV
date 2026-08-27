import { useEffect, useRef, useState } from 'react';
import type { ContactLink } from '../types';
import { Modal } from './Modal';
import { withBase } from '../utils/asset';

interface ContactIconsProps {
  contacts: ContactLink[];
}

interface EmailEntry {
  label?: string;
  address: string;
}

export function ContactIcons({ contacts }: ContactIconsProps) {
  const [wechatOpen, setWechatOpen] = useState(false);
  const [wechatQr, setWechatQr] = useState<string | undefined>();
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailAddresses, setEmailAddresses] = useState<EmailEntry[]>([]);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
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
    setCopiedAddress(address);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopiedAddress(null), 1500);
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
                setEmailAddresses(
                  c.addresses && c.addresses.length > 0
                    ? c.addresses
                    : [{ address: c.href }],
                );
                setCopiedAddress(null);
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
            href={withBase(c.href)}
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
        {emailAddresses.length > 0 && (
          <div className="email-modal-body">
            <p className="email-modal-subtitle">
              Click an address to copy it to your clipboard.
            </p>
            {emailAddresses.map((entry) => (
              <button
                key={entry.address}
                type="button"
                className="email-row"
                onClick={() => copyEmail(entry.address)}
              >
                <span className="email-info">
                  {entry.label && (
                    <span className="email-label">{entry.label}</span>
                  )}
                  <span className="email-address">{entry.address}</span>
                </span>
                <span className="email-copy">
                  {copiedAddress === entry.address ? 'Copied!' : 'Copy'}
                </span>
              </button>
            ))}
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
            src={withBase(wechatQr)}
            alt="WeChat QR code"
            className="mx-auto h-96 w-96 max-w-full rounded object-contain"
          />
        )}
        <p className="wechat-modal-hint">Scan to add me on WeChat</p>
      </Modal>
    </div>
  );
}
