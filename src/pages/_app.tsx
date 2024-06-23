import type { NextPage } from 'next';
import type { AppType, AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';

import '~/styles/globals.css';
import { trpc } from '~/utils/trpc';
import { PaginationProvider } from '~/contexts/PaginationContext';
import { GlobalStateProvider } from '~/contexts/GlobalStateContext';

export type NextPageWithLayout<
  TProps = Record<string, unknown>,
  TInitialProps = TProps,
> = NextPage<TProps, TInitialProps> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = (({ Component, pageProps }: AppPropsWithLayout) => {
  return (
    <PaginationProvider>
      <Component {...pageProps} />
    </PaginationProvider>
  );
}) as AppType;

export default trpc.withTRPC(MyApp);