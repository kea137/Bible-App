// NativeWind configuration to disable ARIA attributes on native
const { withNativeWind: originalWithNativeWind } = require('nativewind/metro');

function withNativeWind(config, options) {
  return originalWithNativeWind(config, {
    ...options,
    // Try to disable ARIA attribute generation
    experimental: {
      ...options?.experimental,
      disableAria: true,
    },
  });
}

module.exports = { withNativeWind };
