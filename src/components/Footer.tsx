export default function Footer() {
  return (
    <footer className="bg-blue-950 text-white py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="mb-4">&copy; 2025 Curierul Perfect. Toate drepturile rezervate.</p>
        <div className="flex justify-center gap-6">
          <a href="#" className="hover:text-green-400 transition-colors">Despre noi</a>
          <a href="#" className="hover:text-green-400 transition-colors">Termeni și condiții</a>
          <a href="#" className="hover:text-green-400 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
