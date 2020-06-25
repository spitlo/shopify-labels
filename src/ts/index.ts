import Papa from  'papaparse'

export function handleFiles(files) {
  if (window.FileReader) {
    var file = files[0]
    Papa.parse(file, {
      complete: function (parsed) {
        // Parsed, now parse again!
        var lines = []
        var keys = parsed.data[0]
        for (var i = 1; i < parsed.data.length; i++) {
          var parsedLine = parsed.data[i]
          if (parsedLine[0]) {
            var line = {}
            for (var j = 0; j < parsedLine.length; j++) {
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
  var output = document.getElementById('output')
  output.innerHTML = ''
  var labels = ''

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i]
    var shippingAddress1 = line['Shipping Address1'] || ''
    var shippingAddress2 = line['Shipping Address2'] || ''
    shippingAddress1 = shippingAddress1.trim()
    shippingAddress2 = shippingAddress2.trim()
    var shippingZip = line['Shipping Zip'] || ''
    shippingZip = shippingZip.replace("'", '')
    var label = '<div class="label">'
    label += line['Shipping Name'] + '<br>'
    label += shippingAddress1 + '<br>'
    if (shippingAddress2 && shippingAddress2 !== shippingAddress1) {
      label += line['Shipping Address2'] + '<br>'
    }
    label += shippingZip + ' ' + line['Shipping City'] + '<br>'
    label += '</div>'
    labels += label
  }

  output.insertAdjacentHTML('afterbegin', labels)
}
