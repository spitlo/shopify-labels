import Papa from 'papaparse'

import { DEFAULT_COLUMNS, DEFAULT_ROWS, DEFAULT_COUNTRY } from '../config'

export function init(): void {
  const labelForm: any = document.getElementById('labelForm')
  labelForm.onsubmit = handleFiles
  labelForm.onchange = () => {
    const { elements } = labelForm
    let { file } = elements
    file = file.files[0]
    if (file) {
      handleFiles()
    }
  }
  // Temp, remove when/if posthtml-expressions is working
  labelForm.elements[1].value = DEFAULT_COLUMNS
  labelForm.elements[2].value = DEFAULT_ROWS
}

export function handleFiles(event?): void {
  if (event) {
    event.preventDefault()
  }
  const labelForm: any = document.getElementById('labelForm')
  const { elements } = labelForm
  let { columns, rows, file } = elements
  columns = (columns && columns.value) || DEFAULT_COLUMNS
  rows = (rows && rows.value) || DEFAULT_ROWS
  file = file.files[0]

  if (!file) {
    return alert('Please pick a file')
  }

  if (window.FileReader) {
    Papa.parse(file, {
      complete: (parsed) => {
        // Parsed, now parse again!
        const lines = []
        const keys = parsed.data[0]
        for (let i = 1; i < parsed.data.length; i++) {
          const parsedLine = parsed.data[i]
          if (parsedLine[0]) {
            const line = {}
            for (let j = 0; j < parsedLine.length; j++) {
              line[keys[j]] = parsedLine[j]
            }
            lines.push(line)
          }
        }
        printLabels(lines, {
          columns,
          rows,
        })
      },
    })
  } else {
    alert('Sorry, you need a newer browser')
  }
}

function printLabels(lines, options): void {
  const { columns, rows } = options
  const output = document.getElementById('output')
  output.innerHTML = ''
  let labels = `<section class="page c${columns} r${rows}">`
  const shownOrders = []
  let shownOrderCount = 0

  for (const line of lines) {
    const orderName = line['Name']
    // Orders with more than one product gets multiple
    // lines in the csv. We only want to show the first line.
    if (!shownOrders.includes(orderName)) {
      const shippingName = line['Shipping Name'] || ''
      const shippingAddress1 = (line['Shipping Address1'] || '').trim()
      const shippingAddress2 = (line['Shipping Address2'] || '').trim()
      const shippingZip = (line['Shipping Zip'] || '').replace("'", '')
      const shippingCity = line['Shipping City'].trim()
      const shippingCountry = line['Shipping Country'] || ''

      const label = `
        <div class="label">
          ${shippingName}<br>
          ${shippingAddress1}<br>
          ${
            shippingAddress2 && shippingAddress2 !== shippingAddress1
              ? `${shippingAddress2}<br>`
              : ''
          }
          ${shippingZip} ${shippingCity}
          ${shippingCountry !== DEFAULT_COUNTRY ? '<br>' + shippingCountry : ''}
        </div>
      `

      labels = `${labels}${label}`

      shownOrders.push(orderName)
      shownOrderCount++

      if (shownOrderCount > 0 && shownOrderCount % (columns * rows) === 0) {
        labels = `${labels}</section><section class="page c${columns} r${rows}">`
      }
    }
  }
  labels = `${labels}</section>`

  output.insertAdjacentHTML('afterbegin', labels)
}
