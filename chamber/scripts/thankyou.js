// thankyou.js – Abuja Chamber of Commerce
// Displays form data from URL parameters on the thank you page

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  
  // Define the fields we want to display (required fields)
  const fields = [
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email Address' },
    { key: 'mobile', label: 'Mobile Phone' },
    { key: 'businessName', label: 'Business/Organization Name' },
    { key: 'timestamp', label: 'Application Date' }
  ];

  // Get the summary grid container
  const summaryGrid = document.getElementById('summaryGrid');

  // Check if we have data
  let hasData = false;
  let summaryHTML = '';

  // Build the summary HTML
  fields.forEach(field => {
    const value = urlParams.get(field.key);
    if (value && value.trim() !== '') {
      hasData = true;
      // Format timestamp if present
      let displayValue = value;
      if (field.key === 'timestamp') {
        try {
          const date = new Date(value);
          if (!isNaN(date)) {
            displayValue = date.toLocaleString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
          }
        } catch (e) {
          // If date parsing fails, show original value
        }
      }
      
      summaryHTML += `
        <div class="summary-item">
          <span class="summary-label">${field.label}</span>
          <span class="summary-value">${displayValue}</span>
        </div>
      `;
    }
  });

  // If no data found, show a message
  if (!hasData) {
    summaryHTML = `
      <div class="summary-empty">
        <p>No application data found. Please <a href="join.html" class="inline-link">fill out the application form</a>.</p>
      </div>
    `;
  }

  // Inject the summary into the page
  if (summaryGrid) {
    summaryGrid.innerHTML = summaryHTML;
  }

  // Add membership level if present (optional display)
  const membershipLevel = urlParams.get('membershipLevel');
  if (membershipLevel && membershipLevel.trim() !== '') {
    const levelMap = {
      'np': 'NP (Non-Profit)',
      'bronze': 'Bronze',
      'silver': 'Silver',
      'gold': 'Gold'
    };
    const displayLevel = levelMap[membershipLevel] || membershipLevel;
    
    // Append membership level to the summary
    const membershipItem = document.createElement('div');
    membershipItem.className = 'summary-item';
    membershipItem.innerHTML = `
      <span class="summary-label">Membership Level</span>
      <span class="summary-value">${displayLevel}</span>
    `;
    
    // Find the summary grid and append
    const grid = document.getElementById('summaryGrid');
    if (grid) {
      // Remove loading message if present
      const loadingMsg = grid.querySelector('.summary-loading');
      if (loadingMsg) {
        loadingMsg.remove();
      }
      grid.appendChild(membershipItem);
    }
  }

  console.log('📋 Thank you page loaded with application data.');
});