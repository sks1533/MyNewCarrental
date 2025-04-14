// Helper function to scroll to a section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Simulate renting a car
function rentCar(carName) {
    let phoneNumber = "+918619810822"; // Your WhatsApp Number
    let message = `Hello, I would like to book the ${carName} for rent. Please provide more details.`;
    
    let whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappURL, "_blank");
}
// Form submission logic
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        if (name && email && message) {
            alert('Thank you for contacting us, ' + name + '! We will get back to you shortly.');
            contactForm.reset();
        } else {
            alert('Please fill in all the fields.');
        }
    });
}
