// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navbar = document.querySelector('#navbar');
const contactForm = document.getElementById('contactForm');
const serviceSelect = document.getElementById('service');
const dynamicFields = document.getElementById('dynamicFields');
const navLinks = document.querySelectorAll('.nav-link');
const serviceButtons = document.querySelectorAll('.service-btn');
const servicePills = document.querySelectorAll('.service-pill');
const progressSteps = document.querySelectorAll('.progress-step');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
    initializeFormProgress();
    setupServicePills();
});

// Mobile Navigation
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Enhanced Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Service Pills Functionality
function setupServicePills() {
    servicePills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Remove active class from all pills
            servicePills.forEach(p => p.classList.remove('active'));
            // Add active class to clicked pill
            pill.classList.add('active');
            
            const service = pill.getAttribute('data-service');
            serviceSelect.value = service;
            updateDynamicFields(service);
            updateFormProgress();
        });
    });
}

// Service selection from service cards
serviceButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const service = button.getAttribute('data-service');
        
        // Update service pills
        servicePills.forEach(p => p.classList.remove('active'));
        const targetPill = document.querySelector(`[data-service="${service}"]`);
        if (targetPill) targetPill.classList.add('active');
        
        serviceSelect.value = service;
        updateDynamicFields(service);
        updateFormProgress();
        
        // Smooth scroll to contact form
        document.getElementById('contact').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Form Progress Management
function initializeFormProgress() {
    const formInputs = contactForm.querySelectorAll('input[required], select[required]');
    
    formInputs.forEach(input => {
        input.addEventListener('input', updateFormProgress);
        input.addEventListener('change', updateFormProgress);
    });
}

function updateFormProgress() {
    const requiredFields = contactForm.querySelectorAll('input[required], select[required]');
    const filledFields = Array.from(requiredFields).filter(field => field.value.trim() !== '');
    
    const progress = Math.min(Math.floor((filledFields.length / requiredFields.length) * 3), 3);
    
    progressSteps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index < progress) {
            step.classList.add('completed');
        } else if (index === progress) {
            step.classList.add('active');
        }
    });
}

// Enhanced Dynamic Fields
function updateDynamicFields(service) {
    dynamicFields.innerHTML = '';
    
    if (service === 'repair' || service === 'maintenance') {
        dynamicFields.innerHTML = `
            <div class="form-row dynamic-field">
                <div class="form-group">
                    <label for="vehicleInfo">Vehicle Information <span class="required">*</span></label>
                    <input type="text" id="vehicleInfo" name="vehicleInfo" placeholder="e.g., Toyota Camry 2020" required>
                </div>
                <div class="form-group">
                    <label for="mileage">Current Mileage</label>
                    <input type="number" id="mileage" name="mileage" placeholder="e.g., 45000">
                </div>
            </div>
            
            <div class="form-group dynamic-field full-width">
                <label for="issue">Issue Description <span class="required">*</span></label>
                <textarea id="issue" name="issue" rows="3" placeholder="Please describe the issue, symptoms, or service needed in detail..." required></textarea>
            </div>
            
            <div class="form-row dynamic-field">
                <div class="form-group">
                    <label for="lastService">Last Service Date</label>
                    <input type="date" id="lastService" name="lastService">
                </div>
                <div class="form-group">
                    <label for="warrantyStatus">Warranty Status</label>
                    <select id="warrantyStatus" name="warrantyStatus">
                        <option value="">Select warranty status...</option>
                        <option value="under-warranty">Under Warranty</option>
                        <option value="expired">Warranty Expired</option>
                        <option value="extended">Extended Warranty</option>
                        <option value="unknown">Unknown</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group dynamic-field full-width">
                <label for="pickupLocation">Pickup Location <span class="required">*</span></label>
                <div class="location-group">
                    <input type="text" id="pickupLocation" name="pickupLocation" placeholder="Enter pickup address or use current location" required>
                    <button type="button" class="location-btn" onclick="getLocation('pickup')">
                        📍 Get Location
                    </button>
                </div>
            </div>
            
            <div class="form-group dynamic-field full-width">
                <label for="dropLocation">Drop-off Location <span class="required">*</span></label>
                <div class="location-group">
                    <input type="text" id="dropLocation" name="dropLocation" placeholder="Enter drop-off address or use current location" required>
                    <button type="button" class="location-btn" onclick="getLocation('drop')">
                        📍 Get Location
                    </button>
                </div>
            </div>
            
            <div class="form-row dynamic-field">
                <div class="form-group">
                    <label for="preferredDate">Preferred Service Date</label>
                    <input type="date" id="preferredDate" name="preferredDate" min="${new Date().toISOString().split('T')[0]}">
                </div>
                <div class="form-group">
                    <label for="preferredTime">Preferred Time</label>
                    <select id="preferredTime" name="preferredTime">
                        <option value="">Select preferred time...</option>
                        <option value="morning">Morning (8AM - 12PM)</option>
                        <option value="afternoon">Afternoon (12PM - 4PM)</option>
                        <option value="evening">Evening (4PM - 6PM)</option>
                        <option value="flexible">Flexible</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group dynamic-field full-width">
                <label for="additionalServices">Additional Services Needed</label>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem; margin-top: 0.5rem;">
                    <label><input type="checkbox" name="additionalServices" value="inspection"> 🔍 Vehicle Inspection</label>
                    <label><input type="checkbox" name="additionalServices" value="cleaning"> 🧽 Interior/Exterior Cleaning</label>
                    <label><input type="checkbox" name="additionalServices" value="towing"> 🚛 Towing Service</label>
                    <label><input type="checkbox" name="additionalServices" value="rental"> 🚗 Rental Car</label>
                </div>
            </div>
        `;
    } else if (service === 'import-export') {
        dynamicFields.innerHTML = `
            <div class="form-row dynamic-field">
                <div class="form-group">
                    <label for="serviceType">Service Type <span class="required">*</span></label>
                    <select id="serviceType" name="serviceType" required>
                        <option value="">Select service type...</option>
                        <option value="import">Import Vehicle</option>
                        <option value="export">Export Vehicle</option>
                        <option value="both">Import & Export</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="vehicleType">Vehicle Type</label>
                    <select id="vehicleType" name="vehicleType">
                        <option value="">Select vehicle type...</option>
                        <option value="sedan">Sedan</option>
                        <option value="suv">SUV</option>
                        <option value="truck">Truck</option>
                        <option value="motorcycle">Motorcycle</option>
                        <option value="luxury">Luxury Vehicle</option>
                        <option value="classic">Classic/Vintage</option>
                        <option value="commercial">Commercial Vehicle</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group dynamic-field full-width">
                <label for="vehicleDetails">Vehicle Details <span class="required">*</span></label>
                <textarea id="vehicleDetails" name="vehicleDetails" rows="3" placeholder="Make, Model, Year, Engine size, Transmission type, Color, VIN (if available), etc." required></textarea>
            </div>
            
            <div class="form-row dynamic-field">
                <div class="form-group">
                    <label for="origin">Origin Country/Port <span class="required">*</span></label>
                    <input type="text" id="origin" name="origin" placeholder="e.g., Japan - Yokohama Port" required>
                </div>
                <div class="form-group">
                    <label for="destination">Destination Country/Port <span class="required">*</span></label>
                    <input type="text" id="destination" name="destination" placeholder="e.g., USA - Los Angeles Port" required>
                </div>
            </div>
            
            <div class="form-row dynamic-field">
                <div class="form-group">
                    <label for="vehicleCondition">Vehicle Condition</label>
                    <select id="vehicleCondition" name="vehicleCondition">
                        <option value="">Select condition...</option>
                        <option value="new">Brand New</option>
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="needs-repair">Needs Repair</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="estimatedValue">Estimated Vehicle Value</label>
                    <input type="number" id="estimatedValue" name="estimatedValue" placeholder="USD" min="0">
                </div>
            </div>
            
            <div class="form-row dynamic-field">
                <div class="form-group">
                    <label for="timeline">Required Timeline</label>
                    <select id="timeline" name="timeline">
                        <option value="">Select timeline...</option>
                        <option value="asap">As soon as possible</option>
                        <option value="1-month">Within 1 month</option>
                        <option value="2-3-months">2-3 months</option>
                        <option value="6-months">Within 6 months</option>
                        <option value="flexible">Flexible timeline</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="shippingMethod">Preferred Shipping Method</label>
                    <select id="shippingMethod" name="shippingMethod">
                        <option value="">Select shipping method...</option>
                        <option value="container">Container Shipping</option>
                        <option value="roro">Roll-on/Roll-off (RoRo)</option>
                        <option value="air">Air Freight (Expedited)</option>
                        <option value="recommend">Recommend Best Option</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group dynamic-field full-width">
                <label for="documentsNeeded">Documentation Services Needed</label>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 0.5rem; margin-top: 0.5rem;">
                    <label><input type="checkbox" name="documentsNeeded" value="customs"> 📋 Customs Clearance</label>
                    <label><input type="checkbox" name="documentsNeeded" value="inspection"> 🔍 Pre-shipment Inspection</label>
                    <label><input type="checkbox" name="documentsNeeded" value="insurance"> 🛡️ Shipping Insurance</label>
                    <label><input type="checkbox" name="documentsNeeded" value="registration"> 📄 Registration Assistance</label>
                </div>
            </div>
            
            <div class="form-group dynamic-field full-width">
                <label for="specialRequirements">Special Requirements</label>
                <textarea id="specialRequirements" name="specialRequirements" rows="2" placeholder="Any special handling, modifications, or specific requirements..."></textarea>
            </div>
        `;
    } else if (service === 'spare-parts') {
        dynamicFields.innerHTML = `
            <div class="form-row dynamic-field">
                <div class="form-group">
                    <label for="partCategory">Part Category <span class="required">*</span></label>
                    <select id="partCategory" name="partCategory" required>
                        <option value="">Select part category...</option>
                        <option value="engine">Engine Components</option>
                        <option value="transmission">Transmission Parts</option>
                        <option value="brakes">Brake System</option>
                        <option value="suspension">Suspension & Steering</option>
                        <option value="electrical">Electrical Components</option>
                        <option value="body">Body Parts & Panels</option>
                        <option value="interior">Interior Components</option>
                        <option value="exhaust">Exhaust System</option>
                        <option value="cooling">Cooling System</option>
                        <option value="filters">Filters & Fluids</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="urgencyLevel">Urgency Level</label>
                    <select id="urgencyLevel" name="urgencyLevel">
                        <option value="normal">Normal (3-5 days)</option>
                        <option value="urgent">Urgent (1-2 days)</option>
                        <option value="emergency">Emergency (Same day)</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row dynamic-field">
                <div class="form-group">
                    <label for="vehicleModel">Vehicle Make & Model <span class="required">*</span></label>
                    <input type="text" id="vehicleModel" name="vehicleModel" placeholder="e.g., Honda Civic 2018" required>
                </div>
                <div class="form-group">
                    <label for="engineSize">Engine Size/Type</label>
                    <input type="text" id="engineSize" name="engineSize" placeholder="e.g., 2.0L Turbo">
                </div>
            </div>
            
            <div class="form-row dynamic-field">
                <div class="form-group">
                    <label for="partNumber">Part Number (if known)</label>
                    <input type="text" id="partNumber" name="partNumber" placeholder="OEM or aftermarket part number">
                </div>
                <div class="form-group">
                    <label for="quantity">Quantity <span class="required">*</span></label>
                    <input type="number" id="quantity" name="quantity" min="1" value="1" required>
                </div>
            </div>
            
            <div class="form-group dynamic-field full-width">
                <label for="partDescription">Detailed Part Description <span class="required">*</span></label>
                <textarea id="partDescription" name="partDescription" rows="3" placeholder="Describe the part you need, its function, location on vehicle, any specific requirements..." required></textarea>
            </div>
            
            <div class="form-row dynamic-field">
                <div class="form-group">
                    <label for="condition">Condition Preference</label>
                    <select id="condition" name="condition">
                        <option value="new">New/OEM</option>
                        <option value="aftermarket">Quality Aftermarket</option>
                        <option value="used-excellent">Used - Excellent</option>
                        <option value="used-good">Used - Good</option>
                        <option value="any">Any Condition</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="maxBudget">Maximum Budget per Part</label>
                    <input type="number" id="maxBudget" name="maxBudget" placeholder="USD" min="0">
                </div>
            </div>
            
            <div class="form-row dynamic-field">
                <div class="form-group">
                    <label for="deliveryMethod">Delivery Method</label>
                    <select id="deliveryMethod" name="deliveryMethod">
                        <option value="pickup">Pickup from Store</option>
                        <option value="standard">Standard Delivery</option>
                        <option value="express">Express Delivery</option>
                        <option value="same-day">Same Day Delivery</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="installationNeeded">Installation Service</label>
                    <select id="installationNeeded" name="installationNeeded">
                        <option value="no">No, parts only</option>
                        <option value="yes">Yes, include installation</option>
                        <option value="quote">Quote installation separately</option>
                    </select>
                </div>
            </div>
            
            <div class="form-group dynamic-field full-width">
                <label for="deliveryAddress">Delivery Address (if applicable)</label>
                <div class="location-group">
                    <input type="text" id="deliveryAddress" name="deliveryAddress" placeholder="Enter delivery address">
                    <button type="button" class="location-btn" onclick="getLocation('delivery')">
                        📍 Get Location
                    </button>
                </div>
            </div>
            
            <div class="form-group dynamic-field full-width">
                <label for="alternativeParts">Alternative Parts Acceptable?</label>
                <div style="margin-top: 0.5rem;">
                    <label><input type="radio" name="alternativeParts" value="yes"> Yes, suggest alternatives if exact part unavailable</label><br>
                    <label><input type="radio" name="alternativeParts" value="no"> No, only the exact part specified</label><br>
                    <label><input type="radio" name="alternativeParts" value="consult"> Consult with me first</label>
                </div>
            </div>
        `;
    }
    
    // Re-initialize form progress after adding dynamic fields
    setTimeout(() => {
        initializeFormProgress();
        updateFormProgress();
    }, 100);
}

// Enhanced Geolocation function with Map Integration
function getLocation(type) {
    const button = document.querySelector(`button[onclick="getLocation('${type}')"]`);
    let input;
    
    switch(type) {
        case 'pickup':
            input = document.getElementById('pickupLocation');
            break;
        case 'drop':
            input = document.getElementById('dropLocation');
            break;
        case 'delivery':
            input = document.getElementById('deliveryAddress');
            break;
    }
    
    if (!input || !navigator.geolocation) {
        showLocationError('Geolocation is not supported by this browser.');
        return;
    }
    
    button.textContent = '📍 Getting...';
    button.disabled = true;
    button.classList.add('loading');
    
    const options = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000 // 5 minutes
    };
    
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            try {
                // Get readable address using reverse geocoding
                const address = await reverseGeocode(lat, lng);
                input.value = address;
                
                // Create map link for MDSL Automoto
                const mapUrl = `https://www.google.com/maps/dir/${lat},${lng}/MDSL+Automoto`;
                
                // Store coordinates for WhatsApp message
                input.dataset.coordinates = `${lat},${lng}`;
                input.dataset.mapUrl = mapUrl;
                
                button.textContent = '✅ Location Set';
                button.style.background = 'var(--gradient-success)';
                
                // Show success notification
                showLocationSuccess(`Location set: ${address}`);
                
                setTimeout(() => {
                    button.textContent = '📍 Get Location';
                    button.style.background = 'var(--gradient-blue)';
                    button.disabled = false;
                    button.classList.remove('loading');
                }, 2000);
                
            } catch (error) {
                console.error('Geocoding error:', error);
                // Fallback to coordinates
                input.value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                input.dataset.coordinates = `${lat},${lng}`;
                input.dataset.mapUrl = `https://www.google.com/maps/dir/${lat},${lng}/MDSL+Automoto`;
                
                button.textContent = '✅ Coordinates Set';
                button.style.background = 'var(--gradient-success)';
                
                setTimeout(() => {
                    button.textContent = '📍 Get Location';
                    button.style.background = 'var(--gradient-blue)';
                    button.disabled = false;
                    button.classList.remove('loading');
                }, 2000);
            }
        },
        (error) => {
            let errorMessage = 'Unable to retrieve location. ';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage += 'Location access denied by user.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage += 'Location information unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage += 'Location request timed out.';
                    break;
                default:
                    errorMessage += 'Unknown error occurred.';
                    break;
            }
            
            showLocationError(errorMessage + ' Please enter the address manually.');
            button.textContent = '📍 Get Location';
            button.disabled = false;
            button.classList.remove('loading');
        },
        options
    );
}

// Reverse Geocoding Function
async function reverseGeocode(lat, lng) {
    try {
        // Using OpenStreetMap Nominatim API (free alternative to Google)
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        
        if (!response.ok) {
            throw new Error('Geocoding service unavailable');
        }
        
        const data = await response.json();
        
        if (data && data.display_name) {
            return data.display_name;
        } else {
            throw new Error('No address found');
        }
    } catch (error) {
        console.error('Reverse geocoding failed:', error);
        throw error;
    }
}

// Location Success Notification
function showLocationSuccess(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--gradient-success);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: var(--shadow-floating);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 350px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    notification.innerHTML = `
        <span style="font-size: 1.5rem;">📍</span>
        <div>
            <strong>Location Found!</strong><br>
            <small>${message}</small>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Location Error Notification
function showLocationError(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--gradient-accent);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: var(--shadow-floating);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 350px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    notification.innerHTML = `
        <span style="font-size: 1.5rem;">⚠️</span>
        <div>
            <strong>Location Error</strong><br>
            <small>${message}</small>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 6000);
}

// Enhanced Form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Collect checkbox values
    const checkboxGroups = ['additionalServices', 'documentsNeeded'];
    checkboxGroups.forEach(group => {
        const checkboxes = contactForm.querySelectorAll(`input[name="${group}"]:checked`);
        data[group] = Array.from(checkboxes).map(cb => cb.value);
    });
    
    // Validate required fields
    const requiredFields = contactForm.querySelectorAll('[required]');
    let isValid = true;
    let firstInvalidField = null;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = 'var(--error-color)';
            field.style.boxShadow = '0 0 0 4px rgba(220, 38, 38, 0.1)';
            isValid = false;
            if (!firstInvalidField) firstInvalidField = field;
        } else {
            field.style.borderColor = 'var(--success-color)';
            field.style.boxShadow = '0 0 0 4px rgba(5, 150, 105, 0.1)';
        }
    });
    
    if (!isValid) {
        showValidationError('Please fill in all required fields marked with *');
        firstInvalidField.focus();
        return;
    }
    
    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '📤 Sending...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    // Generate enhanced WhatsApp message
    const message = generateEnhancedWhatsAppMessage(data);
    
    // WhatsApp number (replace with actual number)
    const whatsappNumber = '+2349163161616'; // Replace with actual WhatsApp number
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // Simulate processing delay
    setTimeout(() => {
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Show success message
        showSuccessMessage();
        
        // Reset form after successful submission
        setTimeout(() => {
            contactForm.reset();
            servicePills.forEach(p => p.classList.remove('active'));
            dynamicFields.innerHTML = '';
            updateFormProgress();
        }, 2000);
        
        // Reset button
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
        }, 3000);
    }, 1500);
});

function generateEnhancedWhatsAppMessage(data) {
    let message = `🚗 *MDSL AUTOMOTO - SERVICE REQUEST*\n`;
    message += `═══════════════════════════════════\n\n`;
    
    // Customer Information
    message += `👤 *CUSTOMER DETAILS*\n`;
    message += `▫️ Name: ${data.name}\n`;
    message += `▫️ Phone: ${data.phone}\n`;
    if (data.email) message += `▫️ Email: ${data.email}\n`;
    if (data.preferredContact) message += `▫️ Preferred Contact: ${data.preferredContact}\n`;
    message += `\n`;
    
    // Service Information
    message += `🔧 *SERVICE REQUESTED*\n`;
    message += `▫️ Service: ${getServiceName(data.service)}\n`;
    if (data.priority) message += `▫️ Priority: ${data.priority}\n`;
    if (data.budget) message += `▫️ Budget Range: ${data.budget}\n`;
    message += `\n`;
    
    // Service-specific details
    if (data.service === 'repair' || data.service === 'maintenance') {
        message += `🚙 *VEHICLE INFORMATION*\n`;
        message += `▫️ Vehicle: ${data.vehicleInfo}\n`;
        if (data.mileage) message += `▫️ Mileage: ${data.mileage} miles\n`;
        if (data.lastService) message += `▫️ Last Service: ${data.lastService}\n`;
        if (data.warrantyStatus) message += `▫️ Warranty: ${data.warrantyStatus}\n`;
        message += `\n`;
        
        message += `⚠️ *ISSUE DESCRIPTION*\n`;
        message += `${data.issue}\n\n`;
        
        message += `📍 *LOCATION DETAILS*\n`;
        const pickupInput = document.getElementById('pickupLocation');
        const dropInput = document.getElementById('dropLocation');
        
        message += `▫️ Pickup: ${data.pickupLocation}\n`;
        if (pickupInput && pickupInput.dataset.mapUrl) {
            message += `🗺️ Pickup Map: ${pickupInput.dataset.mapUrl}\n`;
        }
        
        message += `▫️ Drop-off: ${data.dropLocation}\n`;
        if (dropInput && dropInput.dataset.mapUrl) {
            message += `🗺️ Drop-off Map: ${dropInput.dataset.mapUrl}\n`;
        }
        
        if (data.preferredDate) message += `▫️ Preferred Date: ${data.preferredDate}\n`;
        if (data.preferredTime) message += `▫️ Preferred Time: ${data.preferredTime}\n`;
        message += `\n`;
        
        if (data.additionalServices && data.additionalServices.length > 0) {
            message += `➕ *ADDITIONAL SERVICES*\n`;
            data.additionalServices.forEach(service => {
                message += `▫️ ${service}\n`;
            });
            message += `\n`;
        }
        
    } else if (data.service === 'import-export') {
        message += `🌍 *IMPORT/EXPORT DETAILS*\n`;
        message += `▫️ Service Type: ${data.serviceType}\n`;
        if (data.vehicleType) message += `▫️ Vehicle Type: ${data.vehicleType}\n`;
        message += `▫️ Origin: ${data.origin}\n`;
        message += `▫️ Destination: ${data.destination}\n`;
        if (data.vehicleCondition) message += `▫️ Condition: ${data.vehicleCondition}\n`;
        if (data.estimatedValue) message += `▫️ Estimated Value: $${data.estimatedValue}\n`;
        if (data.timeline) message += `▫️ Timeline: ${data.timeline}\n`;
        if (data.shippingMethod) message += `▫️ Shipping Method: ${data.shippingMethod}\n`;
        message += `\n`;
        
        message += `🚗 *VEHICLE SPECIFICATIONS*\n`;
        message += `${data.vehicleDetails}\n\n`;
        
        if (data.documentsNeeded && data.documentsNeeded.length > 0) {
            message += `📋 *DOCUMENTATION SERVICES*\n`;
            data.documentsNeeded.forEach(doc => {
                message += `▫️ ${doc}\n`;
            });
            message += `\n`;
        }
        
        if (data.specialRequirements) {
            message += `⭐ *SPECIAL REQUIREMENTS*\n`;
            message += `${data.specialRequirements}\n\n`;
        }
        
    } else if (data.service === 'spare-parts') {
        message += `⚙️ *SPARE PARTS REQUEST*\n`;
        message += `▫️ Category: ${data.partCategory}\n`;
        message += `▫️ Vehicle: ${data.vehicleModel}\n`;
        if (data.engineSize) message += `▫️ Engine: ${data.engineSize}\n`;
        if (data.partNumber) message += `▫️ Part Number: ${data.partNumber}\n`;
        message += `▫️ Quantity: ${data.quantity}\n`;
        message += `▫️ Condition: ${data.condition}\n`;
        if (data.maxBudget) message += `▫️ Max Budget: $${data.maxBudget} per part\n`;
        if (data.urgencyLevel) message += `▫️ Urgency: ${data.urgencyLevel}\n`;
        message += `\n`;
        
        message += `📝 *PART DESCRIPTION*\n`;
        message += `${data.partDescription}\n\n`;
        
        if (data.deliveryMethod) {
            message += `🚚 *DELIVERY & INSTALLATION*\n`;
            message += `▫️ Delivery: ${data.deliveryMethod}\n`;
            if (data.deliveryAddress) {
                message += `▫️ Address: ${data.deliveryAddress}\n`;
                const deliveryInput = document.getElementById('deliveryAddress');
                if (deliveryInput && deliveryInput.dataset.mapUrl) {
                    message += `🗺️ Delivery Map: ${deliveryInput.dataset.mapUrl}\n`;
                }
            }
            if (data.installationNeeded) message += `▫️ Installation: ${data.installationNeeded}\n`;
            if (data.alternativeParts) message += `▫️ Alternatives: ${data.alternativeParts}\n`;
            message += `\n`;
        }
    }
    
    // Additional Information
    if (data.message) {
        message += `💬 *ADDITIONAL NOTES*\n`;
        message += `${data.message}\n\n`;
    }
    
    // Marketing preferences
    if (data.newsletter || data.smsUpdates) {
        message += `📢 *COMMUNICATION PREFERENCES*\n`;
        if (data.newsletter) message += `▫️ Newsletter subscription: Yes\n`;
        if (data.smsUpdates) message += `▫️ SMS updates: Yes\n`;
        message += `\n`;
    }
    
    // Footer
    message += `═══════════════════════════════════\n`;
    message += `📅 *Submitted:* ${new Date().toLocaleString()}\n`;
    message += `🏢 *MDSL Automoto* - Professional Automotive Services\n`;
    message += `📍 *Find us on Google Maps:* https://maps.google.com/search/MDSL+Automoto\n`;
    message += `\n*Please provide a detailed quote and timeline for this service request. Thank you!*`;
    
    return message;
}

function getServiceName(service) {
    const serviceNames = {
        'repair': '🔧 Expert Car Repair',
        'maintenance': '🛠️ Preventive Maintenance',
        'import-export': '🚗 Vehicle Import & Export',
        'spare-parts': '⚙️ Genuine Spare Parts'
    };
    return serviceNames[service] || service;
}

function showValidationError(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--gradient-accent);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: var(--shadow-floating);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 350px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    notification.innerHTML = `
        <span style="font-size: 1.5rem;">⚠️</span>
        <div>
            <strong>Validation Error</strong><br>
            <small>${message}</small>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function showSuccessMessage() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--gradient-success);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: var(--shadow-floating);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 350px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    notification.innerHTML = `
        <span style="font-size: 1.5rem;">✅</span>
        <div>
            <strong>Message Sent!</strong><br>
            <small>Redirecting to WhatsApp...</small>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Enhanced scroll animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .about-content, .ceo-section, .stat-item');
    animatedElements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
}

// Enhanced service card interactions
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
        card.style.transition = 'var(--transition-fast)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(-5px) scale(1)';
    });
});

// Form reset functionality
contactForm.addEventListener('reset', () => {
    setTimeout(() => {
        servicePills.forEach(p => p.classList.remove('active'));
        dynamicFields.innerHTML = '';
        updateFormProgress();
        
        // Reset field styles
        const allFields = contactForm.querySelectorAll('input, select, textarea');
        allFields.forEach(field => {
            field.style.borderColor = 'rgba(245, 158, 11, 0.2)';
            field.style.boxShadow = 'none';
        });
    }, 100);
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Performance optimization: Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(() => {
        // Scroll-based animations can be added here
    }, 10);
});