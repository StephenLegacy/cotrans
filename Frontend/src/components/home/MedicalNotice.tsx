import { AlertTriangle, Shield } from "lucide-react";

export function MedicalNotice() {
  return (
    <section className="py-8 bg-destructive/5 border-y border-destructive/10">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-card rounded-2xl border border-destructive/20 shadow-sm">
          <div className="flex-shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-destructive" />
            </div>
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-destructive" />
              Important Medical Requirement
            </h3>
            <p className="text-foreground font-semibold text-base md:text-lg">
              MANDATORY MEDICAL TEST FEE: Kshs. 8,000 (Non-Refundable)
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              All successful candidates must undergo a mandatory medical examination as part of the UAE 
              employment visa process. This fee covers comprehensive health screening required by UAE 
              immigration authorities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
