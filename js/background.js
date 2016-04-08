(() => {
  chrome.extension.onConnect.addListener((port) => {
    port.onMessage.addListener((msg) => {
      localStorage.setItem('ghUsername', msg);
    });
  });
})();
