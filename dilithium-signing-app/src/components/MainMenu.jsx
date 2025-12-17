import React from "react";
import { Key, FileSignature, ShieldCheck, ArrowLeft } from "lucide-react";
import { MODES } from "../utils/constants";

const COLOR_STYLES = {
  indigo: {
    iconBg: "bg-indigo-50",
    iconText: "text-indigo-600",
    hoverBorder: "hover:border-indigo-500",
  },
  green: {
    iconBg: "bg-green-50",
    iconText: "text-green-600",
    hoverBorder: "hover:border-green-500",
  },
  purple: {
    iconBg: "bg-purple-50",
    iconText: "text-purple-600",
    hoverBorder: "hover:border-purple-500",
  },
};

const MainMenu = ({ currentMode, setCurrentMode }) => {
  // Back button (kada nisi u meniju)
  if (currentMode !== MODES.MENU) {
    return (
      <button
        type="button"
        onClick={() => setCurrentMode(MODES.MENU)}
        className="mb-6 flex items-center gap-2 text-indigo-600 transition-colors hover:text-indigo-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Nazad na glavni meni
      </button>
    );
  }

  const menuOptions = [
    {
      id: MODES.GENERATE,
      icon: Key,
      title: "Generiši ključeve",
      description: "Kreiraj novi par Dilithium ključeva (privatni i javni)",
      color: "indigo",
    },
    {
      id: MODES.SIGN,
      icon: FileSignature,
      title: "Potpiši sadržaj",
      description: "Digitalno potpiši dokument ili poruku pomoću privatnog ključa",
      color: "green",
    },
    {
      id: MODES.VERIFY,
      icon: ShieldCheck,
      title: "Verifikuj potpis",
      description: "Provjeri autentičnost digitalnog potpisa",
      color: "purple",
    },
  ];

  return (
    <section className="space-y-4">
      <header className="mb-2">
        <h2 className="text-2xl font-bold">Šta želite uraditi?</h2>
        <p className="mt-1 text-gray-600">Odaberite jednu od opcija ispod</p>
      </header>

      <div className="space-y-4">
        {menuOptions.map((option) => {
          const Icon = option.icon;
          const styles = COLOR_STYLES[option.color] || COLOR_STYLES.indigo;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setCurrentMode(option.id)}
              className={`group w-full rounded-lg border-2 border-gray-200 bg-white p-6 text-left transition-all hover:shadow-lg ${styles.hoverBorder}`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${styles.iconBg}`}
                >
                  <Icon className={`h-6 w-6 ${styles.iconText}`} />
                </div>

                <div>
                  <h3 className="text-lg font-semibold">{option.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default MainMenu;
