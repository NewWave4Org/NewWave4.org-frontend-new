import { render, screen } from '@testing-library/react';
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
    expect(screen.getAllByText('City 2').length).toBeGreaterThan(0);
    expect(screen.getByAltText('Member 2')).toBeInTheDocument();
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

    // One link per breakpoint (in-photo footer md+, info row below md),
    // both for member 1; member 2 has none.
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    for (const link of links) {
      expect(link).toHaveAttribute('href', 'https://facebook.com/member1');
      expect(link).toHaveAttribute('target', '_blank');
    }
  });

  it('uses 2 columns on phones, 4 on tablet, 6 on desktop', () => {
    render(<Team ourTeam={[member(1)]} />);

    expect(screen.getByRole('list')).toHaveClass(
      'grid-cols-2',
      'sm:grid-cols-4',
      'lg:grid-cols-6',
    );
  });

  it('shows full location and role as text under the name on touch', () => {
    render(<Team ourTeam={[member(1)]} />);

    // jsdom renders both breakpoints: one location sits in the desktop-only
    // hover footer inside the photo, one in the phone info row under the role.
    const locations = screen.getAllByText('City 1');
    const outside = locations.filter(
      el => el.closest('[data-testid="member-photo"]') === null,
    );
    expect(outside).toHaveLength(1);
    expect(outside[0]).not.toHaveClass('truncate');
    expect(outside[0].closest('.md\\:hidden')).not.toBeNull();

    const inside = locations.find(
      el => el.closest('[data-testid="member-photo"]') !== null,
    )!;
    expect(inside.closest('.member-card__footer')).toHaveClass('max-md:hidden');

    expect(screen.getByText('Role 1')).toHaveClass('line-clamp-3');
  });

  it('social link is a 44px target outside the photo', () => {
    render(
      <Team
        ourTeam={[
          member(1, {
            socialMediaUrl: 'https://facebook.com/member1',
            typeSocialMedia: '2',
          }),
        ]}
      />,
    );

    const outside = screen
      .getAllByRole('link')
      .filter(el => el.closest('[data-testid="member-photo"]') === null);
    expect(outside).toHaveLength(1);
    expect(outside[0]).toHaveClass('min-h-11', 'min-w-11');
    expect(outside[0]).toHaveAttribute('href', 'https://facebook.com/member1');
  });

  it('long name and role wrap', () => {
    const longName = 'Iryna Borshchevska-Rozdolska-Kovalenkova'; // 40 chars
    const longRole =
      'Director, Head of the Pittsburgh, Pennsylvania and Cleveland, Ohio regional chapters, 2024';
    expect(longName).toHaveLength(40);
    expect(longRole).toHaveLength(90);
    render(
      <Team
        ourTeam={[
          member(1, {
            sectionTitleENG: longName,
            sectionPositionENG: longRole,
          }),
        ]}
      />,
    );

    expect(screen.getByRole('heading', { name: longName })).toHaveClass(
      'break-words',
    );
    const role = screen.getByText(longRole);
    expect(role).toHaveClass('line-clamp-3');
    expect(role).not.toHaveClass('line-clamp-1');
    expect(role).not.toHaveClass('line-clamp-2');
  });

  it('no social link and no location', () => {
    const { container } = render(
      <Team
        ourTeam={[
          member(1, {
            socialMediaUrl: '',
            sectionLocationENG: '',
          }),
        ]}
      />,
    );

    expect(screen.queryAllByRole('link')).toHaveLength(0);
    expect(container.querySelector('[data-testid="member-info"]')).toBeNull();
    expect(
      container.querySelector('[data-testid="member-location"]'),
    ).toBeNull();
  });
});
