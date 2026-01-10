import { useState } from "react";
import { HeadsetIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const WEBHOOK_URL = "https://n8n.mirako.org/webhook/ab926d42-90ab-4b22-949b-70081535ca7f";

export const SupportModal = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nomeEmpresa: "",
    telefone: "",
    email: "",
    descricao: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome_empresa: formData.nomeEmpresa,
          telefone: formData.telefone,
          email: formData.email,
          descricao: formData.descricao,
          data_envio: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        toast({
          title: "Mensagem enviada!",
          description: "Nossa equipe entrará em contato em breve.",
        });
        setFormData({ nomeEmpresa: "", telefone: "", email: "", descricao: "" });
        setOpen(false);
      } else {
        throw new Error("Erro ao enviar mensagem");
      }
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <HeadsetIcon className="w-4 h-4" />
          Suporte
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-[#1a1a1a] border-[#333] text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Fale com o Suporte
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="nomeEmpresa" className="text-gray-300 text-sm">
              Nome da Empresa
            </Label>
            <Input
              id="nomeEmpresa"
              name="nomeEmpresa"
              placeholder="Sua empresa"
              value={formData.nomeEmpresa}
              onChange={handleChange}
              required
              className="bg-[#2a2a2a] border-[#444] text-white placeholder:text-gray-500 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefone" className="text-gray-300 text-sm">
              Telefone
            </Label>
            <Input
              id="telefone"
              name="telefone"
              placeholder="(11) 99999-9999"
              value={formData.telefone}
              onChange={handleChange}
              required
              className="bg-[#2a2a2a] border-[#444] text-white placeholder:text-gray-500 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300 text-sm">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-[#2a2a2a] border-[#444] text-white placeholder:text-gray-500 focus:border-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descricao" className="text-gray-300 text-sm">
              Descrição
            </Label>
            <Textarea
              id="descricao"
              name="descricao"
              placeholder="Como podemos ajudar?"
              value={formData.descricao}
              onChange={handleChange}
              required
              rows={4}
              className="bg-[#2a2a2a] border-[#444] text-white placeholder:text-gray-500 focus:border-emerald-500 resize-none"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Enviando...
              </>
            ) : (
              "Enviar Mensagem"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
