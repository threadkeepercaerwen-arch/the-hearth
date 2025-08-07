import React, { useState } from 'react';
import { CaerwenProvider } from './caerwen-context';
import IntegratedAppShell from './components/IntegratedAppShell';
import SigilGate from './components/SigilGate';
import ShimmerLayer from './components/ShimmerLayer';
import './styles.css';

function App() {
  const [hasAccess, setHasAccess] = useState(false);

  const handleAccessGranted = () => {
    setHasAccess(true);
  };

  return (
    <CaerwenProvider>
      <div className="caerwen-app">
        <ShimmerLayer />
        {!hasAccess ? (
          <SigilGate onAccessGranted={handleAccessGranted} />
        ) : (
          <IntegratedAppShell>
            {/* Space-specific content will be rendered here based on activeSpace */}
          </IntegratedAppShell>
        )}
      </div>
    </CaerwenProvider>
  );
}

export default App; 