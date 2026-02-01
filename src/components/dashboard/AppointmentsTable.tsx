import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Agendamento, formatDate, formatPhone, formatTime } from "@/data/dashboardData";
import { cn } from "@/lib/utils";
import { Calendar, Clock, Phone, User } from "lucide-react";

interface AppointmentsTableProps {
  appointments: Agendamento[];
}

export const AppointmentsTable = ({ appointments }: AppointmentsTableProps) => {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in" style={{ animationDelay: "400ms" }}>
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Agendamentos Recentes</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Lista de reuniões e demonstrações agendadas
        </p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="text-muted-foreground font-medium">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Cliente
                </div>
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Data
                </div>
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Hora
                </div>
              </TableHead>
              <TableHead className="text-muted-foreground font-medium hidden lg:table-cell">Serviço</TableHead>
              <TableHead className="text-muted-foreground font-medium">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Telefone
                </div>
              </TableHead>
              <TableHead className="text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right hidden sm:table-cell">
                Tempo de Resposta
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((appointment, index) => (
              <TableRow
                key={`${appointment.nome_cliente}-${appointment.data}-${index}`}
                className="border-border hover:bg-secondary/30 transition-colors"
              >
                <TableCell className="font-medium text-foreground">
                  {appointment.nome_cliente}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDate(appointment.data)}
                </TableCell>
                <TableCell className="text-muted-foreground">{appointment.hora}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium">
                    {appointment.servico}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground font-mono text-sm">
                  {formatPhone(appointment.telefone)}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "status-badge",
                      appointment.status.toLowerCase().trim().includes("agendado") && "status-scheduled",
                      appointment.status.toLowerCase().trim().includes("concluído") && "status-completed",
                      appointment.status.toLowerCase().trim().includes("cancelado") && "status-cancelled",
                      appointment.status.toLowerCase().trim().includes("reagendado") && "status-rescheduled"
                    )}
                  >
                    {appointment.status}
                  </span>
                </TableCell>
                <TableCell className="text-right text-muted-foreground hidden sm:table-cell">
                  {formatTime(appointment.tempo_resposta_s)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
