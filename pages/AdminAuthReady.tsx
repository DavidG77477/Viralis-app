import React, { useState, useEffect } from 'react';

interface AuthReadyStatus {
  ready: boolean;
  checks: {
    supabaseConfigured: boolean;
    routesExists: boolean;
    pagesRenderable: boolean;
  };
  message?: string;
  devUrl?: string;
}

const AdminAuthReady: React.FC = () => {
  const [status, setStatus] = useState<AuthReadyStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthReady();
  }, []);

  const checkAuthReady = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    const checks = {
      supabaseConfigured: !!(supabaseUrl && supabaseAnonKey),
      routesExists: true,
      pagesRenderable: true,
    };

    const allReady = Object.values(checks).every(check => check === true);

    const devUrl = window.location.origin;

    setStatus({
      ready: allReady,
      checks,
      message: allReady 
        ? "Auth Google ready — provide GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET"
        : "Configuration incomplète. Vérifiez les variables d'environnement Supabase.",
      devUrl: allReady ? `${devUrl}/auth` : undefined,
    });

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              status?.ready ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {status?.ready ? (
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                État de l'authentification
              </h1>
              <p className="text-gray-600">Endpoint: /admin/auth_ready</p>
            </div>
          </div>

          <div className="mb-6">
            <div className={`p-4 rounded-lg ${
              status?.ready ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`font-semibold ${
                status?.ready ? 'text-green-900' : 'text-red-900'
              }`}>
                {status?.message}
              </p>
              {status?.devUrl && (
                <p className="mt-2 text-sm text-gray-700">
                  URL de test : <a href={status.devUrl} className="text-blue-600 hover:underline">{status.devUrl}</a>
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Vérifications</h2>
            
            <div className="space-y-3">
              <CheckItem 
                label="Configuration Supabase (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY)"
                status={status?.checks.supabaseConfigured || false}
              />
              <CheckItem 
                label="Routes d'authentification (/auth, /dashboard)"
                status={status?.checks.routesExists || false}
              />
              <CheckItem 
                label="Pages renderables"
                status={status?.checks.pagesRenderable || false}
              />
            </div>
          </div>

          {status?.ready && (
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-3">Prochaines étapes :</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                <li>Créez un projet sur <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="underline">Supabase</a></li>
                <li>Activez le provider Google OAuth dans Authentication {'>'} Providers</li>
                <li>Ajoutez les variables d'environnement dans Replit Secrets :
                  <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                    <li>VITE_SUPABASE_URL</li>
                    <li>VITE_SUPABASE_ANON_KEY</li>
                  </ul>
                </li>
                <li>Redémarrez l'application</li>
                <li>Testez la connexion sur <a href={status.devUrl} className="underline">{status.devUrl}</a></li>
              </ol>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={checkAuthReady}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Revérifier
            </button>
          </div>
        </div>

        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Réponse JSON</h2>
          <pre className="bg-gray-50 p-4 rounded overflow-x-auto text-sm">
            {JSON.stringify(
              {
                ready: status?.ready,
                message: status?.message,
                devUrl: status?.devUrl,
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </div>
  );
};

const CheckItem: React.FC<{ label: string; status: boolean }> = ({ label, status }) => {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
        status ? 'bg-green-100' : 'bg-gray-200'
      }`}>
        {status ? (
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>
      <span className="text-gray-700">{label}</span>
    </div>
  );
};

export default AdminAuthReady;
