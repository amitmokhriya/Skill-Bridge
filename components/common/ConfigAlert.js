'use client';

import React, { useState } from 'react';
import { AlertTriangle, Key, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ConfigAlert() {
  const { isConfigured } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (isConfigured || dismissed) return null;

  return (
    <div className="mb-6 p-4 rounded-xl border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 shadow-sm relative">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-amber-600 dark:text-amber-400 hover:text-amber-800 p-1 rounded-md"
        title="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1.5 pr-6">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <span>Firebase Configuration Required</span>
          </h4>
          <p className="text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
            Please make sure valid Firebase project credentials are set in <code className="bg-amber-100 dark:bg-amber-900/60 px-1.5 py-0.5 rounded text-amber-950 dark:text-amber-100">.env.local</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
