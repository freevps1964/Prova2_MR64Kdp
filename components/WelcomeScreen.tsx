import React from 'react';
import { BookOpenIcon, SparklesIcon, DocumentTextIcon } from './common/Icons';

const WelcomeScreen: React.FC = () => {
  return (
    <div className="text-center py-16 px-4 bg-white rounded-lg shadow-xl mt-8">
      <BookOpenIcon className="mx-auto h-20 w-20 text-brand-primary" />
      <h1 className="mt-4 text-4xl font-bold text-neutral-dark tracking-tight">Benvenuto in MR64Kdp Book</h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
        Il tuo assistente AI per creare e pubblicare libri di successo su Amazon KDP.
      </p>
      <p className="mt-2 max-w-2xl mx-auto text-md text-gray-500">
        Per iniziare, inserisci un titolo per il tuo nuovo progetto nell'intestazione in alto e clicca su "Nuovo Progetto".
      </p>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="flex flex-col items-center">
          <SparklesIcon className="h-12 w-12 text-brand-accent" />
          <h3 className="mt-2 text-lg font-semibold">Ricerca Potenziata</h3>
          <p className="mt-1 text-gray-500">Aggrega dati e fonti pertinenti per il tuo argomento.</p>
        </div>
        <div className="flex flex-col items-center">
          <DocumentTextIcon className="h-12 w-12 text-brand-accent" />
          <h3 className="mt-2 text-lg font-semibold">Creazione Guidata</h3>
          <p className="mt-1 text-gray-500">Genera struttura, contenuti e metadati in modo efficiente.</p>
        </div>
        <div className="flex flex-col items-center">
          <BookOpenIcon className="h-12 w-12 text-brand-accent" />
          <h3 className="mt-2 text-lg font-semibold">Pronto per KDP</h3>
          <p className="mt-1 text-gray-500">Esporta PDF e copertine conformi alle specifiche di Amazon.</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;