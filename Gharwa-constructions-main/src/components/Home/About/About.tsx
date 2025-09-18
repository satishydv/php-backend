import React from 'react'
import Image from 'next/image'

const About = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          
          {/* Text Content - Full width on small, left side on medium+ */}
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              About{' '}
              <span className="text-yellow-500">Us</span>
            </h2>
            
            {/* Blue accent line */}
            <div className="w-20 h-1 bg-yellow-500 mb-8"></div>
            
            <div className="space-y-6 text-gray-700 text-base md:text-lg leading-relaxed">
              <p>
                <span className="text-yellow-500 font-semibold">Gharwa Development Pvt. Ltd.</span> stands at the forefront of modern construction, focusing on innovative techniques, sustainable materials, and smart building solutions. With a team of experienced engineers, architects, and project managers, we are committed to transforming your vision into reality—be it a single-family home, a luxury villa, or a housing complex.
              </p>
            </div>
            
            {/* Services Section */}
            <div className="mt-12">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                Services Offered
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Custom Home Construction</h4>
                    <p className="text-gray-600 text-sm md:text-base">Tailored design and construction services to bring your dream home to life, with attention to detail and personalized features.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Residential Project Development</h4>
                    <p className="text-gray-600 text-sm md:text-base">From villas to housing societies, our expertise covers all aspects of residential development, ensuring durability, functionality, and style.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Renovation & Remodeling</h4>
                    <p className="text-gray-600 text-sm md:text-base">Comprehensive renovation solutions to modernize and improve existing structures to meet evolving family needs.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Turnkey Solutions</h4>
                    <p className="text-gray-600 text-sm md:text-base">Complete, hassle-free project management from initial consultations through to final handover, with regular updates and transparent communication.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Image Section - Hidden on small screens, right side on medium+ */}
          <div className="hidden md:block order-1 md:order-2">
            <div className="relative h-96 lg:h-[500px] w-full">
              <Image
                src="/about/brand.png"
                alt="Professional construction team member"
                fill
                className="object-cover rounded-lg shadow-xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About