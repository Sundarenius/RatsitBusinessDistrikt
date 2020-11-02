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

const createCsv = () => {
  const allHits = document.querySelectorAll('.search-list-name-address')
  const table = document.querySelector('#datatable')
  document.querySelector('body').appendChild(table)
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
  download_table_as_csv()
}

const addTable = () => {
  const table = document.createElement('table')
  table.id = 'datatable'
  document.querySelector('body').appendChild(table)
  createCsv('datatable')
}

const fetchScripts = async (script1, script2) => {
  const allScripts = []
  const push = (script) => {
    allScripts.push(new Promise(resolve => {
      fetch(script)
      .then(res => res.text())
      .then(data => resolve(data))
    }))
  }
  push(script1)
  push(script2)
  return await Promise.all(allScripts)
}

const addScripts = async () => {
  const script1 = 'https://cdn.jsdelivr.net/npm/excellentexport@3.4.3/dist/excellentexport.min.js'
  const script2 = 'https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.6/require.min.js'
  const scripts = await fetchScripts(script1, script2)
  const newScript = document.createElement('script')
  newScript.innerText = scripts[0] + scripts[1]
  const headEL = document.body
  headEL.appendChild(newScript)
  await new Promise(resolve => {
    setTimeout(() => {
      resolve(null)
    }, 600)
  })
  addTable()
}
const _start_ = (totalPages) => {
  addScripts()
}