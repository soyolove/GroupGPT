interface CreateLayoutProps {
  children: React.ReactNode;
}

export default async function ChatLayout({ children }: CreateLayoutProps) {
  return (
    <div>
      <div className="container relative">
        <div className="overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:shadow-xl">
            <div className=''>
          {children}
          </div>
        </div>
      </div>
    </div>
  );
}
