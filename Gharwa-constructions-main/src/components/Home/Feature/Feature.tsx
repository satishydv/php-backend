import React from 'react'
import Image from 'next/image'

const Feature = () => {
  const services = [
    {
      icon: "/Feature/f1.svg",
      title: "Architecture Design",
      description: "Custom architectural designing, planning, and implementation tailored to your construction needs. From concept to completion, we deliver innovative solutions."
    },
    {
      icon: "/Feature/f2.svg", 
      title: "Construction Services",
      description: "Comprehensive construction and building services for residential and commercial projects. Creating quality structures that stand the test of time."
    },
    {
      icon: "/Feature/f3.svg",
      title: "Project Management",
      description: "Professional project management and supervision services. From planning to execution, we ensure timely delivery and quality standards."
    },
    {
      icon: "/Feature/f4.svg",
      title: "Quality Assurance",
      description: "Rigorous quality control and testing processes to ensure all construction work meets the highest standards and safety requirements."
    },
    {
      icon: "/Feature/f5.svg",
      title: "Client Partnership",
      description: "Building long-term relationships with clients through transparent communication, reliable service, and exceptional project delivery."
    },
    {
      icon: "/Feature/f6.svg",
      title: "Technical Support",
      description: "Ongoing technical assistance and maintenance services to keep your construction projects running smoothly and efficiently."
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Our{' '}
            <span className="text-yellow-500">Services</span>
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
        </div>

        {/* Main Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <Image
                    src={service.icon}
                    alt={service.title}
                    width={100}
                    height={100}
                    className="w-90 h-90"
                  />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                {service.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed text-center">
                {service.description}
              </p>
            </div>
          ))}
        </div>


      </div>
    </section>
  )
}

export default Feature