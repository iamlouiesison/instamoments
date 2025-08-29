#!/usr/bin/env tsx

/**
 * Script to generate TypeScript types from Supabase database schema
 * Run with: npm run generate-types
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to map PostgreSQL types to TypeScript types
function mapPostgresTypeToTypeScript(postgresType: string, isNullable: boolean): string {
  let tsType = '';
  
  switch (postgresType.toLowerCase()) {
    case 'uuid':
      tsType = 'string';
      break;
    case 'text':
    case 'character varying':
    case 'varchar':
      tsType = 'string';
      break;
    case 'integer':
    case 'int':
    case 'bigint':
    case 'smallint':
      tsType = 'number';
      break;
    case 'decimal':
    case 'numeric':
    case 'real':
    case 'double precision':
      tsType = 'number';
      break;
    case 'boolean':
      tsType = 'boolean';
      break;
    case 'timestamp':
    case 'timestamp with time zone':
    case 'timestamptz':
      tsType = 'string';
      break;
    case 'date':
      tsType = 'string';
      break;
    case 'time':
    case 'time with time zone':
      tsType = 'string';
      break;
    case 'interval':
      tsType = 'string';
      break;
    case 'json':
    case 'jsonb':
      tsType = 'any';
      break;
    case 'bytea':
      tsType = 'string';
      break;
    case 'array':
      tsType = 'any[]';
      break;
    default:
      tsType = 'any';
      break;
  }
  
  return isNullable ? `${tsType} | null` : tsType;
}

async function generateTypes() {
  try {
    console.log('🔍 Fetching database schema...');
    
    // Get all tables from the public schema
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_type', 'BASE TABLE');

    if (tablesError) {
      throw new Error(`Failed to fetch tables: ${tablesError.message}`);
    }

    console.log(`📋 Found ${tables.length} tables`);

    // Get columns for each table
    const tableSchemas: Record<string, Array<{
      column_name: string;
      data_type: string;
      is_nullable: string;
      column_comment?: string;
      column_default?: string;
    }>> = {};
    
    for (const table of tables) {
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('*')
        .eq('table_schema', 'public')
        .eq('table_name', table.table_name)
        .order('ordinal_position');

      if (columnsError) {
        console.warn(`⚠️  Failed to fetch columns for ${table.table_name}: ${columnsError.message}`);
        continue;
      }

      tableSchemas[table.table_name] = columns;
    }

    // Generate TypeScript types
    let typesContent = `// Auto-generated TypeScript types from Supabase database schema
// Generated on: ${new Date().toISOString()}
// Do not edit manually - regenerate with: npm run generate-types

export interface Database {
  public: {
    Tables: {
`;

    // Generate table interfaces
    for (const [tableName, columns] of Object.entries(tableSchemas)) {
      typesContent += `      ${tableName}: {
        Row: {
`;
      
      for (const column of columns) {
        const columnName = column.column_name;
        const dataType = mapPostgresTypeToTypeScript(column.data_type, column.is_nullable === 'YES');
        const comment = column.column_comment ? ` // ${column.column_comment}` : '';
        
        typesContent += `          ${columnName}: ${dataType};${comment}\n`;
      }
      
      typesContent += `        };
        Insert: {
`;
      
      // For Insert, make required fields non-optional
      for (const column of columns) {
        const columnName = column.column_name;
        const dataType = mapPostgresTypeToTypeScript(column.data_type, column.is_nullable === 'YES');
        const isRequired = column.is_nullable === 'NO' && !column.column_default;
        const comment = column.column_comment ? ` // ${column.column_comment}` : '';
        
        if (isRequired) {
          typesContent += `          ${columnName}: ${dataType};${comment}\n`;
        } else {
          typesContent += `          ${columnName}?: ${dataType};${comment}\n`;
        }
      }
      
      typesContent += `        };
        Update: {
`;
      
      // For Update, make all fields optional
      for (const column of columns) {
        const columnName = column.column_name;
        const dataType = mapPostgresTypeToTypeScript(column.data_type, column.is_nullable === 'YES');
        const comment = column.column_comment ? ` // ${column.column_comment}` : '';
        
        typesContent += `          ${columnName}?: ${dataType};${comment}\n`;
      }
      
      typesContent += `        };
      };
`;
    }

    typesContent += `    };
    Views: {
      // Add views here if needed
    };
    Functions: {
      // Add functions here if needed
    };
    Enums: {
      // Add enums here if needed
    };
  };
}

// Export individual table types for convenience
`;

    // Generate individual table type exports
    for (const tableName of Object.keys(tableSchemas)) {
      const pascalCase = tableName.charAt(0).toUpperCase() + tableName.slice(1);
      typesContent += `export type ${pascalCase} = Database['public']['Tables']['${tableName}']['Row'];
export type ${pascalCase}Insert = Database['public']['Tables']['${tableName}']['Insert'];
export type ${pascalCase}Update = Database['public']['Tables']['${tableName}']['Update'];

`;
    }

    // Ensure the types directory exists
    const typesDir = join(process.cwd(), 'src', 'types');
    mkdirSync(typesDir, { recursive: true });

    // Write the types file
    const typesPath = join(typesDir, 'database.types.ts');
    writeFileSync(typesPath, typesContent);

    console.log(`✅ Types generated successfully at: ${typesPath}`);
    console.log(`📊 Generated types for ${Object.keys(tableSchemas).length} tables`);
    
    // Also update the main types index file
    const indexPath = join(typesDir, 'index.ts');
    const indexContent = `// Export all database types
export * from './database.types';

// Re-export commonly used types
export type { Database } from './database.types';
`;

    writeFileSync(indexPath, indexContent);
    console.log(`✅ Updated types index at: ${indexPath}`);

  } catch (error) {
    console.error('❌ Error generating types:', error);
    process.exit(1);
  }
}

// Run the script
generateTypes();
