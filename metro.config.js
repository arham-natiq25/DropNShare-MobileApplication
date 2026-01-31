const path = require('path');
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);
const finalConfig = withNativeWind(config, { input: './app/global.css' });

// Fix: resolve react-native-css-interop's internal "../../shared" require (Metro can fail on some setups)
const cssInteropRoot = path.dirname(require.resolve('react-native-css-interop/package.json'));
const defaultResolve = finalConfig.resolver.resolveRequest;
finalConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '../../shared' && context.originModulePath?.includes('react-native-css-interop')) {
    return {
      filePath: path.join(cssInteropRoot, 'dist', 'shared.js'),
      type: 'sourceFile',
    };
  }
  return defaultResolve ? defaultResolve(context, moduleName, platform) : context.resolveRequest(context, moduleName, platform);
};

module.exports = finalConfig;