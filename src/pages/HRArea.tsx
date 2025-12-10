import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Download,
  Search,
  Users,
  Filter,
  Sparkles,
  LogOut,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";

type Registration = {
  id: string;
  full_name: string;
  corporate_email: string;
  department: string;
  familiarity: string;
  needs_accessibility: boolean;
  accessibility_details: string | null;
  observations: string | null;
  training_day: string;
  created_at: string;
};

export default function HRArea() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState<Registration[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [dayFilter, setDayFilter] = useState<string>("all");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/auth");
      } else {
        fetchRegistrations();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  async function fetchRegistrations() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("training_registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      setRegistrations(data || []);
      setFilteredRegistrations(data || []);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      toast({
        title: "Erro ao carregar inscrições",
        description: "Por favor, recarregue a página.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let filtered = registrations;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.full_name.toLowerCase().includes(search) ||
          r.corporate_email.toLowerCase().includes(search)
      );
    }

    if (departmentFilter !== "all") {
      filtered = filtered.filter((r) => r.department === departmentFilter);
    }

    if (dayFilter !== "all") {
      filtered = filtered.filter((r) => r.training_day === dayFilter);
    }

    setFilteredRegistrations(filtered);
  }, [searchTerm, departmentFilter, dayFilter, registrations]);

  function exportToCSV() {
    const headers = [
      "Nome",
      "E-mail",
      "Departamento",
      "Familiaridade",
      "Acessibilidade",
      "Detalhes Acessibilidade",
      "Observações",
      "Dia",
      "Data Inscrição",
    ];

    const csvContent = [
      headers.join(","),
      ...filteredRegistrations.map((r) =>
        [
          `"${r.full_name}"`,
          `"${r.corporate_email}"`,
          `"${r.department}"`,
          `"${r.familiarity}"`,
          r.needs_accessibility ? "Sim" : "Não",
          `"${r.accessibility_details || ""}"`,
          `"${r.observations || ""}"`,
          `"${r.training_day}"`,
          new Date(r.created_at).toLocaleString("pt-BR"),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `inscricoes-treinamento-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Exportação concluída!",
      description: `${filteredRegistrations.length} registros exportados.`,
    });
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/auth");
  }

  if (!session) {
    return null;
  }

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
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden md:block">
              {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para inscrição
        </Link>

        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Área do RH</h1>
            <p className="text-muted-foreground">
              Gerencie as inscrições do treinamento
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm py-1.5 px-3">
              <Users className="w-4 h-4 mr-2" />
              {filteredRegistrations.length} inscritos
            </Badge>
            <Button onClick={exportToCSV} variant="default" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar CSV
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-card border-0">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-3">
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[160px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Departamento" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border">
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="RH">RH</SelectItem>
                    <SelectItem value="TI">TI</SelectItem>
                    <SelectItem value="Vendas">Vendas</SelectItem>
                    <SelectItem value="Operações">Operações</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={dayFilter} onValueChange={setDayFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Dia" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border border-border">
                    <SelectItem value="all">Todos dias</SelectItem>
                    <SelectItem value="11/12">11/12</SelectItem>
                    <SelectItem value="12/12">12/12</SelectItem>
                    <SelectItem value="13/12">13/12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="shadow-card border-0 overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredRegistrations.length === 0 ? (
              <div className="text-center py-20">
                <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma inscrição encontrada</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Nome</TableHead>
                      <TableHead className="font-semibold">E-mail</TableHead>
                      <TableHead className="font-semibold">Depto</TableHead>
                      <TableHead className="font-semibold">Familiaridade</TableHead>
                      <TableHead className="font-semibold text-center">Acessibilidade</TableHead>
                      <TableHead className="font-semibold">Dia</TableHead>
                      <TableHead className="font-semibold">Observações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRegistrations.map((registration) => (
                      <TableRow key={registration.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">
                          {registration.full_name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {registration.corporate_email}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-normal">
                            {registration.department}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              registration.familiarity === "Alto"
                                ? "default"
                                : "outline"
                            }
                            className={
                              registration.familiarity === "Alto"
                                ? "bg-success text-success-foreground"
                                : registration.familiarity === "Médio"
                                ? "border-warning text-warning"
                                : ""
                            }
                          >
                            {registration.familiarity}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {registration.needs_accessibility ? (
                            <div className="flex items-center justify-center gap-1">
                              <CheckCircle className="w-4 h-4 text-success" />
                              {registration.accessibility_details && (
                                <span className="text-xs text-muted-foreground max-w-[100px] truncate" title={registration.accessibility_details}>
                                  {registration.accessibility_details}
                                </span>
                              )}
                            </div>
                          ) : (
                            <XCircle className="w-4 h-4 text-muted-foreground/50 mx-auto" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{registration.training_day}</Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate text-muted-foreground text-sm" title={registration.observations || ""}>
                          {registration.observations || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
