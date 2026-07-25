import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, Mail, Lock, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation API call
    setTimeout(() => {
      setLoading(false);
      navigate("/onboarding");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-indigo-bloom-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-indigo-bloom-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-bloom-400 to-indigo-bloom-600 flex items-center justify-center shadow-glow-indigo">
            <Building className="text-white w-6 h-6" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Créez votre compte cabinet
        </h2>
        <p className="mt-2 text-center text-sm text-indigo-bloom-200">
          Ou <Link to="/login" className="font-medium text-indigo-bloom-400 hover:text-indigo-bloom-300">connectez-vous à un compte existant</Link>
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-indigo-bloom-900 py-8 px-4 shadow-glass-lg sm:rounded-2xl sm:px-10 border border-indigo-bloom-700/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name" className="text-indigo-bloom-100">Nom complet</Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-indigo-bloom-300" />
                </div>
                <Input id="name" required className="pl-10 bg-indigo-bloom-950/50 border-indigo-bloom-700 text-white placeholder-indigo-bloom-300/50" placeholder="Dr. Jean Dupont" />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-indigo-bloom-100">Email professionnel</Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-indigo-bloom-300" />
                </div>
                <Input id="email" type="email" required className="pl-10 bg-indigo-bloom-950/50 border-indigo-bloom-700 text-white placeholder-indigo-bloom-300/50" placeholder="jean.dupont@cabinet.fr" />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-indigo-bloom-100">Mot de passe</Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-indigo-bloom-300" />
                </div>
                <Input id="password" type="password" required className="pl-10 bg-indigo-bloom-950/50 border-indigo-bloom-700 text-white placeholder-indigo-bloom-300/50" placeholder="••••••••" />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-indigo-bloom-500 hover:bg-indigo-bloom-600 text-white font-bold h-11">
              {loading ? "Création en cours..." : (
                <>Continuer <ArrowRight className="ml-2 w-4 h-4" /></>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
