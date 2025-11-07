'use client';

import { ContentState } from 'draft-js';
import React from 'react';

interface LinkProps {
  children: React.ReactNode;
  contentState: ContentState;
  entityKey: string;
}

function Link({ contentState, entityKey, children }: LinkProps) {
  const { url } = contentState.getEntity(entityKey).getData();

  return (
    <a href={url} rel="noopener noreferrer" className="text-admin-600 underline inline">
      {children}
    </a>
  );
}

export default Link;
