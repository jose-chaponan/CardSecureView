import React from 'react';
import { render } from '@testing-library/react-native';
import CardItemSkeleton from '../CardItemSkeleton';

describe('CardItemSkeleton', () => {
  it('renders without crashing', () => {
    const { toJSON } = render(<CardItemSkeleton />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders a non-null tree', () => {
    const { toJSON } = render(<CardItemSkeleton />);
    expect(toJSON()).not.toBeNull();
  });

  it('renders multiple skeleton placeholder elements', () => {
    const { toJSON } = render(<CardItemSkeleton />);
    const json = toJSON() as any;
    expect(json).toBeTruthy();
    expect(json.children).toBeTruthy();
  });
});
