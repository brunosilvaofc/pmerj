import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Rumo à Farda | PMERJ e Guarda de São Gonçalo', description: 'Seu plano de estudos para Soldado PMERJ e Guarda Municipal de São Gonçalo. Organize disciplinas, acompanhe seu progresso e construa uma rotina consistente.' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
