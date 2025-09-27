const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Your App Name. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
