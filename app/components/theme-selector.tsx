'use client';
import { Moon, Sun, Monitor } from 'lucide-react';
import { AppearanceStatus, useAppearance } from './appearance';
import type { Theme } from '../lib/appearance-store';

export function ThemeSelector() {
  const { preferences, ready, status, change } = useAppearance();
  const Icon = preferences.theme === 'dark' ? Moon : preferences.theme === 'light' ? Sun : Monitor;
  return <div className="theme-control">
    <label className="theme-selector">
      <Icon size={16} aria-hidden="true" />
      <span className="sr-only">Tema da aparência</span>
      <select disabled={!ready} value={preferences.theme} onChange={event => change({ theme: event.target.value as Theme })}>
        <option value="light">Claro</option><option value="dark">Escuro</option><option value="system">Automático</option>
      </select>
    </label>
    {status === 'error' ? <AppearanceStatus /> : <span className="sr-only"><AppearanceStatus /></span>}
  </div>;
}
