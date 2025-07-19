import fs from 'fs';

// Read the OpenAPI spec
const spec = JSON.parse(fs.readFileSync('directus-openapi-fresh.json', 'utf8'));

// Fix the broken Folders reference in the Files schema
if (spec.components && spec.components.schemas && spec.components.schemas.Files) {
  const folderProperty = spec.components.schemas.Files.properties.folder;
  if (folderProperty && folderProperty.oneOf) {
    // Replace the broken oneOf with just a nullable string
    spec.components.schemas.Files.properties.folder = {
      "description": "Virtual folder where this file resides in.",
      "type": "string",
      "nullable": true
    };
  }
}

// Write the fixed spec
fs.writeFileSync('directus-openapi-fixed.json', JSON.stringify(spec, null, 2));
console.log('✅ Fixed OpenAPI spec saved to directus-openapi-fixed.json'); 