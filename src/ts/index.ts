import Papa from 'papaparse'

export function handleFiles(files) {
  if (window.FileReader) {
    const file = files[0]
    Papa.parse(file, {
      complete: function (parsed) {
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
        printLabels(lines)
      },
    })
  } else {
    alert('Sorry, you need a newer browser')
  }
}

function printLabels(lines) {
  const output = document.getElementById('output')
  output.innerHTML = ''
  let labels = '<section class="page">'

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const shippingName = line['Shipping Name'] || ''
    const shippingAddress1 = (line['Shipping Address1'] || '').trim()
    const shippingAddress2 = (line['Shipping Address2'] || '').trim()
    const shippingZip = (line['Shipping Zip'] || '').replace("'", '')
    const shippingCity = (line['Shipping City']).trim()
    const label = `
      <div class="label">
        ${shippingName}<br>
        ${shippingAddress1}<br>
        ${shippingAddress2 && shippingAddress2 !== shippingAddress1 ? `${shippingAddress2}<br>` : ''}
        ${shippingZip} ${shippingCity}
      </div>
    `

    labels = `${labels}${label}`

    if (i && i % 32 === 0) {
      labels += '</section><section class="page">'
    }
  }
  labels += '</section>'

  output.insertAdjacentHTML('afterbegin', labels)
}
