import React, { useState } from 'react';
import Header from './components/Header';
import Tabs from './components/Tabs';
import ResearchTab from './components/tabs/ResearchTab';
import StructureTab from './components/tabs/StructureTab';
import ContentTab from './components/tabs/ContentTab';
import LayoutTab from './components/tabs/LayoutTab';
import CoverTab from './components/tabs/CoverTab';
import MetadataTab from './components/tabs/MetadataTab';
import ValidationTab from './components/tabs/ValidationTab';
import { TAB_RESEARCH } from './constants';
import type { TabKey } from './types';
import { LocalizationProvider } from './hooks/useLocalization';
import { ProjectProvider, useProject } from './hooks/useProject';
import WelcomeScreen from './components/WelcomeScreen';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>(TAB_RESEARCH);
  const { isProjectStarted } = useProject();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'Ricerca':
        return <ResearchTab />;
      case 'Struttura':
        return <StructureTab />;
      case 'Contenuti':
        return <ContentTab />;
      case 'Layout':
        return <LayoutTab />;
      case 'Copertina':
        return <CoverTab />;
      case 'Metadati':
        return <MetadataTab />;
      case 'Validazione':
        return <ValidationTab />;
      default:
        return <ResearchTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-neutral-dark">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        {isProjectStarted ? (
          <>
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="mt-6">
              {renderActiveTab()}
            </div>
          </>
        ) : (
          <WelcomeScreen />
        )}
      </main>
    </div>
  );
}


const App: React.FC = () => {
  return (
    <LocalizationProvider>
      <ProjectProvider>
        <AppContent />
      </ProjectProvider>
    </LocalizationProvider>
  );
};

export default App;
