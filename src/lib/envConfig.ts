type EnvDefinition = {
  keys: readonly string[];
  label: string;
  optional?: boolean;
  exposeValue?: boolean;
};

const rawEnv = import.meta.env as Record<string, string | undefined>;

const envDefinitions = {
  supabaseUrl: {
    keys: ['VITE_SUPABASE_URL'] as const,
    label: 'Supabase URL',
    exposeValue: true,
  },
  supabaseAnonKey: {
    keys: ['VITE_SUPABASE_PUBLISHABLE_KEY'] as const,
    label: 'Supabase publishable key',
  },
  supabaseProjectId: {
    keys: ['VITE_SUPABASE_PROJECT_ID'] as const,
    label: 'Supabase project ID',
    optional: true,
    exposeValue: true,
  },
  supabaseServiceRoleKey: {
    keys: ['SUPABASE_SERVICE_ROLE_KEY', 'VITE_SUPABASE_SERVICE_ROLE_KEY'] as const,
    label: 'Supabase service role key',
    optional: true,
  },
  spotifyClientId: {
    keys: ['VITE_CLIENT_ID'] as const,
    label: 'Spotify client ID',
    optional: true,
    exposeValue: true,
  },
  spotifyClientSecret: {
    keys: ['CLIENT_SECRET', 'VITE_CLIENT_SECRET', 'VITE_CLIENT_SECRTET'] as const,
    label: 'Spotify client secret',
    optional: true,
  },
  spotifyRedirectUri: {
    keys: ['VITE_REDIRECT_URI'] as const,
    label: 'Spotify redirect URI',
    optional: true,
    exposeValue: true,
  },
  googleProjectNumber: {
    keys: ['VITE_PROJECT_NUMBER'] as const,
    label: 'Google project number',
    optional: true,
    exposeValue: true,
  },
  googleProjectId: {
    keys: ['VITE_PROJECT_ID'] as const,
    label: 'Google project ID',
    optional: true,
    exposeValue: true,
  },
  googleServiceAccount: {
    keys: ['GOOGLE_SERVICE_ACCOUNT', 'VITE_SERVICE_ACCOUNT'] as const,
    label: 'Google service account',
    optional: true,
    exposeValue: true,
  },
  googleApiKey: {
    keys: ['GOOGLE_API_KEY', 'VITE_API_KEY', 'VITE_NEXT_GEMINI_API_KEY'] as const,
    label: 'Google API key',
    optional: true,
  },
  googleOAuthClient: {
    keys: ['VITE_OAUTH_2_0_CLIENT_ID', 'VITE_OAUTH_2.0_CLIENT_ID'] as const,
    label: 'Google OAuth client ID',
    optional: true,
    exposeValue: true,
  },
  mapsApiKey: {
    keys: ['VITE_NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'] as const,
    label: 'Google Maps API key',
    optional: true,
  },
  geminiApiKey: {
    keys: ['VITE_NEXT_GEMINI_API_KEY'] as const,
    label: 'Gemini API key',
    optional: true,
  },
  databaseUrl: {
    keys: ['DATABASE_URL', 'VITE_DATABASE_URL'] as const,
    label: 'Primary database URL',
  },
  localDatabaseUrl: {
    keys: ['LOCAL_DATABASE_URL', 'VITE_LOCAL_DATABASE_URL'] as const,
    label: 'Local database URL',
    optional: true,
  },
  postgresHost: {
    keys: ['VITE_PG_HOST'] as const,
    label: 'Postgres host',
    optional: true,
    exposeValue: true,
  },
  postgresPort: {
    keys: ['VITE_PG_PORT'] as const,
    label: 'Postgres port',
    optional: true,
    exposeValue: true,
  },
  postgresDatabase: {
    keys: ['VITE_PG_DATABASE'] as const,
    label: 'Postgres database name',
    optional: true,
    exposeValue: true,
  },
  postgresUser: {
    keys: ['VITE_PG_USER'] as const,
    label: 'Postgres user',
    optional: true,
    exposeValue: true,
  },
  postgresPassword: {
    keys: ['VITE_PG_PASSWORD'] as const,
    label: 'Postgres password',
    optional: true,
  },
  gridAppUser: {
    keys: ['VITE_GRID_APP_USER'] as const,
    label: 'Grid application user',
    optional: true,
    exposeValue: true,
  },
  gridAppPassword: {
    keys: ['VITE_GRID_APP_PASS'] as const,
    label: 'Grid application password',
    optional: true,
  },
  gridKeysJson: {
    keys: ['VITE_GRID_KEYS_JSON'] as const,
    label: 'Grid RBAC keys JSON',
    optional: true,
  },
  gridHeaderKey: {
    keys: ['VITE_HEADER_KEY'] as const,
    label: 'Grid RBAC default header key',
    optional: true,
  },
  neonDataApiUrl: {
    keys: ['VITE_NEON_DATA_API_URL'] as const,
    label: 'Neon Data API URL',
    optional: true,
    exposeValue: true,
  },
  neonProjectId: {
    keys: ['VITE_NEON_PROJECT_ID'] as const,
    label: 'Neon project ID',
    optional: true,
    exposeValue: true,
  },
  neonStackId: {
    keys: ['VITE_NEON_STACK_ID'] as const,
    label: 'Neon stack ID',
    optional: true,
  },
  neonApiUrl: {
    keys: ['VITE_NEON_API_URL'] as const,
    label: 'Neon API URL',
    optional: true,
    exposeValue: true,
  },
  neonJwksUrl: {
    keys: ['VITE_NEON_JWKS_URL'] as const,
    label: 'Neon JWKS URL',
    optional: true,
    exposeValue: true,
  },
  trinityPort: {
    keys: ['VITE_TRINITY_PORT'] as const,
    label: 'Trinity service port',
    optional: true,
    exposeValue: true,
  },
  lookupPort: {
    keys: ['VITE_LOOKUP_PORT'] as const,
    label: 'Lookup service port',
    optional: true,
    exposeValue: true,
  },
  tileservPort: {
    keys: ['VITE_TILESERV_PORT'] as const,
    label: 'Tileserv port',
    optional: true,
    exposeValue: true,
  },
  nginxPort: {
    keys: ['VITE_NGINX_PORT'] as const,
    label: 'Nginx port',
    optional: true,
    exposeValue: true,
  },
  flaskRunPortTrinity: {
    keys: ['VITE_FLASK_RUN_PORT_TRINITY'] as const,
    label: 'Flask Trinity port',
    optional: true,
    exposeValue: true,
  },
  flaskRunPortLookup: {
    keys: ['VITE_FLASK_RUN_PORT_LOOKUP'] as const,
    label: 'Flask Lookup port',
    optional: true,
    exposeValue: true,
  },
  rulepackPath: {
    keys: ['VITE_RULEPACK_PATH'] as const,
    label: 'Rulepack path',
    optional: true,
    exposeValue: true,
  },
  soulprintPath: {
    keys: ['VITE_SOULPRINT_PATH'] as const,
    label: 'Soulprint path',
    optional: true,
    exposeValue: true,
  },
  wooIdPath: {
    keys: ['VITE_WOO_ID_PATH'] as const,
    label: 'Woo identity path',
    optional: true,
    exposeValue: true,
  },
  secretKey: {
    keys: ['SECRET_KEY', 'VITE_SECRET_KEY'] as const,
    label: 'Application secret key',
    optional: true,
  },
  appEnv: {
    keys: ['VITE_APP_ENV', 'NODE_ENV'] as const,
    label: 'Application environment',
    optional: true,
    exposeValue: true,
  },
} as const satisfies Record<string, EnvDefinition>;

type EnvDefinitions = typeof envDefinitions;
type EnvName = keyof EnvDefinitions;

export type EnvDiagnosticsEntry = {
  name: EnvName;
  label: string;
  optional: boolean;
  resolvedKey?: string;
  value?: string;
  exposeValue: boolean;
  preview: string;
};

const envStore = {} as {
  [Key in EnvName]: string | undefined;
};

const diagnosticsStore = {} as {
  [Key in EnvName]: EnvDiagnosticsEntry;
};

const buildPreview = (value: string | undefined, exposeValue: boolean): string => {
  if (!value) {
    return '⛔ missing';
  }

  if (exposeValue) {
    return value;
  }

  if (value.length <= 4) {
    return '****';
  }

  return `${'*'.repeat(Math.max(0, value.length - 4))}${value.slice(-4)}`;
};

const resolveEnvValue = (definition: EnvDefinition) => {
  for (const key of definition.keys) {
    const candidate = rawEnv[key];
    if (candidate && candidate.length > 0) {
      return { value: candidate, resolvedKey: key };
    }
  }

  return { value: undefined, resolvedKey: undefined };
};

(Object.entries(envDefinitions) as [EnvName, EnvDefinition][]).forEach(([name, definition]) => {
  const { value, resolvedKey } = resolveEnvValue(definition);

  if (!value && !definition.optional) {
    console.warn(
      `[envConfig] Missing required environment variable: ${definition.label} (${definition.keys.join(', ')})`,
    );
  }

  envStore[name] = value;
  diagnosticsStore[name] = {
    name,
    label: definition.label,
    optional: Boolean(definition.optional),
    resolvedKey,
    value,
    exposeValue: Boolean(definition.exposeValue),
    preview: buildPreview(value, Boolean(definition.exposeValue)),
  };
});

export const env = Object.freeze(envStore);

export const getEnvDiagnostics = () => Object.values(diagnosticsStore);

export const requireEnv = (value: string | undefined, label: string): string => {
  if (!value) {
    throw new Error(`[envConfig] ${label} is not configured. Check your environment variables.`);
  }
  return value;
};
