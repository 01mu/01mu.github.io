function isEmpty(obj) {
  for (var key in obj) if(obj.hasOwnProperty(key)) return false
  return true
}

function commas(x) {
    if (x == null) return '-'

    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function since(date) {
    var seconds = Math.floor((new Date() /1000  - date))
    var interval = Math.floor(seconds / 31536000)

    if (interval > 1) return interval + " years ago"
    interval = Math.floor(seconds / 2592000)
    if (interval > 1) return interval + " months ago"
    interval = Math.floor(seconds / 86400)
    if (interval > 1) return interval + " days ago"
    interval = Math.floor(seconds / 3600)
    if (interval > 1) return interval + " hours ago"
    interval = Math.floor(seconds / 60)
    if (interval > 1) return interval + " minutes ago"
    return Math.floor(seconds) + " seconds ago"
}

function numWord(labelValue) {
  return Math.abs(Number(labelValue)) >= 1.0e+9
    ? (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
    : Math.abs(Number(labelValue)) >= 1.0e+6
    ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
    : Math.abs(Number(labelValue)) >= 1.0e+3
    ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"
    : Math.abs(Number(labelValue))
}

function getNavbar(dest) {
  var nav = {'portfolio': 'navpad nav-link', 'performers': 'navpad nav-link',
    'coins': 'navpad nav-link', 'heatmap': 'navpad nav-link',
    'mentions': 'navpad nav-link dropdown-toggle',
    'news': 'navpad nav-link' }

  if (dest != 'mentions') nav[dest] = 'navpad nav-link active'
  else nav[dest] = 'navpad nav-link dropdown-toggle active'

  return nav
}

function nf(text, val) {
  return text + numWord(parseFloat(val).toFixed(2))
}

function navbarInfo(nv) {
  if (navInfo.length == 0) {
    var bizLimit = localStorage.getItem('biz_rank')
    if (bizLimit == null) bizLimit = 50

    var i = {}

    $.getJSON('https://01mu.bitnamiapp.com/crypto/info/' + bizLimit, (json) => {
      json['info'].forEach((element) => {
          i[element.input_key] = element.input_value
      })

      nv[0] = nf('<span class="figure">◾Market Cap:&nbsp;</span>$',
        i.total_market_cap)
      nv[1] = nf('<span class="figure">◾24 Hour Volume:&nbsp;</span>$',
        i.total_volume_24h)
      nv[2] = nf('<span class="figure">◾BTC Dominance:&nbsp;</span>',
        i.btc_dominance) + '%'

      nv[3] = '<span class="figure">◾/biz/:&nbsp;</span>' +
        json['biz'][0].symbol + ': ' + json['biz'][0].total + ' | ' +
        json['biz'][1].symbol + ': ' + json['biz'][1].total + ' | ' +
        json['biz'][2].symbol + ': ' + json['biz'][2].total

      navInfo = nv
    })
  } else for (i in navInfo) nv[i] = navInfo[i]
}

function timeConverter(UNIX_timestamp){
  const a = new Date(UNIX_timestamp * 1000)

  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

  const year = a.getFullYear()
  const month = months[a.getMonth()]
  const date = a.getDate()
  const hour = a.getHours()
  const min = a.getMinutes()
  const sec = a.getSeconds()
  const time = date + ' ' + month + ' ' + year

  return time
}

function getTimeString(str) {
  const date = new Date(str * 1000)
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const hour = date.getHours()
  const min = date.getMinutes()

  return month + '/' + day + '/' + year
}

