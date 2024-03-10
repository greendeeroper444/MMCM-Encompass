import React from 'react'
import CustomNavbar from '../components/CustomNavbar'

export default function AboutPage() {
  return (
    <>
    <CustomNavbar />
        <div className="container" style={{ marginTop: '100px' }}>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h1 className="text-center mb-4">About of EnCompass</h1>
                    <p>
                        EnCompass: An Online Library and References for Capstone Research Projects is a comprehensive platform designed to serve the students of Mapua Malayan College Mindanao. Our aim is to revolutionize the way students interact with capstone projects, offering an extensive repository of research endeavors undertaken by peers and faculty members alike.
                    </p>
                    <p>
                        At the heart of EnCompass lies a commitment to providing students with unparalleled access to knowledge and innovation. Through our intuitive interface and robust search functionality, students can effortlessly navigate through a vast array of capstone projects spanning various disciplines and subjects. Whether it's exploring cutting-edge research in engineering, delving into groundbreaking studies in computer science, or uncovering insightful analyses in business administration, EnCompass empowers students to discover, engage with, and learn from the latest advancements in their fields of interest.
                    </p>
                    <p>
                        EnCompass not only streamlines the process of finding capstone projects but also fosters a dynamic learning community where students can collaborate, share insights, and draw inspiration from one another's work. With features such as profile and dark mode toggling, EnCompass tailors the user experience to suit individual preferences, ensuring seamless navigation and comfortable browsing for all users.
                    </p>
                    <p>
                        Join us on this journey of exploration and discovery as we pave the way for a new era of academic inquiry and innovation. With EnCompass, the possibilities are limitless, and the knowledge is boundless.
                    </p>
                    <br />
                    <br />
                    <br />
                </div>
            </div>
        </div>
    </>
  )
}
