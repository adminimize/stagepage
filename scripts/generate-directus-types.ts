import { createDirectus, rest, readCollections, readFields } from '@directus/sdk';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Load environment variables
config();

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:4343';

interface DirectusCollection {
  collection: string;
  meta: {
    icon?: string;
    note?: string;
    display_template?: string;
    hidden?: boolean;
    singleton?: boolean;
    translations?: Record<string, string>;
    archive_field?: string;
    archive_app_filter?: boolean;
    archive_value?: string;
    unarchive_value?: string;
    sort_field?: string;
    accountability?: string;
    color?: string;
    item_duplication_fields?: string[];
    sort?: number;
    group?: string;
    collapse?: string;
  };
  schema: {
    name: string;
    comment?: string;
  };
}

interface DirectusField {
  collection: string;
  field: string;
  type: string;
  schema: {
    name: string;
    table: string;
    data_type: string;
    default_value?: any;
    max_length?: number;
    is_nullable: boolean;
    is_primary_key: boolean;
    has_auto_increment: boolean;
    foreign_key_table?: string;
    foreign_key_column?: string;
    comment?: string;
  };
  meta: {
    id?: number;
    collection?: string;
    field?: string;
    special?: string[];
    interface?: string;
    options?: Record<string, any>;
    display?: string;
    display_options?: Record<string, any>;
    readonly?: boolean;
    hidden?: boolean;
    sort?: number;
    width?: string;
    translations?: Record<string, string>;
    required?: boolean;
    group?: string;
    validation?: Record<string, any>;
    validation_message?: string;
  };
}

async function generateTypes() {
  try {
    console.log('Connecting to Directus...');
    const directus = createDirectus(DIRECTUS_URL).with(rest());

    console.log('Fetching collections...');
    const collections = await directus.request(readCollections()) as DirectusCollection[];
    
    console.log('Fetching fields...');
    const fields = await directus.request(readFields()) as DirectusField[];

    // Filter out system collections
    const userCollections = collections.filter(col => 
      !col.collection.startsWith('directus_') && 
      col.collection !== 'supabase_migrations'
    );

    let typesContent = `// Auto-generated from Directus schema
// Generated on: ${new Date().toISOString()}

export interface Schema {
`;

    // Generate collection interfaces
    for (const collection of userCollections) {
      const collectionFields = fields.filter(f => f.collection === collection.collection);
      
      typesContent += `  ${collection.collection}: {\n`;
      
      for (const field of collectionFields) {
        const fieldType = getFieldType(field);
        const isOptional = field.schema.is_nullable || field.meta.required === false;
        const optionalSuffix = isOptional ? '?' : '';
        
        typesContent += `    ${field.field}${optionalSuffix}: ${fieldType};\n`;
      }
      
      typesContent += `  };\n\n`;
    }

    typesContent += `}\n\n`;

    // Generate individual type interfaces
    for (const collection of userCollections) {
      const collectionFields = fields.filter(f => f.collection === collection.collection);
      const interfaceName = toPascalCase(collection.collection);
      
      typesContent += `export interface ${interfaceName} {\n`;
      
      for (const field of collectionFields) {
        const fieldType = getFieldType(field);
        const isOptional = field.schema.is_nullable || field.meta.required === false;
        const optionalSuffix = isOptional ? '?' : '';
        
        typesContent += `  ${field.field}${optionalSuffix}: ${fieldType};\n`;
      }
      
      typesContent += `}\n\n`;
    }

    // Ensure the directory exists
    mkdirSync(join(process.cwd(), 'src', 'lib', 'types'), { recursive: true });
    
    // Write the types file
    const outputPath = join(process.cwd(), 'src', 'lib', 'types', 'directus.ts');
    writeFileSync(outputPath, typesContent);
    
    console.log(`✅ Types generated successfully at: ${outputPath}`);
    console.log(`📊 Generated ${userCollections.length} collection interfaces`);
    
  } catch (error) {
    console.error('❌ Error generating types:', error);
    process.exit(1);
  }
}

function getFieldType(field: DirectusField): string {
  const { type, schema, meta } = field;
  
  // Handle special field types
  if (meta.special?.includes('o2m') || meta.special?.includes('m2m')) {
    return 'any[]'; // We'll handle relations separately
  }
  
  if (meta.special?.includes('m2o') || meta.special?.includes('o2o')) {
    return 'string | number'; // Foreign key
  }
  
  // Handle basic types
  switch (schema.data_type) {
    case 'uuid':
      return 'string';
    case 'varchar':
    case 'text':
    case 'char':
      return 'string';
    case 'int':
    case 'bigint':
    case 'smallint':
      return 'number';
    case 'decimal':
    case 'numeric':
    case 'real':
    case 'double precision':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'timestamp':
    case 'timestamptz':
    case 'date':
      return 'string'; // ISO date string
    case 'json':
    case 'jsonb':
      return 'any';
    case 'binary':
    case 'bytea':
      return 'string'; // Base64 encoded
    default:
      return 'any';
  }
}

function toPascalCase(str: string): string {
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

generateTypes(); 