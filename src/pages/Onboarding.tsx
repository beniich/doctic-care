import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stethoscope, CheckCircle, Upload } from "lucide-react";
import { motion } from "framer-motion";

export default function Onboarding() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulation API call
    setTimeout(() => {
      setLoading(false);
      navigate("/pricing");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-indigo-bloom-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-indigo-bloom-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-indigo-bloom-800 flex items-center justify-center">
            <span className="text-indigo-bloom-300 font-bold">2/3</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Configuration de votre cabinet
        </h2>
        <p className="mt-2 text-center text-sm text-indigo-bloom-200">
          Personnalisez votre espace de travail.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-indigo-bloom-900 py-8 px-4 shadow-glass-lg sm:rounded-2xl sm:px-10 border border-indigo-bloom-700/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="clinicName" className="text-indigo-bloom-100">Nom du cabinet ou clinique</Label>
              <div className="mt-1 relative">
                <Input id="clinicName" required className="bg-indigo-bloom-950/50 border-indigo-bloom-700 text-white placeholder-indigo-bloom-300/50" placeholder="Cabinet Médical des Lilas" />
              </div>
            </div>

            <div>
              <Label htmlFor="specialty" className="text-indigo-bloom-100">Spécialité principale</Label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Stethoscope className="h-5 w-5 text-indigo-bloom-300" />
                </div>
                <Input id="specialty" required className="pl-10 bg-indigo-bloom-950/50 border-indigo-bloom-700 text-white placeholder-indigo-bloom-300/50" placeholder="Médecine Générale" />
              </div>
            </div>

            <div>
              <Label className="text-indigo-bloom-100">Logo du cabinet (Optionnel)</Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-indigo-bloom-700 border-dashed rounded-xl hover:border-indigo-bloom-500 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-indigo-bloom-400" />
                  <div className="flex text-sm text-indigo-bloom-300 justify-center">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-bloom-400 hover:text-indigo-bloom-300">
                      <span>Télécharger un fichier</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                  </div>
                  <p className="text-xs text-indigo-bloom-400/50">PNG, JPG jusqu'à 2MB</p>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-indigo-bloom-500 hover:bg-indigo-bloom-600 text-white font-bold h-11">
              {loading ? "Enregistrement..." : (
                <>Valider et choisir mon plan <CheckCircle className="ml-2 w-4 h-4" /></>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
