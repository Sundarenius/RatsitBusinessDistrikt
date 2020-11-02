const createCvc = (res) => {
  const allHits = document.querySelectorAll('.search-list-name-address')
  const table = document.querySelector('#datatable')
  const added = []
  const includes = (innerText.includes('AB') || innerText.includes('Aktiebolag') || innerText.includes('aktiebolag'))
  allHits.forEach(val => {
    const innerText = val.innerText.replace('AB', 'AB, ').replace('Aktiebolag', 'Aktiebolag, ')
    if (includes && !added.includes(innerText)) {
      const tr = document.createElement('tr')
      const td = document.createElement('td')
      td.innerText = innerText
      added.push(innerText)
      table.appendChild(tr)
      tr.appendChild(td)
    }
  })
  document.querySelector('#download-btn').click()
  document.querySelector('#loading').style.display = 'none'
}

const clearDiv = () => {
  const ratsitEl = document.querySelector('#mock-ratsit-page')
  const table = document.querySelector('#datatable')
  table.innerHTML = ''
  ratsitEl.innerHTML = ''
}

const handleRes = (res) => {
  const ratsitEl = document.querySelector('#mock-ratsit-page')
  ratsitEl.innerHTML = res
  createCvc()
}

const fetchUrl = async (url) => {
  clearDiv()
  const corsProxy = 'https://cors-anywhere.herokuapp.com/'
  const totalPages = document.querySelector('#total-pages').value ? Number(document.querySelector('#total-pages').value) : 1
  const allUrls = []

  for (let page = 1; page <= totalPages; page++) {
    let ratsitUrl = new URL(url)
    let params = ratsitUrl.searchParams
    params.set('page', page)
    ratsitUrl.search = params.toString()
    allUrls.push(new Promise(resolve => {
      fetch(`${corsProxy}${ratsitUrl.href}`)
      .then(res => resolve(res.text()))
    }))
  }

  const res = await Promise.all(allUrls)
  handleRes(res.join('<br />'), totalPages)
}

const getLink = () => {
  const cvcBtn = document.querySelector('#cvc-btn')
  cvcBtn.addEventListener('click', () => {
    document.querySelector('#loading').style.display = 'block'
    const ratsitUrl = document.querySelector('#ratsit-link').value
    fetchUrl(ratsitUrl)
  })
}

const start = () => {
  getLink()
}

window.onload = start

console.log('hellloooo')