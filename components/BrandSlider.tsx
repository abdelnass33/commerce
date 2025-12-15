'use client';

import Image from 'next/image';

export default function BrandSlider() {
  const brands = [
    { 
      name: 'Nike', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg'
    },
    { 
      name: 'Adidas', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg'
    },
    { 
      name: 'Jordan', 
      logo: 'https://upload.wikimedia.org/wikipedia/en/3/37/Jumpman_logo.svg'
    },
    { 
      name: 'Puma', 
      logo: 'https://upload.wikimedia.org/wikipedia/en/d/da/Puma_complete_logo.svg'
    },
    { 
      name: 'New Balance', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/New_Balance_logo.svg'
    },
    { 
      name: 'Reebok', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Reebok_logo.svg'
    },
    { 
      name: 'Vans', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Vans-logo.svg'
    },
    { 
      name: 'Converse', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Converse_logo.svg'
    },
    { 
      name: 'Asics', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/Asics_Logo.svg'
    },
    { 
      name: 'Under Armour', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Under_armour_logo.svg'
    },
    { 
      name: 'Fila', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Fila_logo.svg'
    },
    { 
      name: 'Salomon', 
      logo: 'https://upload.wikimedia.org/wikipedia/fr/7/75/Logo_Salomon.svg'
    },
  ];

  // Double the brands array for seamless infinite scroll
  const duplicatedBrands = [...brands, ...brands];

  return (
    <section className="relative overflow-hidden py-12 bg-gradient-to-b from-dark-bg via-dark-card/30 to-dark-bg border-y border-dark-border/50">
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-dark-bg to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-dark-bg to-transparent z-10"></div>
      
      <div className="flex items-center justify-center mb-8">
        <p className="text-sm text-dark-text-tertiary uppercase tracking-wider font-medium">
          Nos marques partenaires
        </p>
      </div>

      {/* Infinite scroll container */}
      <div className="relative">
        <div className="flex animate-scroll">
          {duplicatedBrands.map((brand, index) => (
            <div
              key={`${brand.name}-${index}`}
              className="flex-shrink-0 mx-6 group cursor-pointer"
            >
              <div className="flex flex-col items-center gap-3 transition-all duration-300 group-hover:scale-110">
                <div className="relative w-28 h-28 flex items-center justify-center bg-white/5 backdrop-blur-sm border border-dark-border rounded-2xl group-hover:border-white/30 group-hover:bg-white/10 transition-all duration-300 shadow-lg group-hover:shadow-white/10 p-6">
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    fill
                    className="object-contain filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-all duration-300 p-4"
                  />
                </div>
                <span className="text-xs font-medium text-dark-text-tertiary group-hover:text-white transition-colors duration-300">
                  {brand.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 15s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
