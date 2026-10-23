'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';
import { RippleBackground } from '@/components/ripple-background/ripple-background';
import { Footer } from '@/components/shell/footer';
import { Header } from '@/components/shell/header';
import { Sidebar } from '@/components/shell/sidebar';
import { TabBar } from '@/components/shell/tab-bar';
import { TokenPanel } from '@/components/token-panel/token-panel';
import { useCurrentPage } from '@/hooks/use-current-page';
import { useFadeNavigation } from '@/hooks/use-fade-navigation';
import { usePathname } from '@/hooks/use-navigation';
import { cx } from '@/lib/cx';
import { MAIN_ID } from '@/lib/dom-ids';
import { TOKEN_TABS, type TokenTab } from '@/lib/tokens';
import styles from './shell.module.css';

type Props = {
  children: ReactNode;
};

export function Shell({ children }: Props) {
  const pathname = usePathname();
  const page = useCurrentPage();
  const { leaving, go } = useFadeNavigation(pathname);
  const [panel, setPanel] = useState(false);
  const [panelTab, setPanelTab] = useState<TokenTab | undefined>();
  const mainRef = useRef<HTMLElement>(null);
  const tokensButton = useRef<HTMLButtonElement>(null);
  const firstRender = useRef(true);

  // After a route change, move focus to <main> (not on the first load).
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs once per route change
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  // Preview flags: ?tokens=1 opens the customize panel, ?tab=colors|spacing|type|motion picks its tab.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = TOKEN_TABS.find((t) => t === params.get('tab'));
    if (tab) setPanelTab(tab);
    if (params.get('tokens') === '1') setPanel(true);
  }, []);

  return (
    <div className={styles.app}>
      <Header file={page.file} />

      <div className={styles.body}>
        <Sidebar currentId={page.id} onNavigate={go} />

        {/* the ripple sits behind <main>, which scrolls, so it stays put while the page moves */}
        <div className={styles.content}>
          <RippleBackground />
          <main className={styles.main} id={MAIN_ID} ref={mainRef} tabIndex={-1}>
            <div className={cx(styles.stage, leaving && styles.leaving)}>{children}</div>
          </main>
        </div>
      </div>

      <Footer
        onTogglePanel={() => setPanel((open) => !open)}
        panelOpen={panel}
        status={page.status}
        tokensButtonRef={tokensButton}
      />

      {/* keyed by the starting tab, so a ?tab= preview flag re-seeds the panel */}
      <TokenPanel
        initialTab={panelTab}
        key={panelTab ?? 'default'}
        onClose={() => {
          setPanel(false);
          tokensButton.current?.focus();
        }}
        open={panel}
      />

      <TabBar currentId={page.id} onNavigate={go} />
    </div>
  );
}
