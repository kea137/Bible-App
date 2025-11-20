const { withAndroidManifest } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Expo config plugin to add network security configuration to Android
 * This restricts cleartext (HTTP) traffic to only localhost for security
 */
const withNetworkSecurityConfig = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const mainApplication = androidManifest.manifest.application?.[0];

    if (mainApplication) {
      // Add network security config reference
      mainApplication.$['android:networkSecurityConfig'] = '@xml/network_security_config';

      // Create the network security config file
      const androidDir = path.join(config.modRequest.projectRoot, 'android', 'app', 'src', 'main', 'res', 'xml');
      const networkSecurityConfigPath = path.join(androidDir, 'network_security_config.xml');

      const networkSecurityConfigContent = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <!-- Base configuration for all domains -->
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
    
    <!-- Allow cleartext only for localhost (development) -->
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">127.0.0.1</domain>
        <domain includeSubdomains="true">10.0.2.2</domain>
    </domain-config>
</network-security-config>`;

      // Ensure the xml directory exists
      if (!fs.existsSync(androidDir)) {
        fs.mkdirSync(androidDir, { recursive: true });
      }

      // Write the network security config file
      fs.writeFileSync(networkSecurityConfigPath, networkSecurityConfigContent);
    }

    return config;
  });
};

module.exports = withNetworkSecurityConfig;
