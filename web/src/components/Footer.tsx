export default function Footer() {
    return (
        <footer className="fixed right-4 bottom-4 w-auto px-6 py-2 text-sm text-right">
            <p className="text-sm text-white">
                &copy; {new Date().getFullYear()} Brasserie.
            </p>
        </footer>
    );
}
