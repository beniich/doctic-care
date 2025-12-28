import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    redirectTo?: string;
}

/**
 * Protected Route Component
 * 
 * Protects routes that require authentication.
 * If user is not authenticated, redirects to login with return URL.
 * 
 * Usage:
 * <Route path="/subscription" element={
 *   <ProtectedRoute>
 *     <SubscriptionManagement />
 *   </ProtectedRoute>
 * } />
 */
export function ProtectedRoute({
    children,
    requireAuth = true,
    redirectTo = "/login"
}: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (requireAuth && !user) {
        return <Navigate to={`${redirectTo}?redirect=${location.pathname}`} state={{ from: location }} replace />;
    }

    // Render protected content
    return <>{children}</>;
}

/**
 * Public Only Route Component
 * 
 * For routes that should only be accessible to non-authenticated users (e.g., login, signup).
 * If user is authenticated, redirects to dashboard or specified route.
 * 
 * Usage:
 * <Route path="/login" element={
 *   <PublicOnlyRoute>
 *     <LoginPage />
 *   </PublicOnlyRoute>
 * } />
 */
export function PublicOnlyRoute({
    children,
    redirectTo = "/"
}: { children: React.ReactNode; redirectTo?: string }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Redirect to dashboard if already authenticated
    if (user) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
}

/**
 * Role-Based Protected Route
 * 
 * Protects routes based on user role.
 * 
 * Usage:
 * <Route path="/admin" element={
 *   <RoleProtectedRoute allowedRoles={['admin']}>
 *     <AdminDashboard />
 *   </RoleProtectedRoute>
 * } />
 */
export function RoleProtectedRoute({
    children,
    allowedRoles = [],
    redirectTo = "/"
}: {
    children: React.ReactNode;
    allowedRoles: string[];
    redirectTo?: string;
}) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has required role
    if (!allowedRoles.includes(user.role || 'user')) {
        return <Navigate to={redirectTo} replace />;
    }

    return <>{children}</>;
}
