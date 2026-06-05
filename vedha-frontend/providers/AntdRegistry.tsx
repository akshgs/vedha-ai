'use client';

import React, { useRef, useState } from 'react';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { useServerInsertedHTML } from 'next/navigation';

export default function AntdRegistry({ children }: { children: React.ReactNode }) {
  const cache = useRef(createCache());
  const [isInserted, setIsInserted] = useState(false);

  useServerInsertedHTML(() => {
    // avoid duplicate insertion
    if (isInserted) {
      return null;
    }
    setIsInserted(true);
    return (
      <style
        id="antd"
        dangerouslySetInnerHTML={{ __html: extractStyle(cache.current, true) }}
      />
    );
  });

  return <StyleProvider cache={cache.current}>{children}</StyleProvider>;
}
