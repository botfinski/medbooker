const currentYear = new Date().getFullYear();

function CopyFooterText() {
	return <>&copy; {currentYear} MedBooker</>;
}

export default CopyFooterText;
