import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import HistoryFormation from './HistoryFormation';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

vi.mock('@/utils/hooks/useInView', () => ({
  useInView: () => ({ ref: vi.fn(), inView: true }),
}));

vi.mock('../TextEditor/utils/convertDraftToHTML', () => ({
  convertDraftToHTML: (state: { text: string } | undefined) =>
    state ? `<p>${state.text}</p>` : '',
}));

const event = (year: string, title: string, text: string) => ({
  year,
  translatable_text_title: title,
  translatable_text_text: text,
  translatable_text_editorState: { text },
});

const events = [
  event('2006', 'Beginning', 'The first meeting of representatives'),
  event('2007', 'Presentation', 'Presentation of the organization'),
];

// Each milestone has two toggles (year + dot) that control the same panel.
const togglesFor = (year: string) =>
  screen.getAllByRole('button', { name: new RegExp(year) });

describe('HistoryFormation', () => {
  it('renders nothing when there are no events', () => {
    const { container } = render(<HistoryFormation ourTimeLine={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('starts with every description collapsed and only year + title visible', () => {
    render(<HistoryFormation ourTimeLine={events} />);

    expect(screen.getByText('Beginning')).toBeInTheDocument();
    for (const toggle of screen.getAllByRole('button')) {
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
    }
    expect(
      screen
        .getByText('The first meeting of representatives')
        .closest('[aria-hidden]'),
    ).toHaveAttribute('aria-hidden', 'true');
  });

  it('unfolds a description when its year is pressed and folds it on the next press', async () => {
    render(<HistoryFormation ourTimeLine={events} />);
    const [year, dot] = togglesFor('2006');

    await userEvent.click(year);
    expect(year).toHaveAttribute('aria-expanded', 'true');
    expect(dot).toHaveAttribute('aria-expanded', 'true');
    expect(
      screen
        .getByText('The first meeting of representatives')
        .closest('[aria-hidden]'),
    ).toHaveAttribute('aria-hidden', 'false');

    await userEvent.click(dot);
    expect(year).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles milestones independently', async () => {
    render(<HistoryFormation ourTimeLine={events} />);

    await userEvent.click(togglesFor('2006')[0]);
    await userEvent.click(togglesFor('2007')[0]);

    expect(togglesFor('2006')[0]).toHaveAttribute('aria-expanded', 'true');
    expect(togglesFor('2007')[0]).toHaveAttribute('aria-expanded', 'true');
  });

  it('points each toggle at its own panel', () => {
    render(<HistoryFormation ourTimeLine={events} />);
    const [year, dot] = togglesFor('2006');

    const panelId = year.getAttribute('aria-controls');
    expect(panelId).toBeTruthy();
    expect(dot).toHaveAttribute('aria-controls', panelId);
    expect(document.getElementById(panelId!)).toHaveTextContent(
      'The first meeting of representatives',
    );
  });

  it('makes the whole year row one 44px button on phones', () => {
    render(<HistoryFormation ourTimeLine={events} />);
    const dot = screen.getByRole('button', { name: '2006 — Beginning' });
    const year = screen.getByRole('button', { name: '2006' });

    // The dot toggle stretches over the full year row below md.
    expect(dot).toHaveClass('max-md:inset-x-0', 'max-md:min-h-11');
    // The year itself is ~28px on phones and never shorter than 44px.
    expect(year).toHaveClass('max-md:text-[28px]', 'max-md:min-h-11');
  });
});
