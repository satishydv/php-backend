import React from 'react'
import Image from 'next/image'
import { MapPin, Calendar, ArrowRight } from 'lucide-react'

const ProjectsPage = () => {
  const projects = [
    {
      id: 1,
      image: "/project/p-1.jpg",
      title: "Modern Urban Housing Project",
      description: "A sleek residential development featuring sustainable design, smart layouts, and modern amenities for contemporary living.",
      location: "102.2 Sylhet, Ranchi",
      duration: "12-2024/4-2025"
    },
    {
      id: 2,
      image: "/project/p-2.jpg",
      title: "Downtown Office Tower Build",
      description: "A high-rise commercial tower designed for modern businesses, with efficient space planning and cutting-edge technology.",
      location: "Downtown Business District",
      duration: "8-2024/12-2025"
    },
    {
      id: 3,
      image: "/project/p-3.jpg",
      title: "Coastal Bridge Expansion Project",
      description: "An advanced infrastructure project focused on enhancing regional connectivity through durable engineering solutions.",
      location: "Coastal Highway Route",
      duration: "6-2024/10-2025"
    },
    {
      id: 4,
      image: "/project/p-4.jpeg",
      title: "Green Valley Apartment Complex",
      description: "A modern residential development featuring eco-friendly design, premium amenities, and smart home integration.",
      location: "Green Valley District",
      duration: "3-2024/9-2025"
    },
    {
      id: 5,
      image: "/project/p-5.jpg",
      title: "Skyline Commercial Office Tower",
      description: "A high-rise office space built for productivity and energy efficiency in a bustling business district.",
      location: "Central Business Hub",
      duration: "1-2024/8-2025"
    },
    {
      id: 6,
      image: "/project/p-6.jpg",
      title: "Heritage Urban Retail Plaza",
      description: "An open-concept commercial plaza blending contemporary architecture with pedestrian-friendly layout design.",
      location: "Heritage City Center",
      duration: "5-2024/11-2025"
    },
    {
      id: 7,
      image: "/project/p-7.jpg",
      title: "Sunrise Hillview Luxury Villas",
      description: "A gated community of high-end villas offering panoramic views, spacious layouts, and custom interiors.",
      location: "Sunrise Hills Estate",
      duration: "2-2024/7-2025"
    },
    {
      id: 8,
      image: "/project/p-8.jpg",
      title: "Silverstone Industrial Warehouse Hub",
      description: "A large-scale logistics and storage facility built to meet modern warehousing and operational needs.",
      location: "Silverstone Industrial Zone",
      duration: "4-2024/10-2025"
    },
    {
      id: 9,
      image: "/project/p-9.jpg",
      title: "Oakridge Public School Campus",
      description: "A complete educational infrastructure project with classrooms, labs, sports facilities, and green spaces.",
      location: "Oakridge Education District",
      duration: "7-2024/12-2025"
    }
  ]

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="mb-16 mt-16">
          <div className="flex justify-between items-start mb-7">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-orange-500 mb-6">
                Discover Our Completed Projects
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-3xl text-justify">
                Every project we complete is a reflection of our commitment to quality, precision, and client satisfaction. 
                At Garhwa Construction, we take pride in transforming ideas into built reality.
              </p>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
              {/* Project Image with Diagonal Cut */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
                {/* Diagonal Cut Effect */}
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[60px] border-l-transparent border-t-[60px] border-t-white"></div>
              </div>
              
              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {project.title}
                </h3>
                
                <p className="text-gray-600 mb-4 leading-relaxed text-justify">
                  {project.description}
                </p>
                
                {/* Project Details */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    {project.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    {project.duration}
                  </div>
                </div>
                
                {/* View More Link */}
                <a 
                  href="#" 
                  className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium transition-colors duration-200"
                >
                  View More
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectsPage
