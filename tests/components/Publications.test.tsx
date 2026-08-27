import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Publications } from '../../src/components/Publications';
import { publications } from '../../src/data/publications';

describe('Publications', () => {
  it('renders the heading with total count, legend and all papers', () => {
    render(<Publications publications={publications} />);
    expect(screen.getByText('Publications')).toBeInTheDocument();
    expect(
      screen.getByLabelText('total publications'),
    ).toHaveTextContent(String(publications.length));
    expect(
      screen.getByText(/denotes equal contribution/i),
    ).toBeInTheDocument();
    publications.forEach((p) => {
      expect(screen.getByText(p.title)).toBeInTheDocument();
    });
  });

  it('filters by the Selected topic', async () => {
    render(<Publications publications={publications} />);
    await userEvent.click(
      screen.getByRole('button', { name: /selected/i }),
    );
    const selectedTitles = publications
      .filter((p) => p.selected)
      .map((p) => p.title);
    const otherTitles = publications
      .filter((p) => !p.selected)
      .map((p) => p.title);
    selectedTitles.forEach((t) =>
      expect(screen.getByText(t)).toBeInTheDocument(),
    );
    otherTitles.forEach((t) =>
      expect(screen.queryByText(t)).not.toBeInTheDocument(),
    );
  });

  it('filters by a tag category label', async () => {
    render(<Publications publications={publications} />);
    await userEvent.click(
      screen.getByRole('button', { name: /simulation/i }),
    );
    expect(screen.getByText(/TacMagPie/)).toBeInTheDocument();
    expect(screen.queryByText(/FTFNet/)).not.toBeInTheDocument();
  });
});
