import { ThemeProvider } from '@mui/material/styles';
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../apollo/client'
import { createTheme } from '@mui/material/styles';

let theme = createTheme();


export default function App({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState)

  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    </ThemeProvider>
  )
}
