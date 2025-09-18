import React from 'react';
import { TABS } from '../constants';
import type { TabKey } from '../types';
import { useLocalization } from '../hooks/useLocalization';

interface TabsProps {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
}

const tabLocalizationKeys: Record<TabKey, 'research' | 'structure' | 'content' | 'layout' | 'cover' | 'metadata' | 'validation'> = {
  'Ricerca': 'research',
  'Struttura': 'structure',
  'Contenuti': 'content',
  'Layout': 'layout',
  'Copertina': 'cover',
  'Metadati': 'metadata',
  'Validazione': 'validation',
};

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLocalization();

  return (
    <div className="border-b border-gray-300">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`${
              activeTab === tab
                ? 'border-brand-primary text-brand-primary font-semibold'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 text-md transition-colors duration-200`}
          >
            {t(tabLocalizationKeys[tab])}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;
