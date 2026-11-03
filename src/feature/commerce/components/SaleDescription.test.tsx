/* eslint-disable testing-library/no-container, testing-library/no-node-access -- Sanitization tests must inspect forbidden tags and attributes. */
import { render, screen } from '@testing-library/react';

import SaleDescription from './SaleDescription';

const rich = (content: string) =>
  `<div data-snorose-sale-description="1">${content}</div>`;

describe('SaleDescription', () => {
  it('shows legacy HTML-like text and empty lines literally', () => {
    const { container } = render(
      <SaleDescription value={'기존 설명\n\n<strong>그대로 표시</strong>'} />
    );
    expect(
      screen.getByText('<strong>그대로 표시</strong>')
    ).toBeInTheDocument();
    expect(container.querySelector('strong')).toBeNull();
    expect(container.querySelectorAll('p')).toHaveLength(3);
  });
  it('renders the seller editor format including headings, lists and colors', () => {
    const { container } = render(
      <SaleDescription
        value={rich(
          '<h2>신청 안내</h2><p><strong>참여하세요</strong></p><ul><li><p><span style="color:red;background-color:yellow">학생증 지참</span></p></li></ul>'
        )}
      />
    );
    expect(
      screen.getByRole('heading', { name: '신청 안내' })
    ).toBeInTheDocument();
    expect(screen.getByText('참여하세요').tagName).toBe('STRONG');
    expect(screen.getByRole('listitem')).toHaveTextContent('학생증 지참');
    expect(container.querySelector('span')).toHaveStyle({
      color: 'red',
      backgroundColor: 'yellow',
    });
  });
  it('does not render executable HTML, embeds or unsafe links', () => {
    const { container } = render(
      <SaleDescription
        value={rich(
          '<script>alert(1)</script><img src="x" onerror="alert(1)"><iframe src="https://example.com"></iframe><a href="javascript:alert(1)" onclick="alert(1)">안내</a><p style="position:fixed">본문</p>'
        )}
      />
    );
    expect(
      container.querySelector(
        'script, img, iframe, [onclick], [onerror], [style]'
      )
    ).toBeNull();
    expect(screen.queryByRole('link')).toBeNull();
  });
  it('keeps valid web links safe in a new tab', () => {
    render(
      <SaleDescription
        value={rich('<a href="https://snorose.com">스노로즈</a>')}
      />
    );
    expect(screen.getByRole('link')).toHaveAttribute(
      'rel',
      'noopener noreferrer'
    );
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
  });
  it('does not add a blank description block when empty', () => {
    const { container } = render(<SaleDescription value={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});
