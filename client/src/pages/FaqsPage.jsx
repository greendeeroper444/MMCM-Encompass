import React, { useState } from 'react'
import CustomNavbar from '../components/CustomNavbar'
import { useAuth } from '../../contexts/authContext';

export default function FaqsPage() {
    const {darkMode} = useAuth();

    const faqs = [
        {
            question: "What is EnCompass?",
            answer: "EnCompass is an online library and reference system designed specifically for students at Mapua Malayan College Mindanao. It provides easy access to capstone projects for research purposes."
        },
        {
            question: "How do I search for capstone projects?",
            answer: "To search for capstone projects, navigate to the 'Search for Capstone' section from the homepage. Enter keywords or filters to find relevant projects."
        },
        {
            question: "How do I view capstone project details?",
            answer: "Once you have found a capstone project of interest, click on it to view its details. You can access project abstracts, authors, and other relevant information."
        },
        {
            question: "How do I view my profile?",
            answer: "You can see your profile through the 'Profile' section."
        },
        {
            question: "How do I switch between dark and light modes?",
            answer: "In the 'Profile' section, you will find an option to toggle between dark and light modes. Choose the mode that suits your preference for browsing."
        },
        {
            question: "Do I need to log in to use EnCompass?",
            answer: "While some features may be accessible without logging in, certain functionalities, such as saving favorites and personalized recommendations, require google authentication. You can log in with MMCM Account through the 'Login' section."
        },
        {
            question: "Is EnCompass accessible on mobile devices?",
            answer: "Yes, EnCompass is optimized for mobile devices, allowing you to access capstone projects and other features on smartphones and tablets."
        },
        {
            question: "Can I download capstone projects from EnCompass?",
            answer: "Yes, you can download capstone projects from EnCompass. Once you find a project of interest and view its details, you will have the option to download associated files or documents."
        },
        {
            question: "How often is the capstone project database updated?",
            answer: "The capstone project database is regularly updated to ensure the inclusion of the latest projects. However, the frequency of updates may vary based on project submissions and reviews."
        },
        {
            question: "Are there any guidelines for citing capstone projects sourced from EnCompass?",
            answer: "EnCompass recommends citing capstone projects according to academic standards and citing the original source whenever possible. Consult your institution's guidelines for proper citation practices."
        },
        {
            question: "Can I contribute my capstone project to EnCompass?",
            answer: "EnCompass welcomes contributions from students and faculty members. If you would like to share your capstone project on the platform, please contact the EnCompass team for submission guidelines."
        }
    ];

    const [openIndex, setOpenIndex] = useState(null);

    // Function to toggle the open/close state of FAQ items
    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };
  
  return (
    <>
    <CustomNavbar />
        <div className="container" style={{ marginTop: '100px' }}>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h1 className="text-center mb-4">Frequently Asked Questions</h1>
                    <div className="accordion" id="faqAccordion">
                        {
                            faqs.map((faq, index) => (
                                <div className="accordion-item" key={index}>
                                    <h2 className="accordion-header" id={`heading${index}`}>
                                        <button className={`accordion-button ${darkMode ? ' dark-mode' : ''} ${openIndex === index ? 'focused' : 'collapsed'}`} type="button" onClick={() => toggleFAQ(index)}>
                                            <strong>{faq.question}</strong>
                                        </button>
                                    </h2>
                                    <div id={`collapse${index}`} className={`accordion-collapse collapse ${openIndex === index ? 'show' : ''}`} aria-labelledby={`heading${index}`} data-parent="#faqAccordion">
                                        <div className={`accordion-body ${openIndex === index ? 'success' : ''}`}>
                                        {faq.answer}
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <br />
                    <br />
                    <br />
                </div>
            </div>
        </div>
    </>
  )
}
