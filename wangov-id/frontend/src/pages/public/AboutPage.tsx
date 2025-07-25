import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-green-900 py-16">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-20"
            src="/images/freetown-sierra-leone.jpg"
            alt="Freetown, Sierra Leone"
          />
          <div className="absolute inset-0 bg-green-800 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">About WanGov-ID</h1>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-green-100">
              Sierra Leone's National Digital Identity System
            </p>
          </div>
        </div>
      </div>

      {/* Mission section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">Our Mission</h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
              Empowering Sierra Leoneans through Digital Identity
            </p>
            <div className="mt-8 text-xl text-gray-500 max-w-3xl mx-auto">
              <p>
                WanGov-ID aims to provide a robust, inclusive, and secure digital identity system for all Sierra Leonean citizens and residents. We believe that digital identity is fundamental to ensuring equal access to public services and enabling digital transformation across the country.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vision section */}
      <div className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
              <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">Our Vision</h2>
              <p className="mt-2 text-3xl font-extrabold text-gray-900">A fully connected digital society</p>
              <p className="mt-4 text-lg text-gray-500">
                We envision a Sierra Leone where every citizen has access to a unique, verifiable digital identity that empowers them to:
              </p>
              <div className="mt-6">
                <div className="space-y-4">
                  {[
                    'Access government services seamlessly',
                    'Participate fully in the digital economy',
                    'Exercise their rights and responsibilities as citizens',
                    'Protect their personal data and privacy',
                    'Connect securely with public and private service providers'
                  ].map((item, index) => (
                    <div key={index} className="flex">
                      <div className="flex-shrink-0">
                        <svg 
                          className="h-6 w-6 text-green-500" 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M5 13l4 4L19 7" 
                          />
                        </svg>
                      </div>
                      <p className="ml-3 text-base text-gray-500">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden">
                <img
                  src="/images/digital-inclusion.jpg"
                  alt="Digital inclusion"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">How It Works</h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
              The WanGov-ID System
            </p>
          </div>

          <div className="mt-16">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-600 text-white">
                  <span className="text-xl font-bold">1</span>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Registration</p>
                <div className="mt-2 ml-16 text-base text-gray-500">
                  <p>Citizens register at designated enrollment centers with basic documentation. Biometric data (fingerprints, photo) is collected to ensure uniqueness.</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-600 text-white">
                  <span className="text-xl font-bold">2</span>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Verification</p>
                <div className="mt-2 ml-16 text-base text-gray-500">
                  <p>Information is verified against national databases. Duplicate checks ensure one person receives only one identity.</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-600 text-white">
                  <span className="text-xl font-bold">3</span>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">ID Issuance</p>
                <div className="mt-2 ml-16 text-base text-gray-500">
                  <p>A unique digital ID is issued. Citizens receive a physical ID card and digital credentials for online services.</p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-600 text-white">
                  <span className="text-xl font-bold">4</span>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Service Access</p>
                <div className="mt-2 ml-16 text-base text-gray-500">
                  <p>Citizens can use their ID to access government services, open bank accounts, receive healthcare, and more - both in-person and online.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits section */}
      <div className="bg-green-700">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-extrabold text-white">Benefits of WanGov-ID</h2>
          
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <svg 
                  className="h-8 w-8 text-green-600" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                  />
                </svg>
                <h3 className="ml-3 text-xl font-medium text-gray-900">For Citizens</h3>
              </div>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Single identity for all government services</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Reduced paperwork and bureaucracy</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Digital access to government documents</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Improved access to financial services</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Enhanced privacy and data protection</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <svg 
                  className="h-8 w-8 text-green-600" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                  />
                </svg>
                <h3 className="ml-3 text-xl font-medium text-gray-900">For Government</h3>
              </div>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Improved service delivery</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Reduced fraud and corruption</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Better policy planning with accurate data</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Cost savings through digital processes</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Enhanced national security</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <svg 
                  className="h-8 w-8 text-green-600" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                  />
                </svg>
                <h3 className="ml-3 text-xl font-medium text-gray-900">For Organizations</h3>
              </div>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Simplified customer verification</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Reduced KYC compliance costs</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Improved service personalization</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Seamless integration with government systems</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Enhanced fraud prevention</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Contact section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">Contact Us</h2>
            <p className="mt-1 text-3xl font-extrabold text-gray-900 sm:text-4xl sm:tracking-tight">
              Get in Touch
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Have questions about WanGov-ID? We're here to help.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-600 text-white mx-auto">
                <svg 
                  className="h-6 w-6" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Email</h3>
              <p className="mt-2 text-base text-gray-500">info@wangov-id.gov.sl</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-600 text-white mx-auto">
                <svg 
                  className="h-6 w-6" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Phone</h3>
              <p className="mt-2 text-base text-gray-500">+232 76 123456</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-600 text-white mx-auto">
                <svg 
                  className="h-6 w-6" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Address</h3>
              <p className="mt-2 text-base text-gray-500">
                Ministry of Information and Communications<br />
                Youyi Building, Brookfields<br />
                Freetown, Sierra Leone
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
