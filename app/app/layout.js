import "./globals.css";

export const metadata = {
  title: "Handover",
  description: "Canterbury's marketplace for student room handovers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
