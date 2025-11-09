export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Tuxedo Rental Admin</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="antialiased bg-gray-100">
        {children}
      </body>
    </html>
  );
}