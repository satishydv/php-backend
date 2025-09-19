import React from 'react'
import Image from 'next/image'

const OverView = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          
          {/* Text Content - Full width on small, spans 2 columns on medium+ */}
          <div className="md:col-span-2">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              {/* Welcome To{' '} */}
              <span className="text-yellow-500">Overview</span>
            </h2>
            
            {/* Blue accent line */}
            <div className="w-20 h-1 bg-yellow-500 mb-8"></div>

            <div className="space-y-6 text-gray-700 text-base md:text-lg leading-relaxed text-justify">
              <p className='text-justify'>
                <span className="text-yellow-500 font-semibold text-justify">Gharwa Development</span> is a leading 
                construction company committed to delivering comprehensive building solutions and services. 
                We specialize in transforming architectural visions into reality through innovative 
                construction methods that drive efficiency, quality, and sustainable development. With 
                deep expertise in design, construction, project management, and maintenance, we provide 
                end-to-end construction solutions tailored to meet the unique needs of our clients.
              </p>
              
              <p className='text-justify'>
                Our services include high-quality residential construction, commercial buildings, 
                infrastructure development, renovation projects, and a wide range of construction-related 
                services. At <span className="text-yellow-500 font-semibold">Gharwa Development</span>, 
                we take pride in our team of highly skilled professionals who are passionate about 
                construction excellence and focused on delivering outstanding results.
              </p>
              
              <p className='text-justify'>
                Leveraging the latest construction technologies and best practices, we ensure 
                timely delivery and scalable solutions that empower our clients to achieve their 
                construction goals.                 Whether you&apos;re planning a new residential project or an 
                established business seeking construction services, Garhwa Construction is your 
                trusted construction partner—dedicated to quality, innovation, and long-term success.
              </p>
            </div>
            
            {/* Call to Action Button */}
            <div className="mt-8">
              <button className="bg-red-700 hover:bg-red-800 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-300 shadow-lg">
                Read More
              </button>
            </div>
          </div>
          
          {/* Image Section - Hidden on small screens, spans 1 column on medium+ */}
          <div className="hidden md:block md:col-span-1 mt-10">
            <div className="relative h-96 lg:h-[500px] w-full">
              <Image
                src="/overview/overview.jpg"
                alt="Construction overview"
                fill
                className="object-cover rounded-lg shadow-xl object-center justify-center"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OverView