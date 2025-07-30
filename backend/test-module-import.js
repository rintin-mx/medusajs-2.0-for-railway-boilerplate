// Test file to verify module imports work correctly
try {
  const multiProviderModule = require('./src/modules/multi-provider-fulfillment/index.ts');
  console.log('✅ Module imported successfully');
  console.log('Available exports:', Object.keys(multiProviderModule));

  // Test if Provider class is accessible
  if (multiProviderModule.Provider) {
    console.log('✅ Provider class is accessible');
  }

  // Test if services are accessible
  if (multiProviderModule.ProviderService) {
    console.log('✅ ProviderService is accessible');
  }

  if (multiProviderModule.ProviderFulfillmentService) {
    console.log('✅ ProviderFulfillmentService is accessible');
  }

} catch (error) {
  console.error('❌ Module import failed:', error.message);
  process.exit(1);
}

