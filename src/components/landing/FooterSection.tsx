import { GraduationCap } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="py-12 px-4 sm:px-6 border-t border-border bg-card">
      <div className="container max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">Campus Connect Hub</span>
          </div>
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
            <a href="#" className="hover:text-primary transition-colors">Platform About</a>
            <a href="#" className="hover:text-primary transition-colors">Legal & Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terminus</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">© 2026 Campus Connect Hub. Academic Management Systems.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
