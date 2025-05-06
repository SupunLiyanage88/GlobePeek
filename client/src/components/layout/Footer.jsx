import { motion } from "framer-motion";
import { FaGithub, FaTwitter, FaLinkedin, FaGlobe, FaFacebook } from "react-icons/fa";
import logo from "../../assets/logo/icon.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = [
    {
      title: "Explore",
      items: [
        { name: "Countries", href: "/countries" },
        { name: "Regions", href: "/regions" },
        { name: "Statistics", href: "/stats" },
        { name: "Compare", href: "/compare" },
      ],
    },
    {
      title: "Resources",
      items: [
        { name: "API Docs", href: "https://restcountries.com/" },
        { name: "GitHub", href: "https://github.com/SupunLiyanage88?tab=repositories" },
      ],
    },
    {
      title: "Company",
      items: [
        { name: "About Us", href: "/about" },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FaGithub />, href: "https://github.com/SupunLiyanage88" },
    { icon: <FaFacebook />, href: "https://web.facebook.com/supun.liyanage08" },
    { icon: <FaLinkedin />, href: "https://www.linkedin.com/in/supun-liyanage-600790223/" },
    { icon: <FaGlobe />, href: "https://supunliyanage.netlify.app/" },
  ];

  return (
    <footer className="bg-gradient-to-br from-[#f8fafc] to-[#f0f4f8] border-t border-[#e2e8f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center">
              <img
                src={logo}
                alt="GlobePeek Logo"
                className="h-8 w-auto mr-2"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-[#007BFF] to-[#00B4D8] bg-clip-text text-transparent">
                GlobePeek
              </span>
            </div>
            <p className="text-[#64748b]">
              Your interactive gateway to global country data and statistics.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2, scale: 1.1 }}
                  className="text-[#64748b] hover:text-[#007BFF] transition-colors text-xl"
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer links */}
          {links.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-[#1e293b]">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <motion.a
                      href={item.href}
                      whileHover={{ x: 4 }}
                      className="text-[#64748b] hover:text-[#007BFF] transition-colors"
                    >
                      {item.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-[#e2e8f0] flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-[#64748b] text-center md:text-left">
            © {currentYear} GlobePeek. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="/privacy"
              className="text-[#64748b] hover:text-[#007BFF] transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms"
              className="text-[#64748b] hover:text-[#007BFF] transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="/cookies"
              className="text-[#64748b] hover:text-[#007BFF] transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
