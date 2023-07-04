import "@/styles/globals.css";

// export default function App({ Component, pageProps }) {
//   return <Component {...pageProps} />
// }

import { ExpenseProvider } from "../components/context/ExpenseContext";

function App({ Component, pageProps }) {
  return (
    <ExpenseProvider>
      <Component {...pageProps} />
    </ExpenseProvider>
  );
}

export default App;
