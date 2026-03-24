import "../static/css/globals.css";

export const metadata = {
  title: "Cronograma-Ude",
  description: "Extracion de cronograma automatizado para UdelaCiudad(No precisamente)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <header>

        </header>
        <main>
            {children}
        </main>
        <footer>
          <p className="copy">®RK</p>
        </footer>
      </body>
    </html>
  );
}
