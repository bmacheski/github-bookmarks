$(() => {
  let username   = localStorage.getItem('ghUsername')
    , defaultUrl = `https://api.github.com/users/${username}/starred`
    , newUrl
    , numPages

  function parseHeader (linkStr) {
    let url

    if (linkStr) {
      let s = linkStr.split(',').map(rel => {
        return rel.split(';').map((item, idx) => {
          let hold = item.split(',')

          if (idx === 0) {
            if (!url) {
              url = hold[0].split('?page=')[0].replace('<', '').trim()
            }
            return hold[0].split('?page=')[1].replace('>', '')
          }
          if (idx === 1) {
            return hold[0].split('rel="')[1].replace(/\"/g, '')
          }
        })
      }).reduce((res, curr) => {
        res[curr[1]] = curr[0]
        return res
      }, {})

      return {
        url : url
        , o : s
      }
    }
  }

  function ghRequest (cb, num) {
    let ghUrl = newUrl ? `${newUrl}?page=${num}` : defaultUrl

    $.ajax({
      type  : 'GET'
      , url : ghUrl
    })
    .done((data, status, xhr) => {
      let link = xhr.getResponseHeader('Link')
        , res  = parseHeader(link)

      if (res && res.o) {
        numPages = res.o.last
        newUrl   = res.url
      }
      if (typeof(cb) === 'function') {
        cb(data)
      }
      if (typeof(num) === 'function') {
        num()
      }
    })
  }

  function paginate () {
    $('#pagination').pagination({
      itemsOnPage   : 30
      , pages       : numPages
      , cssStyle    : 'light-theme'
      , onPageClick : (num) => {
          let bookmarkList = $('#bookmarks')
          ghRequest(parseBookmarks, num)
        }
    })
  }

  function parseBookmarks (json) {
    let bookmarkList = $('#bookmarks')
    bookmarkList.empty()

    $.each(json, (i, el) => {
      bookmarkList.append(
        `<li class='title'>
          <a href="${json[i].html_url}">${json[i].name}</a>
          <p>${json[i].description}</p>
        </li>`
      )
    })
  }

  $('body').on('click', 'a', function() {
    chrome.tabs.create({ url: $(this).attr('href') })
    return false
  })

  if (username) {
    ghRequest(parseBookmarks, paginate)
  }
})
