const dateStr = '2026-02-19T09:36:36.676959+00:00';
try {
    const d = new Date(dateStr);
    console.log('Original:', dateStr);
    console.log('ISO:', d.toISOString());
    console.log('Split:', d.toISOString().split('T')[0]);
} catch (e) {
    console.log('Error:', e.message);
}
