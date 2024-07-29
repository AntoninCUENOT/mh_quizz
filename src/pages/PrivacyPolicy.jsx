import React from 'react';
import { Link } from 'react-router-dom'; // Assurez-vous que 'react-router-dom' est installé

const PrivacyPolicy = () => {
    return (
        <div style={containerStyle}>
            <h1 style={headerStyle}>Privacy Policy</h1>
            
            <h3 style={sectionHeaderStyle}>1. Introduction</h3>
            <p style={paragraphStyle}>
                Welcome to [Your Site Name]! Protecting your personal data is essential to us. This privacy policy explains how we collect, use, and protect your information when you use our website.
            </p>
            
            <h3 style={sectionHeaderStyle}>2. Cookies and Tracking Technologies</h3>
            <p style={paragraphStyle}>
                We use cookies and other tracking technologies to provide our services. Cookies are files placed on your device to enhance your online experience, measure advertising effectiveness, and offer personalized content.
            </p>
            
            <h3 style={sectionHeaderStyle}>3. Collection and Use of Personal Data</h3>
            <p style={paragraphStyle}>
                We collect personal information that you provide to us directly, such as your name, email address, and contact details. This information is used to:
            </p>
            <ul style={listStyle}>
                <li>- Provide you with the services and features of our site.</li>
                <li>- Improve and personalize your experience on our site.</li>
                <li>- Send you important communications and updates.</li>
            </ul>
            
            <h3 style={sectionHeaderStyle}>4. Data Protection</h3>
            <p style={paragraphStyle}>
                We implement appropriate security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or method of electronic storage is completely secure. We strive to protect your data but cannot guarantee its absolute security.
            </p>
            
            <h3 style={sectionHeaderStyle}>5. Your Rights</h3>
            <p style={paragraphStyle}>
                You have the right to access, correct, or delete your personal information. You may also object to the processing of your data under certain circumstances. To exercise your rights, please contact us at [contact email address].
            </p>
            
            <h3 style={sectionHeaderStyle}>6. Changes to the Privacy Policy</h3>
            <p style={paragraphStyle}>
                We may update this privacy policy from time to time to reflect changes in our practices or to comply with legal requirements. Any changes will be posted on this page with an updated revision date.
            </p>
            
            <h3 style={sectionHeaderStyle}>7. Contact</h3>
            <p style={paragraphStyle}>
                For any questions regarding this privacy policy or our data protection practices, please contact us at:
                <br />
                [Your Site Name]
                <br />
                [Contact Address]
                <br />
                [Contact Email Address]
                <br />
                [Phone Number]
            </p>

            <p style={paragraphStyle}>Thank you for using [Your Site Name]! We appreciate your trust and are committed to protecting your privacy.</p>
            
            <div style={linkContainerStyle}>
                <Link to="/" style={linkStyle}>Go back to the homepage and start playing!</Link>
            </div>
        </div>
    );
};

const containerStyle = {
    textAlign: 'center',
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    background: 'black',
    borderRadius: '64px',
};

const headerStyle = {
    marginBottom: '20px',
};

const sectionHeaderStyle = {
    marginTop: '20px',
    marginBottom: '10px',
};

const paragraphStyle = {
    marginBottom: '15px',
    lineHeight: '1.6',
};

const linkStyle = {
    color: 'green',
    textDecoration: 'none',
    fontSize: '2rem',
    marginTop: '20px',
    display: 'inline-block',
};

const listStyle = {
    listStyleType: 'none',
    marginLeft: '0',
    paddingLeft: '0',
};

const linkContainerStyle = {
    marginTop: '30px',
};

export default PrivacyPolicy;
