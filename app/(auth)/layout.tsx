export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="from-primary/5 via-background to-primary/10 relative flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(59,130,246,0.05),transparent_50%)]" />
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  )
}
