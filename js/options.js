;(() => {
  document.addEventListener('DOMContentLoaded', (event) => {
    const username = document.getElementById('username')
        , save     = document.getElementById('save')
        , port     = chrome.extension.connect()

    username.value = localStorage.getItem('ghUsername')

    save.onclick = function () {
      if (username.value) {
        port.postMessage(username.value)
      }
    }
  })
})()
