"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, UserPlus, Users, Newspaper, Building, FlaskConical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { useAuth } from "@/lib/auth-context";
import type { ApiError } from "@/lib/api";

// ─── Profession choices ────────────────────────────────────────────────────────
// Le rôle backend est toujours CITOYEN.
// La profession sert à identifier le type d'utilisateur (stats, badge, accès export).

type Profession = "CITOYEN" | "JOURNALISTE" | "ONG" | "CHERCHEUR";

const PROFESSIONS: {
  value: Profession;
  label: string;
  icon: React.ElementType;
  desc: string;
}[] = [
  { value: "CITOYEN",     label: "Citoyen",          icon: Users,        desc: "Suivez le budget de votre commune" },
  { value: "JOURNALISTE", label: "Journaliste",       icon: Newspaper,    desc: "Accédez aux données ouvertes et exportez en CSV" },
  { value: "ONG",         label: "ONG / Société civile", icon: Building, desc: "Surveillance citoyenne et plaidoyer budgétaire" },
  { value: "CHERCHEUR",   label: "Chercheur",         icon: FlaskConical, desc: "Analyse des données publiques de transparence" },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [profession, setProfession] = useState<Profession>("CITOYEN");
  const [form, setForm] = useState({
    email: "", nom: "", prenom: "", telephone: "",
    media_organisation: "", password: "", password_confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const showMediaField = profession === "JOURNALISTE" || profession === "ONG";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (form.password !== form.password_confirm) {
      setFieldErrors({ password_confirm: "Les mots de passe ne correspondent pas." });
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        email: form.email,
        nom: form.nom,
        prenom: form.prenom,
        role: "CITOYEN",
        profession,
        password: form.password,
        password_confirm: form.password_confirm,
        telephone: form.telephone || undefined,
        media_organisation: showMediaField ? form.media_organisation : undefined,
      });
      router.push("/public/dashboard");
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.data && typeof apiErr.data === "object") {
        const fields: Record<string, string> = {};
        for (const [k, v] of Object.entries(apiErr.data)) {
          fields[k] = Array.isArray(v) ? v.join(" ") : String(v);
        }
        setFieldErrors(fields);
      }
      setError(apiErr.message ?? "Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const FieldError = ({ field }: { field: string }) =>
    fieldErrors[field] ? (
      <p className="text-xs text-red-600 mt-1">{fieldErrors[field]}</p>
    ) : null;

  const selectedProf = PROFESSIONS.find((p) => p.value === profession)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="text-4xl font-extrabold text-foreground tracking-tight">KOMOE</span>
          <span className="text-xs font-bold px-2 py-1 rounded-full bg-purple-100 text-purple-700 border border-purple-200">
            Polygon Amoy
          </span>
        </div>
        <p className="text-muted-foreground font-medium">Créer votre compte public</p>
        <p className="text-muted-foreground text-sm mt-1">Gratuit · Sécurisé · Accès immédiat aux données budgétaires</p>
      </div>

      <div className="w-full max-w-lg">

        {/* Sélection profession */}
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Vous êtes ?</p>
          <div className="grid grid-cols-2 gap-2">
            {PROFESSIONS.map(({ value, label, icon: Icon, desc }) => (
              <button
                key={value}
                type="button"
                onClick={() => setProfession(value)}
                className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                  profession === value
                    ? "border-[#000040] bg-[#000040]/5"
                    : "border-border hover:border-border bg-card"
                }`}
              >
                <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${profession === value ? "text-foreground" : "text-muted-foreground"}`} />
                <div>
                  <p className={`text-sm font-bold leading-tight ${profession === value ? "text-foreground" : "text-muted-foreground"}`}>
                    {label}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardContent className="p-8">
            <h2 className="text-lg font-bold text-foreground mb-5 text-center">
              Inscription — {selectedProf.label}
            </h2>

            {error && !Object.keys(fieldErrors).length && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Prénom</label>
                  <input
                    type="text" value={form.prenom} onChange={update("prenom")}
                    required placeholder="Mamadou"
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#000040]"
                  />
                  <FieldError field="prenom" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Nom</label>
                  <input
                    type="text" value={form.nom} onChange={update("nom")}
                    required placeholder="Koné"
                    className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#000040]"
                  />
                  <FieldError field="nom" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Adresse email</label>
                <input
                  type="email" value={form.email} onChange={update("email")}
                  required placeholder="vous@exemple.ci" autoComplete="email"
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#000040]"
                />
                <FieldError field="email" />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Téléphone <span className="text-muted-foreground font-normal">(optionnel)</span>
                </label>
                <input
                  type="tel" value={form.telephone} onChange={update("telephone")}
                  placeholder="+225 07 00 00 00 00"
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#000040]"
                />
              </div>

              {showMediaField && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {profession === "JOURNALISTE" ? "Média / Rédaction" : "Organisation"}
                  </label>
                  <input
                    type="text" value={form.media_organisation} onChange={update("media_organisation")}
                    placeholder={profession === "JOURNALISTE" ? "RTI, Fraternité Matin, freelance..." : "Nom de votre ONG ou association"}
                    className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#000040]"
                  />
                  <FieldError field="media_organisation" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Mot de passe</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password} onChange={update("password")}
                    required autoComplete="new-password" placeholder="Minimum 8 caractères"
                    className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#000040] pr-10"
                  />
                  <button
                    type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <FieldError field="password" />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Confirmer le mot de passe</label>
                <input
                  type="password" value={form.password_confirm} onChange={update("password_confirm")}
                  required autoComplete="new-password" placeholder="••••••••"
                  className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#000040]"
                />
                <FieldError field="password_confirm" />
              </div>

              <button
                type="submit" disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-[#000040] hover:bg-[#000060] text-white py-2.5 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isSubmitting ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
                {isSubmitting ? "Création du compte..." : "Créer mon compte"}
              </button>
            </form>

            <div className="mt-5 text-center text-sm text-muted-foreground">
              Déjà un compte ?{" "}
              <Link href="/login" className="text-foreground font-semibold hover:underline">
                Se connecter
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          En créant un compte, vous acceptez que vos commentaires et signalements
          soient publics et associés à votre nom.
        </p>
      </div>
    </div>
  );
}
