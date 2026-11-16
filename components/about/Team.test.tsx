import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Team, { ourTeamProps } from './Team';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

// Force the "no IntersectionObserver" path so cards render visible.
vi.mock('@/utils/hooks/useInView', () => ({
  useInView: () => ({ ref: vi.fn(), inView: true }),
}));

const member = (
  n: number,
  overrides: Partial<ourTeamProps> = {},
): ourTeamProps => ({
  id: `m${n}`,
  contentBlockType: 'OUR_TEAM',
  files: [`/photos/${n}.webp`],
  sectionTitleENG: `Member ${n}`,
  sectionTitleUA: `Член ${n}`,
  sectionPositionENG: `Role ${n}`,
  sectionPositionUA: `Роль ${n}`,
  sectionLocationENG: `City ${n}`,
  sectionLocationUA: `Місто ${n}`,
  socialMediaUrl: '',
  typeSocialMedia: '',
  ...overrides,
});

describe('Team', () => {
  it('renders one card per member with name, role and location', () => {
    render(<Team ourTeam={[member(1), member(2), member(3)]} />);

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(
      screen.getByRole('heading', { name: 'Member 2' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Role 2')).toBeInTheDocument();
    expect(screen.getByText('City 2')).toBeInTheDocument();
    expect(screen.getByAltText('Member 2')).toBeInTheDocument();
  });

  it('tapping the photo slides the location banner up, and tapping again hides it', () => {
    const { container } = render(
      <Team
        ourTeam={[
          member(1, {
            socialMediaUrl: 'https://facebook.com/member1',
            typeSocialMedia: '2',
          }),
        ]}
      />,
    );

    const footer = container.querySelector('.member-card__footer');
    expect(footer).not.toHaveClass('max-md:hidden');
    expect(footer).toContainElement(screen.getByText('City 1'));
    expect(footer).not.toHaveAttribute('data-open');

    fireEvent.click(screen.getByAltText('Member 1'));
    expect(footer).toHaveAttribute('data-open');

    // Following the social link must not close the banner.
    fireEvent.click(screen.getByRole('link'));
    expect(footer).toHaveAttribute('data-open');

    fireEvent.click(screen.getByAltText('Member 1'));
    expect(footer).not.toHaveAttribute('data-open');
  });

  it('marks the section as in view so the entrance animation can run', () => {
    const { container } = render(<Team ourTeam={[member(1)]} />);

    expect(container.querySelector('section.team-grid')).toHaveClass(
      'is-inview',
    );
    expect(container.querySelector('.team-grid__item')).toHaveStyle({
      '--i': '0',
    });
  });

  it('links to the social profile only when a URL is set', () => {
    render(
      <Team
        ourTeam={[
          member(1, {
            socialMediaUrl: 'https://facebook.com/member1',
            typeSocialMedia: '2', // Facebook, see data/projects/typeSocialMediaList
          }),
          member(2),
        ]}
      />,
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://facebook.com/member1');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
