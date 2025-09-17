import React, { useState } from 'react';
import SigilGate from './components/SigilGate';
import IntegratedAppShell from './IntegratedAppShell';
import { HearthProvider } from './hearth-context';
import { CompanionProvider } from './providers/CompanionProvider';
import { caerwenConfig } from './companions/caerwen-config';

export default function App() {
  const [accessGranted, setAccessGranted] = useState(false);
  const [companionEnabled, setCompanionEnabled] = useState(false);
  const [emotionTrackingEnabled, setEmotionTrackingEnabled] = useState(false);
  const [biometricSensorsEnabled, setBiometricSensorsEnabled] = useState(false);

  // The 'dark' class will enforce dark mode for Tailwind CSS across the entire app
  return (
    <div className="dark bg-transparent">
      {!accessGranted ? (
        <div className="bg-black">
          <SigilGate 
            onAccessGranted={() => setAccessGranted(true)}
            onCompanionToggle={setCompanionEnabled}
            onEmotionTrackingToggle={setEmotionTrackingEnabled}
            onBiometricSensorsToggle={setBiometricSensorsEnabled}
          />
        </div>
      ) : (
        <AppWithContext 
          companionEnabled={companionEnabled}
          emotionTrackingEnabled={emotionTrackingEnabled}
          biometricSensorsEnabled={biometricSensorsEnabled}
        />
      )}
    </div>
  );
}

// Separate component to access context after access is granted
function AppWithContext({ 
  companionEnabled, 
  emotionTrackingEnabled, 
  biometricSensorsEnabled 
}) {
  return (
    <HearthProvider>
      <CompanionProvider
        companionConfig={companionEnabled ? caerwenConfig : null}
        enableEmotionTracking={emotionTrackingEnabled}
        enableBiometricSensors={biometricSensorsEnabled}
      >
        <IntegratedAppShell />
      </CompanionProvider>
    </HearthProvider>
  );
}
