import 'webextension-polyfill';
import 'construct-style-sheets-polyfill';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { debounce } from 'lodash-es';
import { twind, config, cssom, observe, stringify } from './twind';
import { proxyStore } from '../app/proxyStore';
import Content from './Content';

proxyStore.ready().then(() => {
  const contentRoot = document.createElement('div');
  document.body.append(contentRoot);

  const shadowRoot = contentRoot.attachShadow({ mode: 'open' });
  const sheet = cssom(new CSSStyleSheet());

  if (navigator?.userAgent.includes('Firefox')) {
    const style = document.createElement('style');
    const debouncedSyncCss = debounce(() => {
      style.textContent += stringify(sheet.target);
    }, 100);
    const originalSheetInsert = sheet.insert;
    (sheet.insert as typeof originalSheetInsert) = (...params) => {
      originalSheetInsert(...params);
      debouncedSyncCss();
    };
    shadowRoot.appendChild(style);
  } else {
    shadowRoot.adoptedStyleSheets = [sheet.target];
  }

  const tw = twind(config, sheet);
  observe(tw, shadowRoot);

  const shadowWrapper = document.createElement('div');
  shadowRoot.appendChild(shadowWrapper);

  createRoot(shadowWrapper).render(
    <Provider store={proxyStore}>
      <Content />
    </Provider>
  );
});
