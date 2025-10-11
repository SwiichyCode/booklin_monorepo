'use client';

import { Button } from '@/components/ui/button';
import { useProProfile } from '@/lib/hooks/useProProfile';

export function TestProfileFetch() {
  const { data, isLoading, isError, error, refetch, isFetching } = useProProfile();

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Test API - Get My Profile</h2>
        <p className="text-sm text-gray-600 mt-1">Cliquez sur le bouton pour déclencher l'appel API</p>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Bouton de test */}
        <div className="flex gap-2">
          <Button onClick={() => refetch()} disabled={isFetching} className="flex items-center gap-2">
            {isFetching ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Chargement...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Récupérer le profil
              </>
            )}
          </Button>
        </div>

        {/* États de chargement */}
        {isLoading && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <svg className="animate-spin h-5 w-5 text-blue-600 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <div>
              <p className="text-sm text-blue-800">Première récupération du profil...</p>
            </div>
          </div>
        )}

        {/* Gestion des erreurs */}
        {isError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-sm text-red-800">
              <strong>Erreur :</strong> {(error as Error)?.message || 'Une erreur est survenue'}
            </div>
          </div>
        )}

        {/* Affichage des données */}
        {data && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">✅ Profil récupéré avec succès !</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-lg mb-3">Données reçues :</h3>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="font-medium text-gray-700">ID :</div>
                <div className="text-gray-900">{data.id}</div>

                <div className="font-medium text-gray-700">User ID :</div>
                <div className="text-gray-900">{data.userId}</div>

                <div className="font-medium text-gray-700">Nom entreprise :</div>
                <div className="text-gray-900">{data.businessName || 'Non renseigné'}</div>

                <div className="font-medium text-gray-700">Profession :</div>
                <div className="text-gray-900">{data.profession || 'Non renseigné'}</div>

                <div className="font-medium text-gray-700">Étape onboarding :</div>
                <div className="text-gray-900">{data.onboardingStep || 'ENTERPRISE_INFO'}</div>

                <div className="font-medium text-gray-700">Progression :</div>
                <div className="text-gray-900">{data.onboardingProgress || 0}%</div>

                <div className="font-medium text-gray-700">Onboarding complet :</div>
                <div className="text-gray-900">{data.onboardingComplete ? '✅ Oui' : '❌ Non'}</div>
              </div>

              {/* JSON complet (collapsible) */}
              <details className="mt-4">
                <summary className="cursor-pointer font-medium text-sm hover:text-blue-600">Voir JSON complet</summary>
                <pre className="mt-2 p-3 bg-gray-900 text-green-400 text-xs rounded overflow-auto max-h-96">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}

        {/* Indicateur de cache */}
        {data && !isFetching && (
          <p className="text-xs text-gray-500">💾 Données en cache - React Query gère automatiquement le refetch</p>
        )}
      </div>
    </div>
  );
}
