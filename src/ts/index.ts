import Papa from 'papaparse'

import { DEFAULT_COLUMNS, DEFAULT_ROWS } from '../config'

export function init(): void {
  const labelForm: any = document.getElementById('labelForm')
  labelForm.onsubmit = handleFiles
  // Temp, remove when/if posthtml-expressions is working
  labelForm.elements[1].value = DEFAULT_COLUMNS
  labelForm.elements[2].value = DEFAULT_ROWS
}

export function handleFiles(event): void {
  event.preventDefault()
  const { target } = event
  let { columns, rows, file } = target
  columns = (columns && columns.value) || DEFAULT_COLUMNS
  rows = (rows && rows.value) || DEFAULT_ROWS
  file = file.files[0]

  if (!file) {
    return alert('Please pick a file')
  }

  // Change button text to make more sense
  document.getElementById('submit-button').textContent = 'Re-generate labels!'

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

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const shippingName = line['Shipping Name'] || ''
    const shippingAddress1 = (line['Shipping Address1'] || '').trim()
    const shippingAddress2 = (line['Shipping Address2'] || '').trim()
    const shippingZip = (line['Shipping Zip'] || '').replace("'", '')
    const shippingCity = line['Shipping City'].trim()

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
      </div>
    `

    labels = `${labels}${label}`

    if (i > 0 && (i + 1) % (columns * rows) === 0) {
      labels = `${labels}</section><section class="page c${columns} r${rows}">`
    }
  }
  labels = `${labels}</section>`

  output.insertAdjacentHTML('afterbegin', labels)
}
