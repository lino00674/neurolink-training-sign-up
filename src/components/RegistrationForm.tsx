import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2, User, Mail, Building, Zap, Calendar, MessageSquare, Accessibility } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  fullName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres").max(100, "Nome muito longo"),
  corporateEmail: z
    .string()
    .email("E-mail inválido")
    .max(255, "E-mail muito longo"),
  department: z.enum(["RH", "TI", "Vendas", "Operações"], {
    required_error: "Selecione um departamento",
  }),
  familiarity: z.enum(["Baixo", "Médio", "Alto"], {
    required_error: "Selecione o nível de familiaridade",
  }),
  needsAccessibility: z.boolean(),
  accessibilityDetails: z.string().optional(),
  observations: z.string().max(500, "Observações muito longas").optional(),
  trainingDay: z.enum(["11/12", "12/12", "13/12"], {
    required_error: "Selecione o dia de participação",
  }),
});

type FormData = z.infer<typeof formSchema>;

export function RegistrationForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      corporateEmail: "",
      needsAccessibility: false,
      accessibilityDetails: "",
      observations: "",
    },
  });

  const watchNeedsAccessibility = form.watch("needsAccessibility");

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      const { error } = await supabase.from("training_registrations").insert({
        full_name: data.fullName,
        corporate_email: data.corporateEmail,
        department: data.department,
        familiarity: data.familiarity,
        needs_accessibility: data.needsAccessibility,
        accessibility_details: data.needsAccessibility ? data.accessibilityDetails : null,
        observations: data.observations || null,
        training_day: data.trainingDay,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Inscrição realizada!",
        description: "Você receberá mais informações por e-mail.",
      });
    } catch (error) {
      console.error("Error submitting registration:", error);
      toast({
        title: "Erro ao realizar inscrição",
        description: "Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <Card className="shadow-card border-0 overflow-hidden animate-scale-in">
        <CardContent className="p-8 md:p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Inscrição Confirmada!</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Sua inscrição no treinamento "Dominando a Automação e Microinterações" foi realizada com sucesso.
          </p>
          <div className="bg-secondary/50 rounded-lg p-4 max-w-sm mx-auto">
            <p className="text-sm text-muted-foreground">
              Você receberá um e-mail de confirmação com mais detalhes em breve.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card border-0 overflow-hidden">
      <CardContent className="p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Nome Completo */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Nome Completo *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite seu nome completo"
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* E-mail Corporativo */}
            <FormField
              control={form.control}
              name="corporateEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    E-mail Corporativo *
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="seu.email@empresa.com"
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Departamento */}
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-primary" />
                    Departamento/Área *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Selecione seu departamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-popover border border-border">
                      <SelectItem value="RH">RH</SelectItem>
                      <SelectItem value="TI">TI</SelectItem>
                      <SelectItem value="Vendas">Vendas</SelectItem>
                      <SelectItem value="Operações">Operações</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nível de Familiaridade */}
            <FormField
              control={form.control}
              name="familiarity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    Nível de Familiaridade com Automação *
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-wrap gap-4 pt-2"
                    >
                      {["Baixo", "Médio", "Alto"].map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <RadioGroupItem value={level} id={level} />
                          <Label htmlFor={level} className="cursor-pointer font-normal">
                            {level}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dia do Treinamento */}
            <FormField
              control={form.control}
              name="trainingDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Dia que irá participar *
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-3 gap-3 pt-2"
                    >
                      {[
                        { value: "11/12", label: "11/12 (Qua)" },
                        { value: "12/12", label: "12/12 (Qui)" },
                        { value: "13/12", label: "13/12 (Sex)" },
                      ].map((day) => (
                        <div key={day.value}>
                          <RadioGroupItem
                            value={day.value}
                            id={day.value}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={day.value}
                            className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                          >
                            <span className="text-sm font-semibold">{day.label}</span>
                            <span className="text-xs text-muted-foreground">às 10h</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Acessibilidade */}
            <FormField
              control={form.control}
              name="needsAccessibility"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="flex items-center gap-2 text-base">
                      <Accessibility className="w-4 h-4 text-primary" />
                      Precisa de Acessibilidade Especial?
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Informe se você necessita de algum recurso especial
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Detalhes de Acessibilidade */}
            {watchNeedsAccessibility && (
              <FormField
                control={form.control}
                name="accessibilityDetails"
                render={({ field }) => (
                  <FormItem className="animate-fade-in">
                    <FormLabel>Descreva sua necessidade de acessibilidade</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ex: Intérprete de Libras, material em Braille, etc."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Observações */}
            <FormField
              control={form.control}
              name="observations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    Observações/Dúvidas (Opcional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Alguma dúvida ou observação?"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Confirmar Inscrição"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
