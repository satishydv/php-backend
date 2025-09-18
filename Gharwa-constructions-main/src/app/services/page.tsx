import React from 'react'
import { Check } from 'lucide-react'

const ServicesPage = () => {
  const services = [
    {
      icon: "🏗️",
      title: "Construction & Building",
      description: "Complete construction services from foundation to finishing. We build residential and commercial structures with precision and quality.",
      features: [
        "Residential Construction",
        "Commercial Buildings", 
        "Foundation Work",
        "Structural Framing"
      ],
      color: "bg-red-500"
    },
    {
      icon: "🏠",
      title: "Architecture Design",
      description: "Custom architectural design and planning services. From concept to blueprints, we create innovative and functional designs.",
      features: [
        "Custom Home Design",
        "Commercial Architecture",
        "3D Modeling & Visualization",
        "Building Permits"
      ],
      color: "bg-blue-500"
    },
    {
      icon: "🔧",
      title: "Renovation & Remodeling",
      description: "Transform your existing spaces with our renovation and remodeling services. Modern updates that enhance functionality and value.",
      features: [
        "Kitchen Renovations",
        "Bathroom Remodeling",
        "Interior Design",
        "Space Optimization"
      ],
      color: "bg-yellow-500"
    },
    {
      icon: "⚡",
      title: "Electrical Services",
      description: "Professional electrical installation, maintenance, and repair services. Safe and efficient electrical solutions for all projects.",
      features: [
        "Wiring & Installation",
        "Electrical Repairs",
        "Safety Inspections",
        "Smart Home Integration"
      ],
      color: "bg-purple-500"
    },
    {
      icon: "🚰",
      title: "Plumbing Services",
      description: "Complete plumbing solutions for new construction and existing buildings. Reliable water and drainage systems.",
      features: [
        "Pipe Installation",
        "Drainage Systems",
        "Water Heater Services",
        "Emergency Repairs"
      ],
      color: "bg-orange-500"
    },
    {
      icon: "🎨",
      title: "Interior Finishing",
      description: "Beautiful interior finishing touches that bring your vision to life. Quality craftsmanship in every detail.",
      features: [
        "Painting & Wallpaper",
        "Flooring Installation",
        "Crown Molding",
        "Custom Cabinetry"
      ],
      color: "bg-cyan-500"
    }
  ]

  return (
    <div className="min-h-screen w-full relative bg-white">
      {/* Warm Orange Glow Left */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#ffffff",
          backgroundImage: `
            radial-gradient(
              circle at top left,
              rgba(255, 140, 60, 0.5),
              transparent 70%
            )
          `,
          filter: "blur(80px)",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16 mt-16">
          <p className="text-red-600 text-sm font-semibold mb-2">Our Services</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-8">
            Professional Construction Services
          </h1>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100">
              {/* Icon */}
              <div className={`w-16 h-16 ${service.color} rounded-lg flex items-center justify-center mb-6`}>
                <span className="text-2xl text-white">{service.icon}</span>
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {service.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed text-justify">
                {service.description}
              </p>
              
              {/* Features List */}
              <ul className="space-y-3">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                    <div className={`w-5 h-5 ${service.color} rounded-full flex items-center justify-center mr-3 flex-shrink-0`}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Get in Touch →
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServicesPage
