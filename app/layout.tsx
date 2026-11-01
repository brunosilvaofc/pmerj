import type { Metadata } from 'next';
import './globals.css';
import { AppearanceSync } from './components/appearance';
export const metadata: Metadata = { title: 'Rumo à Farda | PMERJ e Guarda de São Gonçalo', description: 'Seu plano de estudos para Soldado PMERJ e Guarda Municipal de São Gonçalo. Organize disciplinas, acompanhe seu progresso e construa uma rotina consistente.' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: "(function(){try{var t=localStorage.getItem('rumo-a-farda-theme');document.documentElement.dataset.theme=t==='light'||t==='dark'?t:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}catch(e){document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}})();" }} /></head><body><AppearanceSync />{children}</body></html>;
}
