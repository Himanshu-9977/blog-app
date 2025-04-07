export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  )
}