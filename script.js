// Global variables
let currentQRCode = null;
let currentBarcode = null;
let currentLogo = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Set current date/time for event fields
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    const datetimeLocal = `${year}-${month}-${day}T${hours}:${minutes}`;
    document.getElementById('eventStart').value = datetimeLocal;
    document.getElementById('eventEnd').value = datetimeLocal;
    
    // Social media URL toggle
    document.getElementById('socialIsUrl').addEventListener('change', function() {
        const isUrl = this.checked;
        document.getElementById('socialUsername').placeholder = isUrl ? "https://..." : "username or profile URL";
    });
    
    // Social platform change
    document.getElementById('socialPlatform').addEventListener('change', function() {
        const platform = this.value;
        const postField = document.getElementById('socialPostField');
        const usernameField = document.getElementById('socialUsernameField');
        
        if (platform === 'instagram' || platform === 'tiktok') {
            postField.classList.remove('d-none');
            usernameField.classList.add('d-none');
        } else {
            postField.classList.add('d-none');
            usernameField.classList.remove('d-none');
        }
    });

    // Logo upload handler
    document.getElementById('logoUpload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                currentLogo = event.target.result;
                if (currentQRCode) {
                    // Regenerate QR code with new logo
                    generateQR('refresh');
                }
            };
            reader.readAsDataURL(file);
        }
    });
});

function generateQR(type) {
    if (type === 'refresh' && !currentQRCode) return;
    
    // Clear previous QR code
    const qrCodeElement = document.getElementById('qrcode');
    qrCodeElement.innerHTML = '';
    document.getElementById('qrResultCard').style.display = 'none';
    
    let qrData = type === 'refresh' ? currentQRCode : '';
    let displayData = '';
    
    if (type !== 'refresh') {

    switch(type) {
        case 'url':
            const url = document.getElementById('urlInput').value.trim();
            if (!url) {
                alert('Please enter a URL');
                return;
            }
            qrData = url.startsWith('http') ? url : `https://${url}`;
            displayData = qrData;
            break;
            
        case 'text':
            const text = document.getElementById('textInput').value.trim();
            if (!text) {
                alert('Please enter some text');
                return;
            }
            qrData = text;
            displayData = text;
            break;
            
        case 'email':
            const email = document.getElementById('emailInput').value.trim();
            if (!email) {
                alert('Please enter an email address');
                return;
            }
            const subject = document.getElementById('emailSubject').value.trim();
            const body = document.getElementById('emailBody').value.trim();
            
            qrData = `mailto:${email}`;
            if (subject) qrData += `?subject=${encodeURIComponent(subject)}`;
            if (body) qrData += (subject ? '&' : '?') + `body=${encodeURIComponent(body)}`;
            
            displayData = `Email: ${email}`;
            if (subject) displayData += `\nSubject: ${subject}`;
            if (body) displayData += `\nBody: ${body}`;
            break;
            
        case 'phone':
            const phone = document.getElementById('phoneInput').value.trim();
            if (!phone) {
                alert('Please enter a phone number');
                return;
            }
            qrData = `tel:${phone}`;
            displayData = `Phone: ${phone}`;
            break;
            
        case 'sms':
            const smsPhone = document.getElementById('smsPhoneInput').value.trim();
            if (!smsPhone) {
                alert('Please enter a phone number');
                return;
            }
            const smsMessage = document.getElementById('smsMessage').value.trim();
            qrData = `sms:${smsPhone}`;
            if (smsMessage) qrData += `?body=${encodeURIComponent(smsMessage)}`;
            displayData = `SMS to: ${smsPhone}`;
            if (smsMessage) displayData += `\nMessage: ${smsMessage}`;
            break;
            
        case 'vcard':
            const firstName = document.getElementById('vcardFirstName').value.trim();
            const lastName = document.getElementById('vcardLastName').value.trim();
            if (!firstName && !lastName) {
                alert('Please enter at least a first or last name');
                return;
            }
            
            const org = document.getElementById('vcardOrg').value.trim();
            const title = document.getElementById('vcardTitle').value.trim();
            const vcardPhone = document.getElementById('vcardPhone').value.trim();
            const vcardEmail = document.getElementById('vcardEmail').value.trim();
            const website = document.getElementById('vcardWebsite').value.trim();
            const address = document.getElementById('vcardAddress').value.trim();
            
            qrData = 'BEGIN:VCARD\nVERSION:3.0\n';
            if (firstName) qrData += `N:${lastName};${firstName};;;\n`;
            if (firstName || lastName) qrData += `FN:${firstName} ${lastName}\n`;
            if (org) qrData += `ORG:${org}\n`;
            if (title) qrData += `TITLE:${title}\n`;
            if (vcardPhone) qrData += `TEL:${vcardPhone}\n`;
            if (vcardEmail) qrData += `EMAIL:${vcardEmail}\n`;
            if (website) qrData += `URL:${website}\n`;
            if (address) qrData += `ADR:;;${address.replace(/\n/g, ';')};;\n`;
            qrData += 'END:VCARD';
            
            displayData = `Contact: ${firstName} ${lastName}`;
            if (org) displayData += `\nOrganization: ${org}`;
            if (title) displayData += `\nTitle: ${title}`;
            if (vcardPhone) displayData += `\nPhone: ${vcardPhone}`;
            if (vcardEmail) displayData += `\nEmail: ${vcardEmail}`;
            if (website) displayData += `\nWebsite: ${website}`;
            if (address) displayData += `\nAddress: ${address}`;
            break;
            
        case 'whatsapp':
            const whatsappPhone = document.getElementById('whatsappPhone').value.trim();
            if (!whatsappPhone) {
                alert('Please enter a phone number');
                return;
            }
            const whatsappMessage = document.getElementById('whatsappMessage').value.trim();
            qrData = `https://wa.me/${whatsappPhone.replace(/[^0-9]/g, '')}`;
            if (whatsappMessage) qrData += `?text=${encodeURIComponent(whatsappMessage)}`;
            displayData = `WhatsApp: ${whatsappPhone}`;
            if (whatsappMessage) displayData += `\nMessage: ${whatsappMessage}`;
            break;
            
        case 'wifi':
            const ssid = document.getElementById('wifiSsid').value.trim();
            if (!ssid) {
                alert('Please enter a network SSID');
                return;
            }
            const password = document.getElementById('wifiPassword').value.trim();
            const encryption = document.getElementById('wifiEncryption').value;
            const hidden = document.getElementById('wifiHidden').checked;
            
            qrData = `WIFI:T:${encryption};S:${ssid};`;
            if (password) qrData += `P:${password};`;
            if (hidden) qrData += 'H:true;';
            qrData += ';';
            
            displayData = `Wi-Fi Network: ${ssid}\nEncryption: ${encryption}`;
            if (password) displayData += `\nPassword: ${password}`;
            if (hidden) displayData += '\nHidden Network';
            break;
            
        case 'pdf':
            const pdfUrl = document.getElementById('pdfUrl').value.trim();
            if (!pdfUrl) {
                alert('Please enter a PDF URL');
                return;
            }
            qrData = pdfUrl.startsWith('http') ? pdfUrl : `https://${pdfUrl}`;
            displayData = `PDF: ${qrData}`;
            break;
            
        case 'social':
            const platform = document.getElementById('socialPlatform').value;
            const isUrl = document.getElementById('socialIsUrl').checked;
            
            if (platform === 'instagram' || platform === 'tiktok') {
                const postUrl = document.getElementById('socialPostUrl').value.trim();
                if (!postUrl) {
                    alert('Please enter a post URL');
                    return;
                }
                qrData = postUrl.startsWith('http') ? postUrl : `https://${postUrl}`;
                displayData = `${platform.charAt(0).toUpperCase() + platform.slice(1)} Post: ${qrData}`;
            } else {
                const username = document.getElementById('socialUsername').value.trim();
                if (!username) {
                    alert('Please enter a username or URL');
                    return;
                }
                
                if (isUrl) {
                    qrData = username.startsWith('http') ? username : `https://${username}`;
                    displayData = `${platform.charAt(0).toUpperCase() + platform.slice(1)}: ${qrData}`;
                } else {
                    let profileUrl = '';
                    switch(platform) {
                        case 'facebook': profileUrl = `https://facebook.com/${username}`; break;
                        case 'twitter': profileUrl = `https://twitter.com/${username}`; break;
                        case 'linkedin': profileUrl = `https://linkedin.com/in/${username}`; break;
                        case 'youtube': profileUrl = `https://youtube.com/${username}`; break;
                    }
                    qrData = profileUrl;
                    displayData = `${platform.charAt(0).toUpperCase() + platform.slice(1)} Profile: ${username}`;
                }
            }
            break;
            
        case 'event':
            const eventTitle = document.getElementById('eventTitle').value.trim();
            if (!eventTitle) {
                alert('Please enter an event title');
                return;
            }
            const description = document.getElementById('eventDescription').value.trim();
            const start = document.getElementById('eventStart').value;
            const end = document.getElementById('eventEnd').value;
            const location = document.getElementById('eventLocation').value.trim();
            const eventUrl = document.getElementById('eventUrl').value.trim();
            
            // Format dates for ICS
            const startDate = new Date(start);
            const endDate = new Date(end);
            
            const formatDateForICS = (date) => {
                return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z/, 'Z');
            };
            
            qrData = 'BEGIN:VEVENT\n';
            qrData += `SUMMARY:${eventTitle}\n`;
            if (description) qrData += `DESCRIPTION:${description.replace(/\n/g, '\\n')}\n`;
            qrData += `DTSTART:${formatDateForICS(startDate)}\n`;
            qrData += `DTEND:${formatDateForICS(endDate)}\n`;
            if (location) qrData += `LOCATION:${location}\n`;
            if (eventUrl) qrData += `URL:${eventUrl}\n`;
            qrData += 'END:VEVENT';
            
            displayData = `Event: ${eventTitle}\n`;
            if (description) displayData += `Description: ${description}\n`;
            displayData += `Start: ${startDate.toLocaleString()}\n`;
            displayData += `End: ${endDate.toLocaleString()}\n`;
            if (location) displayData += `Location: ${location}\n`;
            if (eventUrl) displayData += `URL: ${eventUrl}`;
            break;
            
        case 'barcode':
            const barcodeData = document.getElementById('barcodeData').value.trim();
            if (!barcodeData) {
                alert('Please enter data for the barcode');
                return;
            }
            const barcodeType = document.getElementById('barcodeType').value;
            
            try {
                // Clear previous barcode if exists
                if (currentBarcode) {
                    currentBarcode = null;
                }
                
                // Create SVG element for barcode
                const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                qrCodeElement.appendChild(svg);
                
                // Generate barcode
                JsBarcode(svg, barcodeData, {
                    format: barcodeType,
                    lineColor: "#000000",
                    width: 2,
                    height: 100,
                    displayValue: true,
                    margin: 10
                });
                
                currentBarcode = svg;
                displayData = barcodeData;
                document.getElementById('qrDataContent').value = displayData;
                document.getElementById('qrResultCard').style.display = 'block';
                return;
            } catch (e) {
                alert('Error generating barcode: ' + e.message);
                return;
            }
            
        default:
            alert('Invalid QR code type');
            return;
    }
}

  // Get customization options
  const shape = document.getElementById('qrShape').value;
  const qrColor = document.getElementById('qrColor').value;
  const bgColor = document.getElementById('bgColor').value;
  const errorLevel = document.getElementById('errorCorrection').value;

    // Generate QR code - UPDATED VERSION
    // Generate QR code with customization
    try {
        const canvas = document.createElement('canvas');
        qrCodeElement.appendChild(canvas);
        
        // Shape-specific settings
        let dotScale = 1;
        let cornerRadius = 0;
        let dotShape = 'square';
        
        switch(shape) {
            case 'rounded':
                cornerRadius = 0.5;
                break;
            case 'dot':
                dotScale = 0.8;
                break;
            case 'circle':
                dotShape = 'circle';
                break;
        }
        
        QRCode.toCanvas(canvas, qrData, {
            width: 200,
            margin: 2,
            color: {
                dark: qrColor,
                light: bgColor
            },
            errorCorrectionLevel: errorLevel,
            dotScale: dotScale,
            cornerRadius: cornerRadius,
            dotShape: dotShape
        }, async function(error) {
            if (error) {
                throw error;
            }
            
            // Add logo if exists
            if (currentLogo) {
                await addLogoToQR(canvas, currentLogo);
            }
            
            // Successfully generated QR code
            if (type !== 'refresh') {
                currentQRCode = qrData;
                document.getElementById('qrDataContent').value = displayData;
            }
            document.getElementById('qrResultCard').style.display = 'block';
        });
    } catch (error) {
        alert('Error generating QR code: ' + error.message);
        console.error(error);
    }
}

// Add logo to QR code
async function addLogoToQR(canvas, logoData) {
    return new Promise((resolve) => {
        const logo = new Image();
        logo.onload = function() {
            const ctx = canvas.getContext('2d');
            
            // Calculate logo size (25% of QR code size)
            const logoSize = canvas.width * 0.25;
            const x = (canvas.width - logoSize) / 2;
            const y = (canvas.height - logoSize) / 2;
            
            // Draw white background for logo
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x, y, logoSize, logoSize);
            
            // Draw logo
            ctx.drawImage(logo, x, y, logoSize, logoSize);
            resolve();
        };
        logo.src = logoData;
    });
}

// Download QR code in specified format
function downloadQR(format) {
    const qrCodeElement = document.getElementById('qrcode');
    const canvas = qrCodeElement.querySelector('canvas');
    
    if (!canvas) {
        alert('No QR code generated yet');
        return;
    }
    
    if (format === 'png') {
        const link = document.createElement('a');
        link.download = 'custom-qrcode.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    } else if (format === 'svg') {
        // Convert canvas to SVG
        const imgData = canvas.toDataURL('image/png');
        const svgData = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
                <image width="${canvas.width}" height="${canvas.height}" href="${imgData}"/>
            </svg>
        `;
        
        const blob = new Blob([svgData], {type: 'image/svg+xml'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'custom-qrcode.svg';
        link.href = url;
        link.click();
        
        setTimeout(() => URL.revokeObjectURL(url), 100);
    }
}

// Print QR code
function printQR() {
    if (!currentQRCode && !currentBarcode) {
        alert('No QR code or barcode generated yet');
        return;
    }

    const printWindow = window.open('', '', 'width=600,height=600');
    const qrCodeElement = document.getElementById('qrcode');
    
    printWindow.document.open();
    printWindow.document.write(`
        <html>
            <head>
                <title>Print QR Code</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        text-align: center; 
                        padding: 20px;
                    }
                    .qr-container { 
                        margin: 20px auto; 
                        max-width: 300px;
                    }
                    .qr-info {
                        margin-top: 20px;
                        word-break: break-all;
                    }
                </style>
            </head>
            <body>
                <h2>QR Code</h2>
                <div class="qr-container">
                    ${qrCodeElement.innerHTML}
                </div>
                <div class="qr-info">
                    <p><strong>Encoded Data:</strong></p>
                    <p>${document.getElementById('qrDataContent').value}</p>
                </div>
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            window.close();
                        }, 200);
                    };
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

// Copy QR data to clipboard
function copyQRData() {
    const qrData = document.getElementById('qrDataContent');
    qrData.select();
    qrData.setSelectionRange(0, 99999); // For mobile devices
    
    try {
        document.execCommand('copy');
        // Show feedback
        const originalText = qrData.value;
        qrData.value = 'Copied to clipboard!';
        setTimeout(() => {
            qrData.value = originalText;
        }, 2000);
    } catch (err) {
        alert('Failed to copy text: ' + err);
    }
}

// Authentication Functions
let currentUser = null;

// Initialize auth state
function initAuth() {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (user && user.token) {
    currentUser = user;
    updateAuthUI();
  }
}

// Show login modal
function showLoginModal() {
  showLoginForm();
  const modal = new bootstrap.Modal(document.getElementById('authModal'));
  modal.show();
}

// Show register modal
function showRegisterModal() {
  showRegisterForm();
  const modal = new bootstrap.Modal(document.getElementById('authModal'));
  modal.show();
}

// Toggle between login/register forms
function showLoginForm() {
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('authModalTitle').textContent = 'Login';
}

function showRegisterForm() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
  document.getElementById('authModalTitle').textContent = 'Register';
}

// Handle login
document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    // In a real app, you would call your backend API here
    // This is a mock implementation using localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Simulate token generation
    const token = btoa(`${email}:${Date.now()}`);
    currentUser = { ...user, token };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    updateAuthUI();
    bootstrap.Modal.getInstance(document.getElementById('authModal')).hide();
    showAlert('success', 'Logged in successfully!');
  } catch (error) {
    showAlert('danger', error.message);
  }
});

// Handle registration
document.getElementById('registerForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const confirmPassword = document.getElementById('registerConfirmPassword').value;
  
  if (password !== confirmPassword) {
    showAlert('danger', 'Passwords do not match');
    return;
  }
  
  try {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.some(u => u.email === email)) {
      throw new Error('Email already registered');
    }
    
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In real app, you should hash passwords!
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    showAlert('success', 'Registration successful! Please login.');
    showLoginForm();
  } catch (error) {
    showAlert('danger', error.message);
  }
});

// Logout function
function logout() {
  localStorage.removeItem('currentUser');
  currentUser = null;
  updateAuthUI();
  showAlert('success', 'Logged out successfully!');
}

// Update UI based on auth state
function updateAuthUI() {
  const authButtons = document.getElementById('authButtons');
  const userProfile = document.getElementById('userProfile');
  
  if (currentUser) {
    authButtons.style.display = 'none';
    userProfile.style.display = 'block';
    document.getElementById('userGreeting').textContent = `Hi, ${currentUser.name}`;
    
    // Enable save functionality
    document.getElementById('saveQRBtn').style.display = 'block';
  } else {
    authButtons.style.display = 'block';
    userProfile.style.display = 'none';
    
    // Disable save functionality
    document.getElementById('saveQRBtn').style.display = 'none';
  }
}

// Show alert message
function showAlert(type, message) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.role = 'alert';
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  const container = document.querySelector('.container');
  container.prepend(alertDiv);
  
  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}

// QR Code Saving Functionality
function saveCurrentQR() {
  if (!currentUser) {
    showLoginModal();
    return;
  }
  
  if (!currentQRCode) {
    showAlert('warning', 'No QR code to save');
    return;
  }
  
  const qrCodes = JSON.parse(localStorage.getItem('userQRCodes')) || {};
  const userQRCodes = qrCodes[currentUser.id] || [];
  
  const qrData = {
    id: Date.now().toString(),
    data: currentQRCode,
    displayData: document.getElementById('qrDataContent').value,
    timestamp: new Date().toISOString(),
    settings: {
      shape: document.getElementById('qrShape').value,
      qrColor: document.getElementById('qrColor').value,
      bgColor: document.getElementById('bgColor').value
    }
  };
  
  userQRCodes.push(qrData);
  qrCodes[currentUser.id] = userQRCodes;
  localStorage.setItem('userQRCodes', JSON.stringify(qrCodes));
  
  showAlert('success', 'QR code saved successfully!');
}

// Show saved QR codes
function showSavedQRCodes() {
  if (!currentUser) return;
  
  const qrCodes = JSON.parse(localStorage.getItem('userQRCodes')) || {};
  const userQRCodes = qrCodes[currentUser.id] || [];
  
  // Create a modal to display saved QR codes
  const modalHTML = `
    <div class="modal fade" id="savedQRCodesModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">My Saved QR Codes</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            ${userQRCodes.length === 0 
              ? '<p>No saved QR codes yet</p>' 
              : '<div class="row" id="savedQRList"></div>'}
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add modal to DOM
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalHTML;
  document.body.appendChild(modalContainer);
  
  // Show the modal
  const modal = new bootstrap.Modal(document.getElementById('savedQRCodesModal'));
  modal.show();
  
  // Populate with QR codes if any
  if (userQRCodes.length > 0) {
    const qrList = document.getElementById('savedQRList');
    userQRCodes.forEach(qr => {
      const col = document.createElement('div');
      col.className = 'col-md-4 mb-3';
      col.innerHTML = `
        <div class="card">
          <div class="card-body text-center">
            <div class="qr-preview" data-id="${qr.id}"></div>
            <p class="small text-truncate mt-2" title="${qr.displayData}">${qr.displayData}</p>
            <button class="btn btn-sm btn-outline-primary" onclick="loadSavedQR('${qr.id}')">Load</button>
            <button class="btn btn-sm btn-outline-danger" onclick="deleteSavedQR('${qr.id}')">Delete</button>
          </div>
        </div>
      `;
      qrList.appendChild(col);
      
      // Render the QR code preview
      QRCode.toCanvas(col.querySelector('.qr-preview'), qr.data, {
        width: 100,
        margin: 1,
        color: {
          dark: qr.settings.qrColor,
          light: qr.settings.bgColor
        }
      });
    });
  }
  
  // Remove modal when hidden
  document.getElementById('savedQRCodesModal').addEventListener('hidden.bs.modal', function() {
    modalContainer.remove();
  });
}

// Load saved QR code
function loadSavedQR(qrId) {
  const qrCodes = JSON.parse(localStorage.getItem('userQRCodes')) || {};
  const userQRCodes = qrCodes[currentUser.id] || [];
  const qr = userQRCodes.find(q => q.id === qrId);
  
  if (qr) {
    currentQRCode = qr.data;
    document.getElementById('qrDataContent').value = qr.displayData;
    
    // Apply saved settings
    document.getElementById('qrShape').value = qr.settings.shape;
    document.getElementById('qrColor').value = qr.settings.qrColor;
    document.getElementById('bgColor').value = qr.settings.bgColor;
    
    // Regenerate QR code
    generateQR('refresh');
    
    // Close the modal
    bootstrap.Modal.getInstance(document.getElementById('savedQRCodesModal')).hide();
    
    showAlert('success', 'QR code loaded successfully!');
  }
}

// Delete saved QR code
function deleteSavedQR(qrId) {
  if (confirm('Are you sure you want to delete this QR code?')) {
    const qrCodes = JSON.parse(localStorage.getItem('userQRCodes')) || {};
    const userQRCodes = qrCodes[currentUser.id] || [];
    
    qrCodes[currentUser.id] = userQRCodes.filter(q => q.id !== qrId);
    localStorage.setItem('userQRCodes', JSON.stringify(qrCodes));
    
    showSavedQRCodes(); // Refresh the list
    showAlert('success', 'QR code deleted successfully!');
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initAuth();
  
  // Add save button to QR result card
  const qrResultCard = document.getElementById('qrResultCard');
  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn btn-warning mt-2';
  saveBtn.id = 'saveQRBtn';
  saveBtn.innerHTML = '<i class="fas fa-save me-2"></i>Save QR Code';
  saveBtn.onclick = saveCurrentQR;
  saveBtn.style.display = 'none';
  qrResultCard.querySelector('.card-body').appendChild(saveBtn);
});