const createCvc = (res) => {
  const allHits = document.querySelectorAll('.search-list-name-address')
  const table = document.querySelector('#datatable')
  allHits.forEach(val => {
    const tr = document.createElement('tr')
    const td = document.createElement('td')
    td.innerText = val.innerText
    table.appendChild(tr)
    tr.appendChild(td)
  })
  document.querySelector('#download-btn').click()
  document.querySelector('#loading').style.display = 'none'
}

const handleRes = (res) => {
  const ratsitEl = document.querySelector('#mock-ratsit-page')
  ratsitEl.innerHTML = res
  createCvc()
}

const fetchUrl = (url) => {
  fetch(`https://cors-anywhere.herokuapp.com/${url}`)
    .then(res => res.text())
    .then(data => {
      handleRes(data)
    })
}

const getLink = () => {
  const cvcBtn = document.querySelector('#cvc-btn')
  console.log(cvcBtn)
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