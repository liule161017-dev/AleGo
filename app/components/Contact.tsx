import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Contact() {
  return (
    <section className="py-16 px-4 bg-[#fafafa] text-center">
      <h2 className="text-2xl font-bold mb-8 uppercase">Get in Touch</h2>
      <div className="flex justify-center gap-6 mb-10">
        {[
          { icon: <FaFacebook size={28} />, name: "Facebook" },
          { icon: <FaTwitter size={28} />, name: "Twitter" },
          { icon: <FaInstagram size={28} />, name: "Instagram" }
        ].map((social, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm w-32 hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-[#4f6eff] mb-2 flex justify-center">{social.icon}</div>
            <p className="text-sm font-medium">{social.name}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-10">
        <div className="text-center">
           <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 mb-2 border border-dashed border-gray-400">QR Code</div>
           <p className="text-sm text-gray-700">WhatsApp</p>
        </div>
        <div className="text-center">
           <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 mb-2 border border-dashed border-gray-400">QR Code</div>
           <p className="text-sm text-gray-700">WeChat / Pay</p>
        </div>
      </div>
    </section>
  );
}