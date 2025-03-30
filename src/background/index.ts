import browser from 'webextension-polyfill';
import store, { initializeWrappedStore } from '../app/store';

initializeWrappedStore();

store.subscribe(() => {
  const state = store.getState();
  console.log('state', state);
});

// show welcome page on new install
browser.runtime.onInstalled.addListener(async (details) => {
  console.log('onInstalled', details);
});
