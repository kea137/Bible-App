/**
 * Babel plugin to remove web-only ARIA props on React Native
 */
module.exports = function ({ types: t }) {
  return {
    name: 'remove-web-aria-props',
    visitor: {
      JSXAttribute(path, state) {
        const { name } = path.node.name;
        const webOnlyProps = [
          'aria-hidden',
          'aria-label',
          'aria-labelledby',
          'aria-level',
          'role'
        ];
        
        if (webOnlyProps.includes(name)) {
          // Only remove on native platforms
          if (process.env.EXPO_PUBLIC_PLATFORM !== 'web') {
            path.remove();
          }
        }
      }
    }
  };
};
