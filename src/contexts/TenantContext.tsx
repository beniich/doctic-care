import React, { createContext, useContext, useState, useEffect } from 'react';

// Type correspondant au modèle Prisma (Tenant)
export interface Tenant {
    id: string;
    name: string;
    slug: string;
    logo?: string;
    plan: string;
    subscriptionStatus: string;
}

interface TenantContextType {
    currentTenant: Tenant | null;
    isLoading: boolean;
    error: string | null;
    setTenant: (tenant: Tenant) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const resolveTenant = async () => {
            try {
                const hostname = window.location.hostname;
                const parts = hostname.split('.');
                
                // Résolution par sous-domaine
                // Exemple: "cabinet-dupont.doctic.com" -> slug = "cabinet-dupont"
                // En local: "localhost" -> pas de sous-domaine
                if (parts.length >= 3 && parts[0] !== 'www') {
                    const slug = parts[0];
                    // Call fictif pour l'instant - a remplacer par un appel API /api/tenants/resolve/:slug
                    setCurrentTenant({
                        id: 'dev-tenant',
                        name: slug.toUpperCase(),
                        slug: slug,
                        plan: 'STARTER',
                        subscriptionStatus: 'active'
                    });
                }
            } catch (err) {
                setError('Impossible de résoudre le tenant');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        resolveTenant();
    }, []);

    return (
        <TenantContext.Provider value={{ currentTenant, isLoading, error, setTenant: setCurrentTenant }}>
            {children}
        </TenantContext.Provider>
    );
};

export const useTenant = () => {
    const context = useContext(TenantContext);
    if (context === undefined) {
        throw new Error('useTenant doit être utilisé à l\'intérieur d\'un TenantProvider');
    }
    return context;
};
