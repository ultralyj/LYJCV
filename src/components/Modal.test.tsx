import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders children when open', () => {
    render(
      <Modal open onClose={vi.fn()} title="Test">
        <p>Modal content</p>
      </Modal>,
    );
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('calls onClose when overlay is clicked', async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Test">
        <p>content</p>
      </Modal>,
    );
    await userEvent.click(screen.getByTestId('modal-overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Test">
        <p>content</p>
      </Modal>,
    );
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders nothing when closed', () => {
    const { container } = render(
      <Modal open={false} onClose={vi.fn()} title="Test">
        <p>hidden</p>
      </Modal>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
