// Function to load CSV data from a file
function loadCSVData(filePath) {
    return fetch(filePath)
      .then(response => response.text())
      .then(data => {
        const parsedData = d3.csvParse(data);
        return parsedData;
      });
  }
  
  // Define the file paths for your CSV files
  const futureRevFilePath = 'future_rev.csv';
  const futureOccFilePath = 'future_occ.csv';
  const pastRevFilePath = 'past_rev.csv';
  const pastOccFilePath = 'past_occ.csv';
  
  // Load data from CSV files
  let future_rev, future_occ, past_rev, past_occ;
  
  Promise.all([
    loadCSVData(futureRevFilePath),
    loadCSVData(futureOccFilePath),
    loadCSVData(pastRevFilePath),
    loadCSVData(pastOccFilePath)
  ])
    .then(([futureRevData, futureOccData, pastRevData, pastOccData]) => {
      future_rev = futureRevData;
      future_occ = futureOccData;
      past_rev = pastRevData;
      past_occ = pastOccData;
      initializeDashboard();
    })
    .catch(error => {
      console.error('Error loading CSV data:', error);
    });
  
  // Function to initialize the dashboard
  function initializeDashboard() {
    // Update the data table initially
    const initialData = updateDataTable(true, false, false, false);
    const dataTableContainer = document.getElementById('data-table');
    dataTableContainer.appendChild(initialData);
  
    // Add event listeners to update the data table when the radio buttons change
    const radioInputs = document.querySelectorAll('input[name="data-source"]');
    radioInputs.forEach(input => {
      input.addEventListener('change', () => {
        const futureRevChecked = document.getElementById('radio-future-rev').checked;
        const futureOccChecked = document.getElementById('radio-future-occ').checked;
        const pastRevChecked = document.getElementById('radio-past-rev').checked;
        const pastOccChecked = document.getElementById('radio-past-occ').checked;
  
        if (futureRevChecked) {
          data = future_rev;
        } else if (futureOccChecked) {
          data = future_occ;
        } else if (pastRevChecked) {
          data = past_rev;
        } else if (pastOccChecked) {
          data = past_occ;
        }
  
        const newData = updateDataTable(futureRevChecked, futureOccChecked, pastRevChecked, pastOccChecked);
        dataTableContainer.innerHTML = '';
        dataTableContainer.appendChild(newData);
      });
    });
  }
  
  // Function to update the data table based on the selected data source
  function updateDataTable(futureRevChecked, futureOccChecked, pastRevChecked, pastOccChecked) {
    let data = [];
    let columns = [];
  
    if (futureRevChecked) {
      data = future_rev;
      columns = Object.keys(data[0]);
    } else if (futureOccChecked) {
      data = future_occ;
      columns = Object.keys(data[0]);
    } else if (pastRevChecked) {
      data = past_rev;
      columns = Object.keys(data[0]);
    } else if (pastOccChecked) {
      data = past_occ;
      columns = Object.keys(data[0]);
    }
  
    const table = d3.select('#data-table')
      .html('')
      .append('table')
      .style('overflow-x', 'auto')
      .style('text-align', 'center');
  
    const thead = table.append('thead');
    const tbody = table.append('tbody');
  
    // Create table headers
    thead.append('tr')
      .selectAll('th')
      .data(columns)
      .enter()
      .append('th')
      .style('font-weight', 'bold')
      .style('text-align', 'center')
      .text(d => d);
  
    // Create table rows
    const rows = tbody.selectAll('tr')
      .data(data)
      .enter()
      .append('tr');
  
    // Create table cells
    const cells = rows.selectAll('td')
      .data(row => Object.values(row))
      .enter()
      .append('td')
      .text((d, i) => {
        if (columns[i] === 'date') {
          const date = new Date(d);
          return date.toLocaleDateString();
        }
        return d;
      });
  
    return table.node();
  }
  
  