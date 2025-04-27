export default function Footer() {
    return (
    <footer className="fixed bottom-0 w-full h-auto px-6 pb-6 text-sm text-right z-70">
        <div className="container mx-auto">
        <p className="text-sm">
            &copy; {new Date().getFullYear()} Brasserie.
        </p>
        </div>
    </footer>
    );
}
