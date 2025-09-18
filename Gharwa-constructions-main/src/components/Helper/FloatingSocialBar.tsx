import React from 'react';
import { FaFacebook, FaInstagram, FaWhatsapp, FaYoutube } from 'react-icons/fa';

const FloatingSocialBar = () => {
  const socialLinks = [
    { icon: FaFacebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: FaYoutube, href: 'https://youtube.com', label: 'YouTube' },
    { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: FaWhatsapp, href: 'https://whatsapp.com', label: 'Whatsapp' },
  ];

  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50">
      <div className="bg-black/70 backdrop-blur-sm rounded-l-lg p-3 shadow-lg group">
        <div className="flex flex-col space-y-4">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-500 hover:text-blue-400 transition-all duration-300 p-2 hover:bg-gray-800 rounded-lg flex items-center space-x-3 group-hover:w-48 w-12 overflow-hidden "
              aria-label={social.label}
            >
              <social.icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {social.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloatingSocialBar;
