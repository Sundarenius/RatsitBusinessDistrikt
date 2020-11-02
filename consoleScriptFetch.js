function download_table_as_csv(table_id, separator = ',') {
  // Select rows from table_id
  var rows = document.querySelectorAll('table#' + table_id + ' tr')
  // Construct csv
  var csv = [];
  for (var i = 0; i < rows.length; i++) {
      var row = [], cols = rows[i].querySelectorAll('td, th')
      for (var j = 0; j < cols.length; j++) {
          // Clean innertext to remove multiple spaces and jumpline (break csv)
          var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')
          // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
          data = data.replace(/"/g, '""');
          // Push escaped string
          row.push('"' + data + '"');
      }
      csv.push(row.join(separator));
  }
  var csv_string = csv.join('\n');
  // Download it
  var filename = 'export_' + table_id + '_' + new Date().toLocaleDateString() + '.csv';
  var link = document.createElement('a');
  link.style.display = 'none';
  link.setAttribute('target', '_blank');
  link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const createCvc = (res) => {
  const allHits = document.querySelectorAll('.search-list-name-address')
  const table = document.querySelector('#datatable')
  const added = []
  allHits.forEach(val => {
    const innerText = val.innerText.replace('AB', 'AB, ').replace('Aktiebolag', 'Aktiebolag, ')
    const includes = (innerText.includes('AB') || innerText.includes('Aktiebolag') || innerText.includes('aktiebolag'))
    if (includes && !added.includes(innerText)) {
      const tr = document.createElement('tr')
      const td = document.createElement('td')
      td.innerText = innerText
      added.push(innerText)
      table.appendChild(tr)
      tr.appendChild(td)
    }
  })
  download_table_as_csv('datatable')
}

const clearDiv = () => {
  const ratsitEl = document.querySelector('#mock-ratsit-page')
  const table = document.querySelector('#datatable')
  if (table) table.innerHTML = ''
  if (ratsitEl) ratsitEl.innerHTML = ''
}

const handleRes = (res) => {
  const ratsitEl = document.querySelector('#mock-ratsit-page')
  ratsitEl.innerHTML = res
  createCvc()
}

const fetchUrl = async (url, totalPages) => {
  // const corsProxy = 'https://cors-anywhere.herokuapp.com/'
  const allUrls = []

  for (let page = 1; page <= totalPages; page++) {
    let ratsitUrl = new URL(url)
    let params = ratsitUrl.searchParams
    params.set('page', page)
    ratsitUrl.search = params.toString()
    allUrls.push(new Promise(resolve => {
      fetch(`${ratsitUrl.href}`)
      .then(res => resolve(res.text()))
    }))
  }

  const res = await Promise.all(allUrls)
  handleRes(res.join('<br />'), totalPages)
}

const createElements = () => {
  clearDiv()
  const datatable = document.createElement('table')
  datatable.id = 'datatable'
  const mockDiv = document.createElement('div')
  mockDiv.id = 'mock-ratsit-page'
  document.body.appendChild(mockDiv)
  document.body.appendChild(datatable)
}

const _GE_MIG_ALLT_ = (url, totalPages) => {
  createElements()
  fetchUrl(url, totalPages)
}

console.log('TJAAAA')
console.log('Okej, detta är superhackigt men ska funka!! :)')
console.log('Gör så här:')
console.log("Skriv in _GE_MIG_ALLT_('url', antalSidor) här i konsolen")
console.log("Exempel: _GE_MIG_ALLT_('https://www.ratsit.se/sok/foretag?vem=&var=huddinge+14102&ab=1&ef=0&hbkb=0&ov=0&typ=1&page=1', antalSidor)")
console.log('Urlen i första argumentet är själva urlen men innanför apostrofer, andra argument är anta sidor, ett nummer bara utan atostrofer')
console.log('För att rensa denna konsol, tryck "cmd+k" på din macs tangentbort')