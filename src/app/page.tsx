'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const countries = [
  { code: 'RO', name: 'România' },
  { code: 'GB', name: 'Anglia' },
  { code: 'IT', name: 'Italia' },
  { code: 'ES', name: 'Spania' },
  { code: 'DE', name: 'Germania' },
  { code: 'FR', name: 'Franța' },
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgia' },
  { code: 'NL', name: 'Olanda' },
  { code: 'GR', name: 'Grecia' },
  { code: 'PT', name: 'Portugalia' },
  { code: 'NO', name: 'Norvegia' },
  { code: 'SE', name: 'Suedia' },
  { code: 'DK', name: 'Danemarca' },
  { code: 'FI', name: 'Finlanda' },
  { code: 'IE', name: 'Irlanda' },
];

const features = [
  {
    image: '/img/curieriinostri.png',
    title: 'Curierii Noștri',
    description: 'Curierii noștri sunt atent selectați, verificați și dedicați oferirii unui serviciu de livrare sigur și rapid. Cu experiență în transport internațional, aceștia asigură colectarea și livrarea coletelor tale cu responsabilitate și punctualitate.',
  },
  {
    image: '/img/asigurare.png',
    title: 'Asigurare Colete',
    description: 'Asigurarea coletelor este esențială pentru liniștea ta. Toate expedierile beneficiază de protecție completă împotriva pierderilor sau deteriorărilor. Indiferent de valoare sau destinație, coletul tău este în siguranță.',
  },
  {
    image: '/img/door2door.png',
    title: 'Door to Door',
    description: 'Serviciul nostru Door to Door îți oferă confortul ridicării coletului direct de la adresa ta și livrarea la destinație. Fără deplasări, fără griji, doar simplitate și eficiență.',
  },
  {
    image: '/img/track.png',
    title: 'Tracking în Timp Real',
    description: 'Urmărește coletul tău în orice moment cu sistemul nostru de tracking avansat. Știi exact unde se află și când ajunge la destinație.',
  },
  {
    image: '/img/heretohelp.png',
    title: 'Suport 24/7',
    description: 'Echipa noastră de suport este disponibilă non-stop pentru a răspunde întrebărilor tale și a te ajuta cu orice problemă întâmpinată.',
  },
  {
    image: '/img/pets.png',
    title: 'Transport Animale',
    description: 'Oferim servicii specializate pentru transportul în siguranță al animalelor de companie, cu toată grija și atenția de care au nevoie.',
  },
];

export default function Home() {
  const [pickupCountry, setPickupCountry] = useState('');
  const [deliveryCountry, setDeliveryCountry] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to offers page with selected countries
    window.location.href = `/oferte?from=${pickupCountry}&to=${deliveryCountry}`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="card text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-green-400 mb-4">
              Bine ai venit la Curierul Perfect
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              Platforma care conectează românii cu curieri de încredere din Europa.<br />
              Trimite sau primește colete rapid și în siguranță.
            </p>
            
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
              <select
                value={pickupCountry}
                onChange={(e) => setPickupCountry(e.target.value)}
                className="form-select"
                required
              >
                <option value="">📍 Locație colectare</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
              
              <select
                value={deliveryCountry}
                onChange={(e) => setDeliveryCountry(e.target.value)}
                className="form-select"
                required
              >
                <option value="">🎯 Locație livrare</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
              
              <button type="submit" className="btn-primary w-full">
                Primește oferte
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-blue-900/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-green-400 mb-12">
            De ce să alegi Curierul Perfect?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold text-green-400 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {feature.description}
                </p>
                <button className="btn-primary mt-4 text-sm px-4 py-2">
                  Află mai mult
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ești curier? Alătură-te echipei noastre!
          </h2>
          <p className="text-gray-300 mb-8">
            Câștigă bani extra livrând colete pe rutele tale obișnuite.
          </p>
          <Link href="/register?role=curier" className="btn-secondary inline-block">
            Înregistrează-te ca Curier
          </Link>
        </div>
      </section>
    </div>
  );
}
