'use client';

import { ErrorView } from '@/components/error-view/error-view';
import shell from '@/components/shell/shell.module.css';
import { DEFAULT_ACCENT, DEFAULT_THEME } from '@/lib/theme-config';
import '@/styles/tokens.css';
import '@/styles/base.css';

// Last resort: the root layout itself failed, so this renders its own <html> without the shell.
export default function GlobalError() {
  return (
    <html data-accent={DEFAULT_ACCENT} data-theme={DEFAULT_THEME} lang='en'>
      <body>
        <div className={`${shell.app} ${shell.appBare}`}>
          <main className={shell.main}>
            <div className={shell.stage}>
              <ErrorView code='500' />
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
