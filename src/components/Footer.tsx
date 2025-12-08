export default function Footer() {
  return (
    <footer className="bg-blue-950/80 backdrop-blur-lg text-white py-12 mt-auto border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-gradient mb-4">Curierul Perfect</h3>
            <p className="text-gray-400 text-sm">
              Platforma care conectează românii cu curieri de încredere din toată Europa.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="text-green-400 font-semibold mb-4">Link-uri utile</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-green-400 transition-colors text-sm">Despre noi</a>
              <a href="#" className="block text-gray-400 hover:text-green-400 transition-colors text-sm">Cum funcționează</a>
              <a href="#" className="block text-gray-400 hover:text-green-400 transition-colors text-sm">Întrebări frecvente</a>
            </div>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="text-green-400 font-semibold mb-4">Legal</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-green-400 transition-colors text-sm">Termeni și condiții</a>
              <a href="#" className="block text-gray-400 hover:text-green-400 transition-colors text-sm">Politica de confidențialitate</a>
              <a href="#" className="block text-gray-400 hover:text-green-400 transition-colors text-sm">Contact</a>
            </div>
          </div>
        </div>
        
        <div className="gradient-line mb-4"></div>
        
        <div className="text-center text-gray-500 text-sm">
          <p>&copy; 2025 Curierul Perfect. Toate drepturile rezervate.</p>
        </div>
      </div>
    </footer>
  );
}
