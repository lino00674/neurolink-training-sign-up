import { RegistrationForm } from "@/components/RegistrationForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CalendarDays, Clock, MapPin, Sparkles, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen gradient-subtle">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-soft">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">NeuroLink Solutions</span>
          </div>
          <Link to="/rh">
            <Button variant="outline" size="sm" className="gap-2">
              <Users className="w-4 h-4" />
              Área do RH
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-10 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Treinamento Interno
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">
              Dominando a{" "}
              <span className="text-gradient">Automação</span>
              <br />e Microinterações
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Treinamento criado para manter os colaboradores atualizados com demandas de mercado, economizando tempo, aumentando produtividade e integrando serviços essenciais.
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            <div className="bg-card rounded-xl p-5 shadow-card flex items-start gap-4 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CalendarDays className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Datas</h3>
                <p className="text-sm text-muted-foreground">
                  11, 12 e 13 de Dezembro
                </p>
              </div>
            </div>

            <div className="bg-card rounded-xl p-5 shadow-card flex items-start gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Horário</h3>
                <p className="text-sm text-muted-foreground">
                  Início às 10h
                </p>
              </div>
            </div>

            <div className="bg-card rounded-xl p-5 shadow-card flex items-start gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Local</h3>
                <p className="text-sm text-muted-foreground">
                  Sala de Treinamento 25
                </p>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
            <h2 className="text-2xl font-bold mb-6 text-center">
              Faça sua inscrição
            </h2>
            <RegistrationForm />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/50 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © 2024 NeuroLink Solutions — Todos os direitos reservados
        </div>
      </footer>
    </div>
  );
};

export default Index;
